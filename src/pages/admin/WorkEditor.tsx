import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../hooks/useContent';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput, AdminTextarea } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { ImageUpload } from '../../components/admin/ui/ImageUpload';
import { MultiImageUpload } from '../../components/admin/ui/MultiImageUpload';
import { AdminToggle } from '../../components/admin/ui/AdminToggle';
import { CustomDropdown } from '../../components/admin/ui/CustomDropdown';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

const CATEGORIES = ['Brand', 'Corporate', 'Weddings', 'Traditional'];

export const WorkEditor = () => {
    const { data, loading, mutate } = useContent('work_projects', { column: 'order_index', ascending: true });
    const [projects, setProjects] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');

    // Slide-in panel state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setProjects(data);
        }
    }, [data]);

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    const handleCreate = () => {
        const newProject = {
            id: crypto.randomUUID(),
            title: 'New Project',
            category: 'Brand',
            description: '',
            cover_image_url: null,
            gallery_images: [],
            featured: false,
            order_index: projects.length,
            isNew: true // temporary flag
        };
        setEditForm(newProject);
        setEditingId(newProject.id);
    };

    const handleEdit = (project: any) => {
        setEditForm({ ...project });
        setEditingId(project.id);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this project? This cannot be undone.')) {
            setProjects((prev) => prev.filter(p => p.id !== id));
            await supabase.from('work_projects').delete().eq('id', id);
            if (editingId === id) {
                setEditingId(null);
            }
        }
    };

    const handleSave = async () => {
        if (!editForm) return;
        setSaving(true);

        const { isNew, ...dbData } = editForm;

        const { error } = await supabase
            .from('work_projects')
            .upsert([dbData]);

        setSaving(false);

        if (!error) {
            if (isNew) {
                setProjects([...projects, dbData]);
            } else {
                setProjects(projects.map(p => p.id === dbData.id ? dbData : p));
            }
            setEditingId(null);
            setEditForm(null);
        } else {
            console.error(error);
            alert('Error saving project');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    if (loading) {
        return (
            <div className="animate-pulse grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-video bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" />)}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 relative">
            <AdminPageHeader title="WORK / PORTFOLIO" overline="EDITING" />

            {/* Top Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="flex flex-wrap gap-2">
                    {['All', ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-light transition-all ${filter === cat
                                    ? 'bg-white text-black'
                                    : 'bg-transparent text-[#8A8A8A] border border-[#2A2A2A] hover:border-white hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <AdminButton variant="outline" onClick={handleCreate}>
                    <Plus className="w-4 h-4" /> Add New Project
                </AdminButton>
            </div>

            {/* Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${editingId ? 'pr-[500px]' : ''}`}>
                {filteredProjects.map(project => (
                    <div
                        key={project.id}
                        className="group relative bg-[#0A0A0A] border border-[#1E1E1E] hover:border-white transition-colors cursor-pointer"
                        onClick={() => handleEdit(project)}
                    >
                        <div className="aspect-video overflow-hidden bg-black/50 relative">
                            {project.cover_image_url ? (
                                <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#5A5A5A] uppercase tracking-widest">No Image</div>
                            )}
                            {project.featured && (
                                <div className="absolute top-3 left-3 bg-white text-black text-[9px] px-2 py-0.5 uppercase tracking-widest">Featured</div>
                            )}

                            {/* Quick Actions overlay */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                                    className="p-2 bg-black/80 hover:bg-black text-white backdrop-blur-sm transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(project.id, e)}
                                    className="p-2 bg-black/80 hover:bg-black text-white hover:text-red-400 backdrop-blur-sm transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col gap-1">
                            <h3 className="text-white text-[13px] font-light">{project.title}</h3>
                            <p className="text-[#5A5A5A] text-[11px] font-light tracking-wide uppercase">{project.category}</p>
                        </div>
                    </div>
                ))}
                {filteredProjects.length === 0 && (
                    <div className="col-span-1 border border-[#1E1E1E] border-dashed p-12 text-center text-[#5A5A5A] text-[12px] uppercase tracking-widest">
                        No projects found.
                    </div>
                )}
            </div>

            {/* Slide-in Panel */}
            <div
                className={`fixed top-0 right-0 h-screen w-full max-w-[480px] bg-black border-l border-[#1E1E1E] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${editingId ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {editForm && (
                    <div className="h-full flex flex-col pt-16">

                        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1E1E1E]">
                            <h2 className="text-[14px] font-light text-white tracking-widest uppercase">
                                {editForm.isNew ? 'New Project' : 'Edit Project'}
                            </h2>
                            <button onClick={handleCancel} className="text-[#5A5A5A] hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-10">

                            <div className="flex flex-col gap-8">
                                <AdminInput
                                    label="Project Title"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                />

                                <CustomDropdown
                                    label="Category"
                                    value={editForm.category}
                                    options={CATEGORIES}
                                    onChange={(val) => setEditForm({ ...editForm, category: val })}
                                />

                                <AdminTextarea
                                    label="Description"
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="flex flex-col gap-6 pt-6 border-t border-[#1E1E1E]">
                                <AdminToggle
                                    label="Featured Project"
                                    description="Featured projects appear in the homepage horizontal scrolling reel."
                                    checked={editForm.featured || false}
                                    onChange={(checked) => setEditForm({ ...editForm, featured: checked })}
                                />

                                <AdminInput
                                    label="Order Index (Sorting)"
                                    type="number"
                                    value={editForm.order_index}
                                    onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex flex-col gap-10 pt-6 border-t border-[#1E1E1E]">
                                <ImageUpload
                                    label="Cover Image"
                                    value={editForm.cover_image_url}
                                    onChange={(url) => setEditForm({ ...editForm, cover_image_url: url })}
                                />

                                <MultiImageUpload
                                    label="Gallery Images"
                                    images={editForm.gallery_images || []}
                                    onChange={(urls) => setEditForm({ ...editForm, gallery_images: urls })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#1E1E1E] bg-[#050505] flex gap-4">
                            <AdminButton onClick={handleSave} isLoading={saving} className="flex-1">
                                Save Project
                            </AdminButton>
                            <AdminButton variant="danger" onClick={handleCancel} disabled={saving} className="px-6">
                                Discard
                            </AdminButton>
                        </div>

                    </div>
                )}
            </div>

            {/* Overlay to close panel when clicking outside */}
            {editingId && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 lg:hidden"
                    onClick={handleCancel}
                />
            )}

        </div>
    );
};
