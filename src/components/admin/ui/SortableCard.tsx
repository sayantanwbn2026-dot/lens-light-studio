import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface SortableCardProps {
    id: string;
    title: string;
    subtitle?: string;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onDelete: () => void;
    children: React.ReactNode;
}

export const SortableCard: React.FC<SortableCardProps> = ({
    id,
    title,
    subtitle,
    isExpanded,
    onToggleExpand,
    onDelete,
    children
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    const [confirmDelete, setConfirmDelete] = React.useState(false);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-[#0A0A0A] border transition-colors duration-300 ${isDragging ? 'border-white shadow-lg' : 'border-[#1E1E1E] hover:border-[#3A3A3A]'}`}
        >
            <div className="flex items-center justify-between p-4 bg-[#050505]">
                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={onToggleExpand}>
                    <div {...attributes} {...listeners} className="cursor-grab hover:bg-white/10 p-2 rounded -ml-2" onClick={e => e.stopPropagation()}>
                        <GripVertical className="w-4 h-4 text-[#5A5A5A]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[14px] font-medium text-white">{title}</span>
                        {subtitle && <span className="text-[11px] font-light text-[#5A5A5A]">{subtitle}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-[#1E1E1E]">
                    {confirmDelete ? (
                        <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-red-400 font-light">Delete?</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="text-white hover:underline"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                                className="text-[#5A5A5A] hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                            className="text-[#5A5A5A] hover:text-red-400 p-2 transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={onToggleExpand}
                        className="text-[#5A5A5A] hover:text-white p-2 transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-8 border-t border-[#1E1E1E]">
                    {children}
                </div>
            )}
        </div>
    );
};
