import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'danger';
    isLoading?: boolean;
}

export const AdminButton = React.forwardRef<HTMLButtonElement, AdminButtonProps>(
    ({ children, variant = 'primary', isLoading, className = '', ...props }, ref) => {

        const baseClass = "relative overflow-hidden rounded-full font-inter text-[13px] font-light transition-all duration-500 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5";

        const variants = {
            primary: `bg-white text-black hover:bg-white/90`,
            outline: `bg-transparent text-white border border-white/20 hover:border-white/50`,
            danger: `bg-transparent text-[#8A8A8A] border border-[#2A2A2A] hover:border-red-900 hover:text-red-500`,
        };

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variants[variant]} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                        <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${variant === 'primary' ? 'border-black' : 'border-white'}`} />
                    ) : (
                        children
                    )}
                </span>
                {variant === 'primary' && !isLoading && (
                    <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }} />
                )}
                {variant === 'primary' && !isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {children}
                    </span>
                )}
            </button>
        );
    }
);

AdminButton.displayName = 'AdminButton';
