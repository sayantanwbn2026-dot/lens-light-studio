import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../hooks/useContent';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput, AdminTextarea } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { SortableCard } from '../../components/admin/ui/SortableCard';
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

export const TestimonialsEditor = () => {
    const { data, loading, mutate } = useContent('testimonials', { column: 'order_index', ascending: true });
    const [items, setItems] = useState<any[]>([]);
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
                return newItems.map((item, index) => ({ ...item, order_index: index }));
            });
        }
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleAdd = () => {
        const newId = crypto.randomUUID();
        const newItem = {
            id: newId,
            order_index: items.length,
            quote: '',
            client_name: 'New Client',
            client_role: '',
            client_company: ''
        };
        setItems([...items, newItem]);
        setExpandedId(newId);
    };

    const handleDelete = async (id: string) => {
        setItems((prev) => prev.filter(item => item.id !== id).map((item, index) => ({ ...item, order_index: index })));
        await supabase.from('testimonials').delete().eq('id', id);
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        const { error } = await supabase
            .from('testimonials')
            .upsert(items.map((item) => {
                const { ...dbItem } = item;
                return dbItem;
            }));

        setSaving(false);

        if (!error) {
            mutate(items);
            setSavedAction(true);
            setTimeout(() => setSavedAction(false), 3000);
        } else {
            console.error(error);
            alert('Failed to save testimonials');
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
        <div className="animate-in fade-in duration-700 max-w-4xl pb-32">
            <AdminPageHeader title="TESTIMONIALS" overline="EDITING" />

            <div className="flex items-center justify-between mb-8">
                <p className="text-[13px] font-light text-[#8A8A8A]">
                    Drag to reorder testimonials.
                </p>
                <AdminButton variant="outline" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add Testimonial
                </AdminButton>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col gap-4">
                    <SortableContext
                        items={items.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableCard
                                key={item.id}
                                id={item.id}
                                title={item.client_name || 'Unnamed Client'}
                                subtitle={item.quote ? `"${item.quote.substring(0, 60)}${item.quote.length > 60 ? '...' : ''}"` : 'No quote provided'}
                                isExpanded={expandedId === item.id}
                                onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                onDelete={() => handleDelete(item.id)}
                            >
                                <div className="flex flex-col gap-8 lg:pl-10">
                                    <AdminTextarea
                                        label="Quote"
                                        value={item.quote || ''}
                                        onChange={(e) => handleUpdate(item.id, 'quote', e.target.value)}
                                        rows={4}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <AdminInput
                                            label="Client Name"
                                            value={item.client_name || ''}
                                            onChange={(e) => handleUpdate(item.id, 'client_name', e.target.value)}
                                        />
                                        <AdminInput
                                            label="Client Role"
                                            value={item.client_role || ''}
                                            onChange={(e) => handleUpdate(item.id, 'client_role', e.target.value)}
                                        />
                                        <AdminInput
                                            label="Client Company"
                                            value={item.client_company || ''}
                                            onChange={(e) => handleUpdate(item.id, 'client_company', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </SortableCard>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <div className="flex items-center gap-6 fixed bottom-8 right-12 bg-black/80 backdrop-blur-md p-4 border border-[#1E1E1E] z-10 shadow-2xl">
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
