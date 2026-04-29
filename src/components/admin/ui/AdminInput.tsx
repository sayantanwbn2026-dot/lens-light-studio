import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                {label && (
                    <label className="text-[11px] font-light text-[#8A8A8A] tracking-wider uppercase">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 text-[14px] font-light text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-white focus:shadow-[0_1px_0_0_#ffffff] transition-all"
                    {...props}
                />
                {error && <span className="text-[12px] font-light text-[#8A8A8A]">{error}</span>}
            </div>
        );
    }
);

AdminInput.displayName = 'AdminInput';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className={`flex flex-col gap-2 ${className}`}>
                {label && (
                    <label className="text-[11px] font-light text-[#8A8A8A] tracking-wider uppercase">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className="w-full bg-transparent border-b border-[#2A2A2A] pb-2 text-[14px] font-light text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-white focus:shadow-[0_1px_0_0_#ffffff] transition-all resize-y min-h-[40px] leading-relaxed"
                    {...props}
                />
                {error && <span className="text-[12px] font-light text-[#8A8A8A]">{error}</span>}
            </div>
        );
    }
);

AdminTextarea.displayName = 'AdminTextarea';
