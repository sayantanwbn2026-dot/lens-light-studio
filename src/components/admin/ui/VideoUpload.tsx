import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { UploadCloud, X, Film, AlertCircle } from 'lucide-react';

interface VideoUploadProps {
    label?: string;
    description?: string;
    value: string | null;
    onChange: (url: string | null) => void;
    bucket?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
    label,
    description,
    value,
    onChange,
    bucket = 'media'
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);
            setUploadProgress('Preparing...');

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select a video to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
            const fileName = `videos/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

            const mimeMap: Record<string, string> = {
                mp4: 'video/mp4',
                webm: 'video/webm',
                ogg: 'video/ogg',
                mov: 'video/quicktime',
                avi: 'video/x-msvideo',
            };
            const contentType = mimeMap[fileExt] || file.type || 'video/mp4';

            const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);
            setUploadProgress(`Uploading ${fileSizeMB}MB (0%)...`);

            // Use XMLHttpRequest to get real-time upload progress instead of fetch
            const { data: { session } } = await supabase.auth.getSession();
            const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const token = session?.access_token || anonKey;
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jgikemqmeryuesjgepxb.supabase.co';

            const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${fileName}`;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', uploadUrl, true);
                
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                xhr.setRequestHeader('apikey', anonKey);
                xhr.setRequestHeader('Content-Type', contentType);
                xhr.setRequestHeader('Cache-Control', '3600');
                xhr.setRequestHeader('x-upsert', 'false');

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        setUploadProgress(`Uploading ${fileSizeMB}MB (${percentComplete}%)...`);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        let errorMsg = xhr.responseText;
                        try {
                            const parsed = JSON.parse(xhr.responseText);
                            errorMsg = parsed.message || errorMsg;
                        } catch {
                            // Ignore parse errors
                        }
                        
                        // Retry with upsert if already exists
                        if (errorMsg.includes('already exists')) {
                            // Let's just reject and handle it below or fail
                            reject(new Error('File collision, please try again.'));
                        } else if (errorMsg.includes('mime type') || errorMsg.includes('not supported') || xhr.status === 415) {
                            reject(new Error(
                                `The "${bucket}" bucket still doesn't allow video files.\n\n` +
                                `In Supabase Dashboard → Storage → Buckets → Edit "${bucket}":\n` +
                                `• Clear the "Allowed MIME types" field (to allow all), or\n` +
                                `• Add: video/mp4, video/webm, video/ogg, video/quicktime`
                            ));
                        } else {
                            reject(new Error(errorMsg || `Upload failed with status ${xhr.status}`));
                        }
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('Network error during upload. Please check your connection or file size limit.'));
                };

                xhr.send(file);
            });

            setUploadProgress('Finalizing...');
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
            setUploadProgress('');

        } catch (err) {
            console.error('Error uploading video:', err);
            const msg = (err as Error)?.message || 'Unknown error uploading video';
            setError(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {label && (
                <label className="text-[11px] font-light text-[#8A8A8A] tracking-wider uppercase">
                    {label}
                </label>
            )}

            {value ? (
                <div className="relative group w-full aspect-video rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#0A0A0A]">
                    <video
                        src={value}
                        controls
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                    <button
                        onClick={() => onChange(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Remove video"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    <label className={`relative flex flex-col items-center justify-center w-full aspect-video border border-dashed transition-colors cursor-pointer bg-black/20 hover:bg-white/5 ${error ? 'border-red-500/50' : 'border-[#2A2A2A] hover:border-white'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-t-white border-[#2A2A2A] rounded-full animate-spin" />
                                    <p className="text-[11px] text-[#8A8A8A] font-light">{uploadProgress}</p>
                                </div>
                            ) : (
                                <>
                                    <Film className="w-8 h-8 text-[#5A5A5A] mb-4" />
                                    <p className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wide">
                                        Drag video here or click to browse
                                    </p>
                                    {description && (
                                        <p className="text-[10px] text-[#5A5A5A] mt-2 font-light">
                                            {description}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>

                    {error && (
                        <div className="flex gap-2 p-3 bg-red-950/30 border border-red-500/30 rounded-sm">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div className="text-[11px] text-red-300 font-light whitespace-pre-line leading-relaxed">
                                {error}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
