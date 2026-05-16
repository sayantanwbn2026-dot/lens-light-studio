import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { MediaFile } from '../../types/database';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { Copy, Trash2, UploadCloud, Check } from 'lucide-react';

export const MediaLibrary = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setLoading(true);
        const { data } = await supabase.from('media_library').select('*').order('uploaded_at', { ascending: false });
        if (data) setFiles(data);
        setLoading(false);
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploading(true);

            const newFiles = Array.from(event.target.files);

            for (const file of newFiles) {
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds 10MB limit.`);
                    continue;
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('media')
                    .getPublicUrl(fileName);

                await supabase.from('media_library').insert([{
                    file_url: publicUrl,
                    file_name: file.name,
                    file_size: file.size,
                    tags: []
                }]);
            }

            await fetchMedia();

        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
        } finally {
            setUploading(false);
        }
    };

    const handleCopyUrl = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        alert('URL Copied to clipboard!');
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selectedIds.size} files? This cannot be undone.`)) return;

        // Delete from DB
        const idsToDelete = Array.from(selectedIds);
        await supabase.from('media_library').delete().in('id', idsToDelete);

        // Attempt delete from storage
        const filesToDeleteNames = files.filter(f => selectedIds.has(f.id)).map(f => {
            // Extract filename from URL - rudimentary approach
            const parts = f.file_url.split('/');
            return parts[parts.length - 1];
        });

        if (filesToDeleteNames.length > 0) {
            await supabase.storage.from('media').remove(filesToDeleteNames);
        }

        setSelectedIds(new Set());
        await fetchMedia();
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const filteredFiles = useMemo(() => {
        return files.filter(f => f.file_name.toLowerCase().includes(search.toLowerCase()));
    }, [files, search]);

    return (
        <div className="animate-in fade-in duration-700 pb-32">
            <AdminPageHeader title="MEDIA LIBRARY" overline="MANAGING" />

            {/* Upload Zone */}
            <div className="mb-12">
                <label className="relative flex flex-col items-center justify-center w-full min-h-[160px] border-border border border-dashed border-[#2A2A2A] hover:border-white transition-colors cursor-pointer bg-[#0A0A0A]">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-6 h-6 border-2 border-t-white border-[#2A2A2A] rounded-full animate-spin" />
                                <p className="text-[12px] font-light text-white uppercase tracking-widest">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 text-[#5A5A5A] mb-4" />
                                <p className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wide">
                                    Drag images here or click to browse
                                </p>
                                <p className="text-[10px] uppercase text-[#5A5A5A] tracking-wider mt-2">
                                    JPG, PNG, WebP. Max 10MB/file.
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {/* Top Controls */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E1E1E]">
                <div className="w-full max-w-sm">
                    <AdminInput
                        placeholder="Search by filename..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-[12px] font-light text-[#5A5A5A] uppercase tracking-widest">
                    {filteredFiles.length} files total
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="aspect-square bg-[#0A0A0A] border border-[#1E1E1E]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => {
                        const isSelected = selectedIds.has(file.id);
                        return (
                            <div
                                key={file.id}
                                onClick={(e) => toggleSelect(file.id, e)}
                                className={`group relative bg-[#0A0A0A] border transition-colors cursor-pointer aspect-square flex flex-col ${isSelected ? 'border-white' : 'border-[#1E1E1E] hover:border-[#3A3A3A]'
                                    }`}
                            >
                                <div className="flex-1 overflow-hidden relative">
                                    <img src={file.file_url} alt={file.file_name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />

                                    {/* Select Checkbox (top left) */}
                                    <div className={`absolute top-2 left-2 w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? 'bg-white border-white' : 'border-white/50 bg-black/50 opacity-0 group-hover:opacity-100'} backdrop-blur-sm`}>
                                        {isSelected && <Check className="w-3 h-3 text-black" />}
                                    </div>

                                    {/* Copy URL Button (center overlay on hover) */}
                                    <button
                                        onClick={(e) => handleCopyUrl(file.file_url, e)}
                                        className="absolute inset-0 m-auto w-max h-max bg-white text-black px-4 py-1.5 rounded-full text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300"
                                    >
                                        <Copy className="w-3 h-3" /> Copy URL
                                    </button>
                                </div>

                                <div className="p-3 bg-[#050505] border-t border-[#1E1E1E] flex flex-col gap-1">
                                    <span className="text-[11px] text-white font-light truncate">{file.file_name}</span>
                                    <span className="text-[9px] text-[#5A5A5A] uppercase tracking-wider">{formatSize(file.file_size)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {filteredFiles.length === 0 && !loading && (
                <div className="p-16 text-center border-dashed border border-[#1E1E1E]">
                    <p className="text-[12px] uppercase tracking-widest text-[#5A5A5A]">No matching media found.</p>
                </div>
            )}

            {/* Bulk Action Sticky Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black border border-white p-4 flex items-center gap-8 shadow-2xl z-50 animate-in slide-in-from-bottom-5">
                    <span className="text-[13px] font-light text-white uppercase tracking-widest pl-4">
                        {selectedIds.size} ITEMS SELECTED
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 transition-colors uppercase text-[11px] tracking-widest font-medium"
                    >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Selected
                    </button>
                </div>
            )}

        </div>
    );
};
