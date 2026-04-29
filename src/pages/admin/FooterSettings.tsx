import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../hooks/useContent';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput, AdminTextarea } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { Check } from 'lucide-react';

export const FooterSettings = () => {
    const { data, loading, mutate } = useContent('site_settings');
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [savedAction, setSavedAction] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        const { error } = await supabase
            .from('site_settings')
            .upsert({ id: 1, ...formData });

        setSaving(false);

        if (!error) {
            mutate(formData);
            setSavedAction(true);
            setTimeout(() => setSavedAction(false), 3000);
        } else {
            console.error(error);
            alert('Failed to save settings');
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse flex flex-col gap-12 max-w-2xl">
                <div className="h-64 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />
                <div className="h-48 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />
            </div>
        );
    }

    const descLength = formData.seo_description?.length || 0;

    return (
        <div className="animate-in fade-in duration-700 max-w-3xl pb-32">
            <AdminPageHeader title="FOOTER & SITE SETTINGS" overline="CONFIG" />

            <div className="flex flex-col gap-16">

                {/* Contact Info */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">CONTACT & STUDIO INFO</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AdminInput
                                label="Studio Email"
                                value={formData.studio_email || ''}
                                onChange={(e) => handleChange('studio_email', e.target.value)}
                                placeholder="hello@studio.com"
                            />
                            <AdminInput
                                label="Studio Phone"
                                value={formData.studio_phone || ''}
                                onChange={(e) => handleChange('studio_phone', e.target.value)}
                                placeholder="+1 00000 00000"
                            />
                        </div>

                        <AdminTextarea
                            label="Studio Address"
                            value={formData.studio_address || ''}
                            onChange={(e) => handleChange('studio_address', e.target.value)}
                            rows={3}
                        />

                        <AdminInput
                            label="Footer Tagline"
                            value={formData.footer_tagline || ''}
                            onChange={(e) => handleChange('footer_tagline', e.target.value)}
                            placeholder="e.g., Crafted with obsession in Kolkata."
                        />
                    </div>
                </section>

                {/* Social Links */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">SOCIAL LINKS</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 flex flex-col gap-8">
                        <AdminInput
                            label="Instagram URL"
                            value={formData.instagram_url || ''}
                            onChange={(e) => handleChange('instagram_url', e.target.value)}
                            placeholder="https://instagram.com/..."
                        />
                        <AdminInput
                            label="LinkedIn URL"
                            value={formData.linkedin_url || ''}
                            onChange={(e) => handleChange('linkedin_url', e.target.value)}
                            placeholder="https://linkedin.com/..."
                        />
                        <AdminInput
                            label="Behance URL"
                            value={formData.behance_url || ''}
                            onChange={(e) => handleChange('behance_url', e.target.value)}
                            placeholder="https://behance.net/..."
                        />
                    </div>
                </section>

                {/* SEO Meta */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">SEO DATA</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 flex flex-col gap-8 relative">
                        <AdminInput
                            label="SEO Site Title"
                            value={formData.seo_title || ''}
                            onChange={(e) => handleChange('seo_title', e.target.value)}
                        />

                        <div className="relative">
                            <span className={`absolute top-0 right-0 text-[10px] uppercase font-light ${descLength > 160 ? 'text-red-400' : 'text-[#8A8A8A]'}`}>
                                {descLength} / 160
                            </span>
                            <AdminTextarea
                                label="SEO Meta Description"
                                value={formData.seo_description || ''}
                                onChange={(e) => handleChange('seo_description', e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                </section>

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
