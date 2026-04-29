import React from 'react';

interface AdminToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export const AdminToggle: React.FC<AdminToggleProps> = ({ label, checked, onChange, description }) => {
    return (
        <div className="flex items-center justify-between py-2 border-b border-[#1E1E1E]">
            <div className="flex flex-col gap-1">
                <label className="text-[14px] font-light text-white capitalize">
                    {label}
                </label>
                {description && (
                    <span className="text-[11px] font-light text-[#5A5A5A]">
                        {description}
                    </span>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${checked ? 'bg-white' : 'bg-[#2A2A2A]'
                    }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0 bg-[#8A8A8A]'
                        }`}
                />
            </button>
        </div>
    );
};
