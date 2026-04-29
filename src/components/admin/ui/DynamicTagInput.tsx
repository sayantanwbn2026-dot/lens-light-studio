import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AdminInput } from './AdminInput';

interface DynamicTagInputProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
}

export const DynamicTagInput: React.FC<DynamicTagInputProps> = ({ label, tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                onChange([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-col gap-3">
            <AdminInput
                label={label}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type deliverable and press Enter"
            />

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="px-3 py-1 border border-white/20 rounded-full text-[11px] font-light text-white flex items-center justify-center gap-2 group hover:border-white transition-colors"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="opacity-50 group-hover:opacity-100 hover:text-red-400 transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
