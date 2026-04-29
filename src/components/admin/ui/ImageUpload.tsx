import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
    label?: string;
    description?: string;
    value: string | null;
    onChange: (url: string | null) => void;
    bucket?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    label,
    description,
    value,
    onChange,
    bucket = 'media'
}) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onChange(publicUrl);

            // Optionally record to media_library table
            await supabase.from('media_library').insert([{
                file_url: publicUrl,
                file_name: file.name,
                file_size: file.size,
            }]);

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image!');
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
                    <img
                        src={value}
                        alt="Uploaded representation"
                        className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                    <button
                        onClick={() => onChange(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="relative flex flex-col items-center justify-center w-full aspect-video border-border border border-dashed border-[#2A2A2A] hover:border-white transition-colors cursor-pointer bg-black/20 hover:bg-white/5">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="w-5 h-5 border-2 border-t-white border-[#2A2A2A] rounded-full animate-spin" />
                        ) : (
                            <>
                                <UploadCloud className="w-8 h-8 text-[#5A5A5A] mb-4" />
                                <p className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wide">
                                    Drag image here or click to browse
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
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
};
