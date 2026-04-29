import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    overline: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, overline }) => {
    return (
        <div className="mb-12">
            <div className="flex flex-col gap-2">
                <span className="font-light text-[10px] tracking-[0.2em] text-[#5A5A5A] uppercase">
                    — {overline}
                </span>
                <h2 className="text-[18px] font-light text-white tracking-wide">
                    {title}
                </h2>
            </div>
        </div>
    );
};
