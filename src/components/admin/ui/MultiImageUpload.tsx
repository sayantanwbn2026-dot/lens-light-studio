import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { UploadCloud, X, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableThumbProps {
    id: string;
    url: string;
    onRemove: () => void;
}

const SortableThumb: React.FC<SortableThumbProps> = ({ id, url, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group aspect-square bg-[#0A0A0A] border ${isDragging ? 'border-white' : 'border-[#2A2A2A] hover:border-white/50'} transition-all`}
        >
            <img src={url} alt="" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />

            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 p-1 bg-black/50 text-white rounded cursor-grab opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
                <GripVertical className="w-3 h-3" />
            </div>

            <button
                onClick={onRemove}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
    );
};

interface MultiImageUploadProps {
    label?: string;
    images: string[];
    onChange: (urls: string[]) => void;
    bucket?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    label,
    images = [],
    onChange,
    bucket = 'media'
}) => {
    const [uploading, setUploading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = images.indexOf(active.id as string);
            const newIndex = images.indexOf(over.id as string);
            onChange(arrayMove(images, oldIndex, newIndex));
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) return;
            setUploading(true);

            const newUrls: string[] = [];
            const files = Array.from(event.target.files);

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                newUrls.push(publicUrl);

                // media_library table is not in the schema, skipping insert
            }

            onChange([...images, ...newUrls]);

        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {label && (
                <label className="text-[11px] font-light text-[#8A8A8A] tracking-wider uppercase">
                    {label}
                </label>
            )}

            {images.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-3 gap-2">
                        <SortableContext items={images} strategy={rectSortingStrategy}>
                            {images.map(url => (
                                <SortableThumb
                                    key={url}
                                    id={url}
                                    url={url}
                                    onRemove={() => onChange(images.filter(img => img !== url))}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            )}

            <label className="relative flex flex-col items-center justify-center w-full min-h-[120px] border-border border border-dashed border-[#2A2A2A] hover:border-white transition-colors cursor-pointer bg-black/20 hover:bg-white/5">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                        <div className="w-5 h-5 border-2 border-t-white border-[#2A2A2A] rounded-full animate-spin" />
                    ) : (
                        <>
                            <UploadCloud className="w-6 h-6 text-[#5A5A5A] mb-2" />
                            <p className="text-[11px] font-light text-[#8A8A8A] uppercase tracking-wide">
                                Upload Images
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
    );
};
