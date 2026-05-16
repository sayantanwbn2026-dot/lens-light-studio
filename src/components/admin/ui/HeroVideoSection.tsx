import React, { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { AdminToggle } from './AdminToggle';
import { Upload, FileVideo, Play, Trash2, X, Check } from 'lucide-react';

// Helper functions
function formatBytes(bytes: number): string {
    if (!bytes) return '—';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
}

function formatDuration(secs: number): string {
    if (!secs) return '—';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatRelativeTime(dateString: string): string {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

const generateThumbnail = async (file: File, videoUrl: string): Promise<string | null> => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        video.muted = true;
        video.currentTime = 0.5; // Half a second in

        video.onloadeddata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(null); return; }
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(async (blob) => {
                if (!blob) { resolve(null); return; }
                const thumbName = `thumb_${Date.now()}.jpg`;
                const { data, error } = await supabase.storage
                    .from('hero-videos')
                    .upload(thumbName, blob, {
                        contentType: 'image/jpeg',
                        upsert: true
                    });
                if (error || !data) { resolve(null); return; }
                const { data: { publicUrl } } = supabase.storage
                    .from('hero-videos')
                    .getPublicUrl(thumbName);
                resolve(publicUrl);
            }, 'image/jpeg', 0.85);
            URL.revokeObjectURL(video.src);
        };
        video.src = videoUrl;
        video.load();
    });
};

import { HeroContent } from '@/types/database';

interface HeroVideoSectionProps {
    heroData: HeroContent & { id?: number; hero_video_filename?: string; hero_video_size_bytes?: number; hero_video_duration_secs?: number; hero_video_uploaded_at?: string; hero_video_thumbnail_url?: string };
    onUpdate: (data: HeroContent) => void;
}

export const HeroVideoSection: React.FC<HeroVideoSectionProps> = ({ heroData, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = async (file: File) => {
        setUploadError(null);
        setUploadSuccess(false);

        // 1. FILE TYPE
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Invalid file type. Please upload MP4 or WebM.');
            return;
        }

        // 2. FILE SIZE
        const maxSize = 30 * 1024 * 1024; // 30MB
        if (file.size > maxSize) {
            setUploadError(`File is ${formatBytes(file.size)}. Maximum allowed size is 30MB.`);
            return;
        }

        // 3. VIDEO DURATION
        const checkDuration = (): Promise<number> => {
            return new Promise((resolve, reject) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);
                    resolve(video.duration);
                };
                video.onerror = () => reject(new Error('Cannot read video'));
                video.src = URL.createObjectURL(file);
            });
        };

        try {
            const duration = await checkDuration();
            if (duration > 15) {
                setUploadError(`Video is ${duration.toFixed(1)}s long. Maximum duration is 15 seconds.`);
                return;
            }

            // Start Upload
            setUploading(true);
            setUploadProgress(0);

            // Clear previous if exists
            if (heroData.hero_video_filename) {
                const prevFilename = heroData.hero_video_url?.split('/').pop();
                const prevThumb = heroData.hero_video_thumbnail_url?.split('/').pop();
                const toRemove = [];
                if (prevFilename) toRemove.push(prevFilename);
                if (prevThumb) toRemove.push(prevThumb);
                if (toRemove.length > 0) {
                    await supabase.storage.from('hero-videos').remove(toRemove);
                }
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `hero_${Date.now()}.${fileExt}`;
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            // Using fetch / XMLHttpRequest for progress since supabase-js standard upload doesn't support progress well yet
            const { data: { session } } = await supabase.auth.getSession();
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const token = session?.access_token || anonKey;
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const uploadUrl = `${supabaseUrl}/storage/v1/object/hero-videos/${fileName}`;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', uploadUrl, true);
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.setRequestHeader('apikey', anonKey);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.setRequestHeader('Cache-Control', '3600');
                xhr.setRequestHeader('x-upsert', 'true');

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const pct = Math.round((e.loaded / e.total) * 100);
                        setUploadProgress(pct);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) resolve();
                    else reject(new Error(`Upload failed with status ${xhr.status}`));
                };
                xhr.onerror = () => reject(new Error('Network error during upload'));
                xhr.onabort = () => reject(new Error('Upload cancelled'));
                
                abortController.signal.addEventListener('abort', () => xhr.abort());
                xhr.send(file);
            });

            const { data: { publicUrl: publicVideoUrl } } = supabase.storage
                .from('hero-videos')
                .getPublicUrl(fileName);

            // Generate thumbnail
            const thumbnailUrl = await generateThumbnail(file, URL.createObjectURL(file));

            const newVideoData = {
                hero_video_url: publicVideoUrl,
                hero_video_enabled: true,
                hero_video_filename: file.name,
                hero_video_size_bytes: file.size,
                hero_video_duration_secs: duration,
                hero_video_thumbnail_url: thumbnailUrl,
                hero_video_uploaded_at: new Date().toISOString(),
            };

            const { error: dbError } = await supabase
                .from('hero_content')
                .update(newVideoData)
                .eq('id', heroData.id || 1);

            if (dbError) throw dbError;

            // Clear cache
            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('hero_content')) sessionStorage.removeItem(key);
            });

            onUpdate({ ...heroData, ...newVideoData });
            setUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);

        } catch (err) {
            console.error(err);
            if ((err as Error).message !== 'Upload cancelled') {
                setUploadError((err as Error).message || 'Error uploading video');
            }
            setUploading(false);
        }
    };

    const cancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async () => {
        try {
            const prevFilename = heroData.hero_video_url?.split('/').pop();
            const prevThumb = heroData.hero_video_thumbnail_url?.split('/').pop();
            const toRemove = [];
            if (prevFilename) toRemove.push(prevFilename);
            if (prevThumb) toRemove.push(prevThumb);
            
            if (toRemove.length > 0) {
                await supabase.storage.from('hero-videos').remove(toRemove);
            }

            const nullData = {
                hero_video_url: null,
                hero_video_enabled: false,
                hero_video_filename: null,
                hero_video_size_bytes: null,
                hero_video_duration_secs: null,
                hero_video_thumbnail_url: null,
                hero_video_uploaded_at: null,
            };

            await supabase
                .from('hero_content')
                .update(nullData)
                .eq('id', heroData.id || 1);

            Object.keys(sessionStorage).forEach(key => {
                if (key.includes('hero_content')) sessionStorage.removeItem(key);
            });

            onUpdate({ ...heroData, ...nullData });
            setDeleteConfirm(false);

        } catch (err) {
            console.error(err);
            alert('Failed to delete video');
        }
    };

    return (
        <div className="bg-[#080808] border border-[#1A1A1A] p-8 mb-6 relative">
            <div className="font-inter font-medium text-[10px] text-[#3A3A3A] tracking-[0.2em] uppercase">
                HERO VIDEO (OPTIONAL)
            </div>
            <div className="font-inter font-light text-[11px] text-[#3A3A3A] leading-[1.6] mt-2 mb-6">
                Upload a short looping video to replace the static background image in the hero section. The video plays automatically on mute in a loop.
            </div>

            {/* VIDEO ENABLED TOGGLE */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#111111]">
                <div>
                    <div className="font-inter font-normal text-[13px] text-[#FFFFFF]">Enable video background</div>
                    <div className="font-inter font-light text-[11px] text-[#4A4A4A] mt-1">When enabled, the video replaces the static hero image.</div>
                </div>
                <AdminToggle
                    checked={heroData.hero_video_enabled || false}
                    onChange={(checked) => {
                        const updated = { ...heroData, hero_video_enabled: checked };
                        onUpdate(updated);
                        supabase.from('hero_content').update({ hero_video_enabled: checked }).eq('id', heroData.id || 1);
                    }}
                />
            </div>

            <div style={{ opacity: heroData.hero_video_enabled ? 1 : 0.4, pointerEvents: heroData.hero_video_enabled ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
                
                {/* CURRENT VIDEO STATUS */}
                {heroData.hero_video_url && !uploading && (
                    <div className="bg-[#050505] border border-[#1A1A1A] px-5 py-4 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {heroData.hero_video_thumbnail_url ? (
                                <img src={heroData.hero_video_thumbnail_url} alt="Thumb" className="w-[64px] h-[36px] object-cover rounded-sm" />
                            ) : (
                                <div className="w-[64px] h-[36px] bg-[#0A0A0A] rounded-sm flex items-center justify-center">
                                    <FileVideo className="w-[14px] h-[14px] text-[#3A3A3A]" />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <div className="font-inter font-normal text-[12px] text-[#FFFFFF] truncate max-w-[200px]">
                                    {heroData.hero_video_filename?.substring(0, 30) || 'video.mp4'}
                                    {(heroData.hero_video_filename?.length || 0) > 30 ? '...' : ''}
                                </div>
                                <div className="flex items-center gap-3 font-inter font-light text-[10px] text-[#4A4A4A]">
                                    <span>{formatBytes(heroData.hero_video_size_bytes)}</span>
                                    <span>·</span>
                                    <span>{formatDuration(heroData.hero_video_duration_secs)}</span>
                                    <span>·</span>
                                    <span className="text-[#3A3A3A]">{formatRelativeTime(heroData.hero_video_uploaded_at)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setPreviewModal(true)} className="text-[#4A4A4A] hover:text-white transition-colors" title="Preview">
                                <Play className="w-[14px] h-[14px]" />
                            </button>
                            <button onClick={() => setDeleteConfirm(true)} className="text-[#3A3A3A] hover:text-white transition-colors" title="Remove">
                                <Trash2 className="w-[14px] h-[14px]" />
                            </button>
                        </div>
                    </div>
                )}

                {/* DELETE CONFIRM INLINE */}
                {deleteConfirm && (
                    <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 mb-4 flex items-center justify-between animate-in fade-in">
                        <div className="font-inter font-light text-[12px] text-[#8A8A8A]">
                            Remove this video? The hero will revert to the static background image.
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleDelete} className="px-4 py-1.5 bg-white text-black font-inter text-[11px] rounded-sm hover:bg-gray-200 transition-colors">
                                Remove
                            </button>
                            <button onClick={() => setDeleteConfirm(false)} className="px-4 py-1.5 border border-[#2A2A2A] text-white font-inter text-[11px] rounded-sm hover:border-white transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* UPLOAD ZONE */}
                {!uploading && !uploadSuccess && (
                    <div>
                        <div 
                            className={`p-9 text-center border transition-colors cursor-pointer ${dragActive ? 'border-white bg-[#0A0A0A]' : 'border-dashed border-[#2A2A2A] hover:border-[#4A4A4A]'}`}
                            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-5 h-5 text-[#2A2A2A] mx-auto" />
                            <div className="font-inter font-medium text-[10px] text-[#3A3A3A] tracking-[0.15em] uppercase mt-3">
                                {heroData.hero_video_url ? 'REPLACE VIDEO' : 'DRAG VIDEO HERE OR CLICK TO BROWSE'}
                            </div>
                            <div className="font-inter font-light text-[10px] text-[#2A2A2A] mt-2">
                                MP4 or WebM · Maximum 30MB · 15 seconds
                            </div>
                            <div className="flex justify-center gap-2 mt-3">
                                <span className="h-5 px-2 border border-[#222222] rounded-full font-inter font-normal text-[9px] text-[#3A3A3A] flex items-center">30MB MAX</span>
                                <span className="h-5 px-2 border border-[#222222] rounded-full font-inter font-normal text-[9px] text-[#3A3A3A] flex items-center">15 SEC MAX</span>
                                <span className="h-5 px-2 border border-[#222222] rounded-full font-inter font-normal text-[9px] text-[#3A3A3A] flex items-center">MP4 / WEBM</span>
                            </div>
                        </div>
                        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
                        
                        {uploadError && (
                            <div className="mt-2 font-inter font-light text-[11px] text-[#8A8A8A] italic animate-in fade-in">
                                ⚠ {uploadError}
                            </div>
                        )}
                    </div>
                )}

                {/* UPLOAD PROGRESS */}
                {uploading && (
                    <div className="border border-[#1A1A1A] py-8 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <FileVideo className="w-4 h-4 text-[#4A4A4A]" />
                            <span className="font-inter font-normal text-[12px] text-[#FFFFFF] truncate max-w-[200px]">
                                {fileInputRef.current?.files?.[0]?.name || 'video.mp4'}
                            </span>
                            <span className="font-inter font-light text-[10px] text-[#4A4A4A]">
                                {fileInputRef.current?.files?.[0] ? formatBytes(fileInputRef.current.files[0].size) : ''}
                            </span>
                        </div>
                        <div className="mt-5 w-full h-[2px] bg-[#1A1A1A] rounded-[1px] overflow-hidden">
                            <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <div className="mt-2.5 font-inter font-medium text-[11px] text-[#FFFFFF]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {uploadProgress}%
                        </div>
                        <div className="mt-1 font-inter font-light text-[10px] text-[#4A4A4A]">Uploading...</div>
                        <button onClick={cancelUpload} className="mt-4 font-inter font-normal text-[11px] text-[#4A4A4A] hover:text-white transition-colors">
                            Cancel
                        </button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {uploadSuccess && (
                    <div className="border border-[#1A1A1A] py-8 px-6 flex flex-col items-center justify-center animate-in fade-in">
                        <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center mb-2">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <div className="font-inter font-light text-[12px] text-[#6B6B6B]">Video uploaded successfully.</div>
                    </div>
                )}
            </div>

            {/* PREVIEW MODAL */}
            {previewModal && (
                <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center" onClick={() => setPreviewModal(false)}>
                    <button className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity" onClick={() => setPreviewModal(false)}>
                        <X className="w-5 h-5" />
                    </button>
                    <div className="max-w-[80vw] max-h-[70vh]" onClick={e => e.stopPropagation()}>
                        <video src={heroData.hero_video_url} controls className="w-full h-full max-h-[70vh] rounded-sm object-contain bg-black" />
                    </div>
                    <div className="mt-4 font-inter font-light text-[11px] text-[#6B6B6B] text-center">
                        {heroData.hero_video_filename} · {formatBytes(heroData.hero_video_size_bytes)} · {formatDuration(heroData.hero_video_duration_secs)}
                    </div>
                </div>
            )}
        </div>
    );
};
