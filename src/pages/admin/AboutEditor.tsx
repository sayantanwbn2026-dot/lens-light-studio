import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent, invalidateContent } from '../../hooks/useContent';
import { AboutContent, TeamMember } from '../../types/database';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput, AdminTextarea } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { ImageUpload } from '../../components/admin/ui/ImageUpload';
import { SortableCard } from '../../components/admin/ui/SortableCard';
import { Check, Plus } from 'lucide-react';
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
} from '@dnd-kit/sortable';

export const AboutEditor = () => {
    const { data: aboutData, loading: aboutLoading, mutate: mutateAbout } = useContent<AboutContent>('about_content');
    const { data: teamData, loading: teamLoading, mutate: mutateTeam } = useContent<TeamMember[]>('team_members', { column: 'order_index' });

    const [aboutForm, setAboutForm] = useState<Partial<AboutContent>>({});
    const [teamItems, setTeamItems] = useState<TeamMember[]>([]);
    const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [savedAction, setSavedAction] = useState(false);

    useEffect(() => {
        if (aboutData) setAboutForm(aboutData);
    }, [aboutData]);

    useEffect(() => {
        if (teamData && Array.isArray(teamData)) setTeamItems(teamData);
    }, [teamData]);

    const handleChange = (field: keyof AboutContent, value: unknown) => {
        setAboutForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleTeamUpdate = (id: string, field: keyof TeamMember, value: unknown) => {
        setTeamItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, [field]: value } : item)
        );
    };

    const handleAddTeamMember = () => {
        const newId = crypto.randomUUID();
        const newItem = {
            id: newId,
            order_index: teamItems.length,
            name: 'New Member',
            role: 'Role',
            photo_url: null
        };
        setTeamItems([...teamItems, newItem]);
        setExpandedTeamId(newId);
    };

    const handleDeleteTeamMember = async (id: string) => {
        setTeamItems((prev) => prev.filter(item => item.id !== id).map((item, index) => ({ ...item, order_index: index })));
        await supabase.from('team_members').delete().eq('id', id);
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setTeamItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                return newItems.map((item, index) => ({ ...item, order_index: index }));
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedAction(false);

        // Save about_content
        const aboutPayload = { ...aboutForm };
        if (!aboutPayload.id && aboutData?.id) {
            aboutPayload.id = aboutData.id;
        }

        const { error: aboutError } = await supabase
            .from('about_content')
            .upsert(aboutPayload);

        // Save team_members
        const { error: teamError } = await supabase
            .from('team_members')
            .upsert(teamItems);

        setSaving(false);

        if (!aboutError && !teamError) {
            mutateAbout(aboutForm);
            mutateTeam(teamItems);
            invalidateContent('about_content');
            invalidateContent('team_members');
            setSavedAction(true);
            setTimeout(() => setSavedAction(false), 3000);
        } else {
            console.error(aboutError, teamError);
            alert('Failed to save changes');
        }
    };

    if (aboutLoading || teamLoading) {
        return (
            <div className="animate-pulse flex flex-col gap-12 max-w-4xl">
                <div className="h-64 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />
                <div className="h-96 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 max-w-4xl pb-32">
            <AdminPageHeader title="ABOUT CONTENT" overline="EDITING" />

            <div className="flex flex-col gap-16">

                {/* MANIFESTO */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">MANIFESTO</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <AdminInput
                                value={aboutForm.manifesto_line1 || ''}
                                onChange={(e) => handleChange('manifesto_line1', e.target.value)}
                                placeholder="Line 1"
                                className="text-[20px] md:text-[24px]"
                            />
                            <span className="text-[10px] text-[#5A5A5A] uppercase">Preview: Displayed largest</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <AdminInput
                                value={aboutForm.manifesto_line2 || ''}
                                onChange={(e) => handleChange('manifesto_line2', e.target.value)}
                                placeholder="Line 2"
                                className="text-[18px] md:text-[20px]"
                            />
                            <span className="text-[10px] text-[#5A5A5A] uppercase">Preview: Displayed medium</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <AdminInput
                                value={aboutForm.manifesto_line3 || ''}
                                onChange={(e) => handleChange('manifesto_line3', e.target.value)}
                                placeholder="Line 3"
                                className="text-[16px] md:text-[18px]"
                            />
                            <span className="text-[10px] text-[#5A5A5A] uppercase">Preview: Displayed standard</span>
                        </div>
                    </div>
                </section>

                {/* FOUNDER 1 STORY */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">FOUNDER 1</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-8">
                            <AdminInput
                                label="Name"
                                value={aboutForm.founder_name || ''}
                                onChange={(e) => handleChange('founder_name', e.target.value)}
                            />


                        </div>

                        <div>
                            <ImageUpload
                                label="Photo"
                                description="Recommended: 800×1000px (JPG/WebP). Portrait aspect ratio."
                                value={aboutForm.founder_image_url}
                                onChange={(url) => handleChange('founder_image_url', url)}
                            />
                        </div>
                    </div>
                </section>

                {/* FOUNDER 2 STORY */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">FOUNDER 2 (Optional)</h3>
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-8">
                            <AdminInput
                                label="Name"
                                value={aboutForm.founder2_name || ''}
                                onChange={(e) => handleChange('founder2_name', e.target.value)}
                            />


                        </div>

                        <div>
                            <ImageUpload
                                label="Photo"
                                description="Recommended: 800×1000px (JPG/WebP). Portrait aspect ratio."
                                value={aboutForm.founder2_image_url}
                                onChange={(url) => handleChange('founder2_image_url', url)}
                            />
                        </div>
                    </div>
                </section>

                {/* PHILOSOPHY PILLARS */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">PHILOSOPHY PILLARS</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="bg-[#0A0A0A] border border-[#1E1E1E] p-6 flex flex-col gap-6">
                                <div className="text-[10px] font-light text-[#5A5A5A] uppercase tracking-widest border-b border-[#1E1E1E] pb-2">Pillar {num}</div>
                                <AdminInput
                                    label="Pillar Title"
                                    value={aboutForm[`philosophy_${num}_title`] || ''}
                                    onChange={(e) => handleChange(`philosophy_${num}_title`, e.target.value)}
                                />
                                <AdminTextarea
                                    label="Pillar Body"
                                    value={aboutForm[`philosophy_${num}_body`] || ''}
                                    onChange={(e) => handleChange(`philosophy_${num}_body`, e.target.value)}
                                    rows={4}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* TEAM MEMBERS */}
                <section className="flex flex-col gap-8">
                    <div className="flex items-center justify-between pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">TEAM MEMBERS</h3>
                        <AdminButton variant="outline" onClick={handleAddTeamMember}>
                            <Plus className="w-4 h-4 ml-[-4px]" /> Add Member
                        </AdminButton>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex flex-col gap-4">
                            <SortableContext
                                items={teamItems.map(i => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {teamItems.map((member) => (
                                    <SortableCard
                                        key={member.id}
                                        id={member.id}
                                        title={member.name}
                                        subtitle={member.role}
                                        isExpanded={expandedTeamId === member.id}
                                        onToggleExpand={() => setExpandedTeamId(expandedTeamId === member.id ? null : member.id)}
                                        onDelete={() => handleDeleteTeamMember(member.id)}
                                    >
                                        <div className="flex flex-col md:flex-row gap-10 lg:pl-10">
                                            <div className="flex-1 flex flex-col gap-6">
                                                <AdminInput
                                                    label="Name"
                                                    value={member.name || ''}
                                                    onChange={(e) => handleTeamUpdate(member.id, 'name', e.target.value)}
                                                />
                                                <AdminInput
                                                    label="Role"
                                                    value={member.role || ''}
                                                    onChange={(e) => handleTeamUpdate(member.id, 'role', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-full md:w-[240px]">
                                                <ImageUpload
                                                    label="Photo"
                                                    description="Recommended: 600×800px (JPG/WebP)."
                                                    value={member.photo_url}
                                                    onChange={(url) => handleTeamUpdate(member.id, 'photo_url', url)}
                                                />
                                            </div>
                                        </div>
                                    </SortableCard>
                                ))}
                            </SortableContext>
                        </div>
                    </DndContext>
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
