import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent, invalidateContent } from '../../hooks/useContent';
import { Service } from '../../types/database';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput, AdminTextarea } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { ImageUpload } from '../../components/admin/ui/ImageUpload';
import { DynamicTagInput } from '../../components/admin/ui/DynamicTagInput';
import { SortableCard } from '../../components/admin/ui/SortableCard';
import { CustomDropdown } from '../../components/admin/ui/CustomDropdown';
import { VideoUpload } from '../../components/admin/ui/VideoUpload';
import { Check, Plus } from 'lucide-react';
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
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const ServicesEditor = () => {
    const { data, loading, mutate } = useContent<Service[]>('services', { column: 'order_index', ascending: true });
    const [items, setItems] = useState<Service[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [savedAction, setSavedAction] = useState(false);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setItems(data);
        }
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                // Update order_index
                return newItems.map((item, index) => ({ ...item, order_index: index }));
            });
        }
    };

    const handleUpdate = (id: string, field: keyof Service, value: unknown) => {
        setItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleAdd = () => {
        const newId = crypto.randomUUID();
        const newItem = {
            id: newId,
            order_index: items.length,
            number_label: `0${items.length + 1}`,
            title: 'New Service',
            description: '',
            deliverables: [],
            enquiry_cta_label: 'ENQUIRE',
            image_url: null,
            video_url: null,
            media_type: 'image'
        };
        setItems([...items, newItem]);
        setExpandedId(newId);
    };

    const handleDelete = async (id: string) => {
        // Optimistic remove
        setItems((prev) => prev.filter(item => item.id !== id).map((item, index) => ({ ...item, order_index: index })));
        // Delete from DB immediately
        await supabase.from('services').delete().eq('id', id);
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        // Upsert all items to sync order and content
        const { error } = await supabase
            .from('services')
            .upsert(items.map((item) => {
                // Ensure only existing columns are sent to the DB
                return {
                    id: item.id,
                    order_index: item.order_index,
                    number_label: item.number_label,
                    title: item.title,
                    description: item.description,
                    deliverables: item.deliverables,
                    enquiry_cta_label: item.enquiry_cta_label,
                    image_url: item.image_url,
                    video_url: item.video_url,
                    media_type: item.media_type
                };
            }));

        setSaving(false);

        if (!error) {
            mutate(items);
            invalidateContent('services');
            setSavedAction(true);
            setTimeout(() => setSavedAction(false), 3000);
        } else {
            console.error('Supabase Save Error:', error);
            alert(`Failed to save services: ${error.message} (${error.code || 'No code'})`);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />)}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 max-w-4xl">
            <AdminPageHeader title="SERVICES" overline="EDITING" />

            <div className="flex items-center justify-between mb-8">
                <p className="text-[13px] font-light text-[#8A8A8A]">
                    Drag to reorder. Click a service to edit details.
                </p>
                <AdminButton variant="outline" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add Service
                </AdminButton>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col gap-4 mb-16">
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                subtitle={`${item.number_label} • ${item.deliverables?.length || 0} deliverables`}
                                isExpanded={expandedId === item.id}
                                onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                onDelete={() => handleDelete(item.id)}
                            >
                                <div className="flex flex-col gap-10 lg:pl-10">

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <AdminInput
                                            label="Number Label"
                                            value={item.number_label || ''}
                                            onChange={(e) => handleUpdate(item.id, 'number_label', e.target.value)}
                                            placeholder="e.g., 01"
                                            className="md:col-span-1"
                                        />
                                        <AdminInput
                                            label="Service Title"
                                            value={item.title || ''}
                                            onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                                            className="md:col-span-2"
                                        />
                                    </div>

                                    <AdminTextarea
                                        label="Description"
                                        value={item.description || ''}
                                        onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                                        rows={4}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="flex flex-col gap-10">
                                            <DynamicTagInput
                                                label="Deliverables"
                                                tags={item.deliverables || []}
                                                onChange={(tags) => handleUpdate(item.id, 'deliverables', tags)}
                                            />
                                            <AdminInput
                                                label="Enquiry CTA Label"
                                                value={item.enquiry_cta_label || ''}
                                                onChange={(e) => handleUpdate(item.id, 'enquiry_cta_label', e.target.value)}
                                                placeholder="e.g., ENQUIRE NOW"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-8">
                                            <CustomDropdown
                                                label="Media Type"
                                                value={item.media_type || 'image'}
                                                options={['image', 'video']}
                                                onChange={(val) => handleUpdate(item.id, 'media_type', val)}
                                            />

                                            {item.media_type === 'video' ? (
                                                <VideoUpload
                                                    label="Service Video"
                                                    description="Max 50MB. Recommended: 3:2 or 16:9 aspect ratio."
                                                    value={item.video_url}
                                                    onChange={(url) => handleUpdate(item.id, 'video_url', url)}
                                                />
                                            ) : (
                                                <ImageUpload
                                                    label="Service Image"
                                                    description="Recommended: 1200×800px (3:2) or 1600×900px (16:9)."
                                                    value={item.image_url}
                                                    onChange={(url) => handleUpdate(item.id, 'image_url', url)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </SortableCard>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <div className="flex items-center gap-6 sticky bottom-8 bg-black/80 backdrop-blur-md p-4 border border-[#1E1E1E] z-10 w-max ml-auto">
                {savedAction && (
                    <div className="flex items-center gap-2 text-[#8A8A8A] font-light text-[12px] animate-in fade-in slide-in-from-right-2">
                        <span>Saved.</span>
                        <Check className="w-4 h-4 text-white" />
                    </div>
                )}
                <AdminButton onClick={handleSave} isLoading={saving} className="px-10">
                    Save Changes
                </AdminButton>
            </div>

        </div>
    );
};
