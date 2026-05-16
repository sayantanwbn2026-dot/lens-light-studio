import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent, invalidateContent } from '../../hooks/useContent';
import { HeroContent } from '../../types/database';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminToggle } from '../../components/admin/ui/AdminToggle';
import { ImageUpload } from '../../components/admin/ui/ImageUpload';
import { HeroVideoSection } from '../../components/admin/ui/HeroVideoSection';
import { VideoUpload } from '../../components/admin/ui/VideoUpload';
import { Check } from 'lucide-react';

export const HeroEditor = () => {
    const { data, loading, mutate } = useContent<HeroContent>('hero_content');
    const [formData, setFormData] = useState<Partial<HeroContent>>({});
    const [saving, setSaving] = useState(false);
    const [savedAction, setSavedAction] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData(data);
        }
    }, [data]);

    const handleChange = (field: keyof HeroContent, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        const stablePayload = { ...formData } as HeroContent;
        if (!stablePayload.id && data?.id) {
            stablePayload.id = data.id;
        }

        const { error } = await supabase
            .from('hero_content')
            .upsert(stablePayload);

        if (!error) {
            setSaving(false);
            mutate(formData);
            invalidateContent('hero_content');
            setSavedAction(true);
            setTimeout(() => setSavedAction(false), 3000);
            return;
        }

        // PGRST204 = column not found in schema cache (columns not yet added to DB)
        // Retry without scroll_video_* fields so other settings can still save
        if (error.code === 'PGRST204') {
            console.warn('Scroll video columns not in DB yet — saving without them.', error.message);
            const { scroll_video_enabled, scroll_video_url, scroll_video_thumbnail_url, ...safePayload } = stablePayload;
            const { error: fallbackError } = await supabase
                .from('hero_content')
                .upsert(safePayload);

            setSaving(false);

            if (!fallbackError) {
                mutate(formData);
                invalidateContent('hero_content');
                setSavedAction(true);
                setTimeout(() => setSavedAction(false), 3000);
                console.warn(
                    '⚠️ Scroll-to-Scale video settings were NOT saved.\n' +
                    'Run this SQL in your Supabase dashboard to enable them:\n\n' +
                    'ALTER TABLE hero_content\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_enabled boolean DEFAULT false,\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_url text,\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_thumbnail_url text;'
                );
                alert(
                    '⚠️ All other settings saved successfully!\n\n' +
                    'Scroll-to-Scale video settings could not be saved because the database columns are missing.\n\n' +
                    'To fix this, run the following SQL in your Supabase SQL Editor:\n\n' +
                    'ALTER TABLE hero_content\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_enabled boolean DEFAULT false,\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_url text,\n' +
                    '  ADD COLUMN IF NOT EXISTS scroll_video_thumbnail_url text;\n\n' +
                    'Dashboard: https://supabase.com/dashboard/project/jgikemqmeryuesjgepxb/sql/new'
                );
            } else {
                console.error(fallbackError);
                alert('Failed to save. Please check the console for details.');
            }
        } else {
            setSaving(false);
            console.error(error);
            alert('Failed to save. Error: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse flex gap-12">
                <div className="flex-1 flex flex-col gap-8">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-[#0A0A0A] border-b border-[#2A2A2A] rounded-sm" />)}
                </div>
                <div className="w-[40%] bg-[#0A0A0A] border border-[#2A2A2A] aspect-[9/16] rounded-sm" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <AdminPageHeader title="HERO SECTION" overline="EDITING" />

            <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* Left Panel - Form Fields (60%) */}
                <div className="flex-1 w-full flex flex-col gap-10">

                    <div className="flex flex-col gap-8 bg-[#0A0A0A] border border-[#1E1E1E] p-8">
                        <h3 className="text-[11px] font-light text-[#5A5A5A] uppercase tracking-widest mb-2">Typography & Content</h3>

                        <AdminInput
                            label="Overline Text"
                            value={formData.overline_text || ''}
                            onChange={(e) => handleChange('overline_text', e.target.value)}
                            placeholder="e.g., KOLKATA · EST. 2024"
                        />

                        <div className="flex flex-col gap-4 border-l-2 border-[#1E1E1E] pl-4 py-2">
                            <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest">Main Headline</span>
                            <AdminInput
                                placeholder="Line 1 (e.g., LENS)"
                                value={formData.headline_line1 || ''}
                                onChange={(e) => handleChange('headline_line1', e.target.value)}
                            />
                            <AdminInput
                                placeholder="Line 2 (e.g., LIGHT)"
                                value={formData.headline_line2 || ''}
                                onChange={(e) => handleChange('headline_line2', e.target.value)}
                            />
                            <AdminInput
                                placeholder="Line 3 (e.g., STUDIO)"
                                value={formData.headline_line3 || ''}
                                onChange={(e) => handleChange('headline_line3', e.target.value)}
                            />
                        </div>

                        <AdminInput
                            label="Tagline (Displays in Cormorant Garamond italic on right side)"
                            value={formData.tagline || ''}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            placeholder="e.g., Capturing moments."
                        />

                        <AdminInput
                            label="Scrolling Marquee Text"
                            description="Ticker text that scrolls below the hero section. Use ' · ' as a separator."
                            value={formData.marquee_text || ''}
                            onChange={(e) => handleChange('marquee_text', e.target.value)}
                            placeholder="e.g. BRAND CAMPAIGNS · CORPORATE SHOOTS · WEDDING COVERAGE ·"
                        />

                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <AdminInput
                                label="CTA Primary Label"
                                value={formData.cta_primary_label || ''}
                                onChange={(e) => handleChange('cta_primary_label', e.target.value)}
                            />
                            <AdminInput
                                label="CTA Secondary Label"
                                value={formData.cta_secondary_label || ''}
                                onChange={(e) => handleChange('cta_secondary_label', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 bg-[#0A0A0A] border border-[#1E1E1E] p-8">
                        <h3 className="text-[11px] font-light text-[#5A5A5A] uppercase tracking-widest mb-2">Media & Overlay</h3>

                        <ImageUpload
                            label="Hero Background Image"
                            description="Recommended: 1920×1080px (JPG/WebP). Grayscale photography works best."
                            value={formData.background_image_url || null}
                            onChange={(url) => handleChange('background_image_url', url)}
                        />

                        <div className="mt-4">
                            <AdminToggle
                                label="Show Camera EXIF HUD overlay"
                                description="Displays REC, ISO, and technical camera markings on the screen edges."
                                checked={formData.show_camera_hud !== false}
                                onChange={(checked) => handleChange('show_camera_hud', checked)}
                            />
                        </div>
                    </div>

                    <HeroVideoSection 
                        heroData={formData} 
                        onUpdate={(updated) => { 
                            setFormData(updated);
                            mutate(updated);
                        }} 
                    />

                    {/* Scroll-to-Scale Video Section */}
                    <div className="flex flex-col gap-8 bg-[#0A0A0A] border border-[#1E1E1E] p-8">
                        <h3 className="text-[11px] font-light text-[#5A5A5A] uppercase tracking-widest mb-2">Scroll Video Section</h3>

                        <AdminToggle
                            label="Enable Scroll-to-Scale Video"
                            description="Shows the cinematic scrolling video right below the marquee on the homepage."
                            checked={formData.scroll_video_enabled || false}
                            onChange={(checked) => handleChange('scroll_video_enabled', checked)}
                        />

                        {formData.scroll_video_enabled && (
                            <div className="flex flex-col gap-6 mt-2 pt-6 border-t border-[#1E1E1E]">
                                <VideoUpload
                                    label="Upload Scroll Video (MP4/WebM)"
                                    description="Recommended: 16:9 aspect ratio, max 10MB (MP4). Plays during scroll."
                                    value={formData.scroll_video_url || null}
                                    onChange={(url) => handleChange('scroll_video_url', url)}
                                />

                                <ImageUpload
                                    label="Video Fallback/Poster Image"
                                    description="Recommended: 1920×1080px (JPG/WebP). Shown while video loads."
                                    value={formData.scroll_video_thumbnail_url || null}
                                    onChange={(url) => handleChange('scroll_video_thumbnail_url', url)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mt-4 sticky bottom-8 bg-black/80 backdrop-blur-md p-4 border border-[#1E1E1E] z-10">
                        <AdminButton onClick={handleSave} isLoading={saving} className="px-10">
                            Save Changes
                        </AdminButton>

                        {savedAction && (
                            <div className="flex items-center gap-2 text-[#8A8A8A] font-light text-[12px] animate-in fade-in slide-in-from-left-2">
                                <Check className="w-4 h-4 text-white" />
                                <span>Saved.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Static Preview (40%) */}
                <div className="w-full lg:w-[40%] sticky top-8 flex flex-col gap-4">
                    <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Preview
                    </span>

                    <div className="w-full aspect-[4/5] bg-[#050505] border border-[#1E1E1E] relative overflow-hidden flex flex-col justify-center items-center p-8 selection:bg-white/20">
                        {/* BG */}
                        {formData.background_image_url && (
                            <img
                                src={formData.background_image_url}
                                alt="bg"
                                className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-screen"
                            />
                        )}

                        {/* HUD Mockup */}
                        {formData.show_camera_hud !== false && (
                            <div className="absolute inset-4 border border-white/10 pointer-events-none flex justify-between p-2">
                                <span className="text-[6px] text-white/50 tracking-widest font-mono">REC</span>
                                <span className="text-[6px] text-white/50 tracking-widest font-mono">ISO 400</span>
                            </div>
                        )}

                        <div className="relative z-10 w-full">
                            <p className="text-[8px] tracking-[0.2em] text-white/70 mb-4">{formData.overline_text || 'OVERLINE'}</p>

                            <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-[0.9] text-white break-words">
                                {formData.headline_line1 || 'LINE 1'}<br />
                                {formData.headline_line2 || 'LINE 2'}<br />
                                {formData.headline_line3 || 'LINE 3'}
                            </h1>

                            <div className="mt-8 flex items-end justify-between w-full">
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 border border-white text-white text-[8px] rounded-full">{formData.cta_primary_label || 'CTA 1'}</div>
                                </div>
                                {formData.tagline && (
                                    <p className="font-serif italic text-white/70 text-sm max-w-[120px] text-right">
                                        {formData.tagline}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
