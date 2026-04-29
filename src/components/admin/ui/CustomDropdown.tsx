import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
    label?: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-2 relative" ref={ref}>
            {label && (
                <label className="text-[11px] font-light text-[#8A8A8A] tracking-wider uppercase">
                    {label}
                </label>
            )}
            <div
                className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 text-[14px] font-light text-white cursor-pointer hover:border-white transition-all capitalize"
                onClick={() => setOpen(!open)}
            >
                {value || 'Select an option...'}
            </div>

            {open && (
                <div className="absolute top-[100%] left-0 w-full bg-[#0A0A0A] border border-[#2A2A2A] mt-2 z-50 flex flex-col py-2 shadow-2xl">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-4 py-2 text-[13px] font-light cursor-pointer transition-colors ${value === opt ? 'bg-white/10 text-white' : 'text-[#8A8A8A] hover:bg-white/5 hover:text-white'
                                }`}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
