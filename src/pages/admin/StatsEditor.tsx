import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../hooks/useContent';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { Check, Plus, GripVertical, Trash2 } from 'lucide-react';
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
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
    id: string;
    item: any;
    onUpdate: (id: string, field: string, value: string) => void;
    onDelete: (id: string) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({ id, item, onUpdate, onDelete }) => {
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
            className={`flex items-center gap-4 p-4 border-b ${isDragging ? 'border-white bg-[#111]' : 'border-[#1E1E1E] bg-[#0A0A0A] hover:bg-white/5'} transition-colors duration-200`}
        >
            <div {...attributes} {...listeners} className="cursor-grab p-2 -ml-2 hover:bg-white/10 rounded">
                <GripVertical className="w-4 h-4 text-[#5A5A5A]" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                    type="text"
                    value={item.number || ''}
                    placeholder="Number (e.g. 120+)"
                    onChange={(e) => onUpdate(item.id, 'number', e.target.value)}
                    className="bg-transparent text-[24px] font-light text-white focus:outline-none placeholder:text-[#3A3A3A] w-full"
                />
                <input
                    type="text"
                    value={item.label || ''}
                    placeholder="Label (e.g. Projects Completed)"
                    onChange={(e) => onUpdate(item.id, 'label', e.target.value)}
                    className="bg-transparent text-[13px] font-light text-white focus:outline-none placeholder:text-[#3A3A3A] w-full uppercase tracking-widest"
                />
            </div>

            <button
                onClick={() => {
                    if (confirm('Delete this stat?')) {
                        onDelete(item.id);
                    }
                }}
                className="text-[#5A5A5A] hover:text-red-400 p-2 ml-4 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export const StatsEditor = () => {
    const { data, loading, mutate } = useContent('stats', { column: 'order_index', ascending: true });
    const [items, setItems] = useState<any[]>([]);
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

    const handleUpdate = (id: string, field: string, value: string) => {
        setItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleAdd = () => {
        setItems([
            ...items,
            {
                id: crypto.randomUUID(),
                order_index: items.length,
                number: '',
                label: ''
            }
        ]);
    };

    const handleDelete = async (id: string) => {
        setItems((prev) => prev.filter(item => item.id !== id).map((item, index) => ({ ...item, order_index: index })));
        await supabase.from('stats').delete().eq('id', id);
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        const { error } = await supabase
            .from('stats')
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
            alert('Failed to save stats');
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse flex flex-col gap-0 border border-[#2A2A2A]">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-[#0A0A0A] border-b border-[#2A2A2A]" />)}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 max-w-4xl pb-32">
            <AdminPageHeader title="STATISTICS" overline="EDITING" />

            <div className="flex items-center justify-between mb-8">
                <p className="text-[13px] font-light text-[#8A8A8A]">
                    Adjust the 4 key metrics displayed on the homepage.
                </p>
                <AdminButton variant="outline" onClick={handleAdd}>
                    <Plus className="w-4 h-4" /> Add Stat Row
                </AdminButton>
            </div>

            <div className="border border-[#1E1E1E] bg-[#0A0A0A]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex flex-col">
                        <SortableContext
                            items={items.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <SortableRow
                                    key={item.id}
                                    id={item.id}
                                    item={item}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </SortableContext>

                        {items.length === 0 && (
                            <div className="p-12 text-center text-[#5A5A5A] text-[12px] uppercase tracking-widest border-b border-[#1E1E1E]">
                                No statistics found.
                            </div>
                        )}
                    </div>
                </DndContext>
            </div>

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
