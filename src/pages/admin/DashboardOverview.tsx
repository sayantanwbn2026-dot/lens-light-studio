import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { format } from 'date-fns';

interface DashboardStats {
    heroUpdated: string | null;
    servicesCount: number;
    workCount: number;
    featuredWorkCount: number;
    testimonialsCount: number;
    teamCount: number;
    mediaFiles: number;
    mediaSize: number;
}

export const DashboardOverview = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const fetchStats = async () => {
            try {
                // Fetch hero last updated
                const { data: hero } = await supabase.from('hero_content').select('updated_at').single();

                // Fetch counts
                const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
                const { count: workCount } = await supabase.from('work_projects').select('*', { count: 'exact', head: true });
                const { count: featuredWorkCount } = await supabase.from('work_projects').select('*', { count: 'exact', head: true }).eq('featured', true);
                const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
                const { count: teamCount } = await supabase.from('team_members').select('*', { count: 'exact', head: true });

                // Media Library (from db table or storage)
                const { data: media } = await supabase.from('media_library').select('file_size');
                const mediaFiles = media?.length || 0;
                const mediaSize = media?.reduce((acc, curr) => acc + (curr.file_size || 0), 0) || 0;

                if (isMounted) {
                    setStats({
                        heroUpdated: hero?.updated_at || null,
                        servicesCount: servicesCount || 0,
                        workCount: workCount || 0,
                        featuredWorkCount: featuredWorkCount || 0,
                        testimonialsCount: testimonialsCount || 0,
                        teamCount: teamCount || 0,
                        mediaFiles,
                        mediaSize,
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchStats();
        return () => { isMounted = false; };
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="animate-in fade-in duration-700">
            <AdminPageHeader title="DASHBOARD" overline="OVERVIEW" />

            {loading ? (
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-[120px] bg-[#0A0A0A] border border-[#2A2A2A] animate-pulse rounded-sm" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-16">

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Hero Section</div>
                            <div className="text-[16px] font-light text-white">
                                {stats?.heroUpdated ? `Updated ${format(new Date(stats.heroUpdated), 'MMM d, yyyy')}` : 'Never updated'}
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Services</div>
                            <div className="text-[28px] font-light text-white">{stats?.servicesCount} <span className="text-[14px] text-[#5A5A5A] ml-2">Active</span></div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Work Projects</div>
                            <div className="text-[28px] font-light text-white">{stats?.workCount} <span className="text-[14px] text-[#5A5A5A] ml-2">Total / {stats?.featuredWorkCount} Featured</span></div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Testimonials</div>
                            <div className="text-[28px] font-light text-white">{stats?.testimonialsCount}</div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Team Members</div>
                            <div className="text-[28px] font-light text-white">{stats?.teamCount}</div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-8 flex flex-col justify-between h-[140px]">
                            <div className="text-[12px] font-light text-[#8A8A8A] uppercase tracking-wider">Media Library</div>
                            <div className="text-[16px] font-light text-white tracking-wide">
                                {stats?.mediaFiles} Files <span className="text-[#5A5A5A] mx-2">|</span> {formatSize(stats?.mediaSize || 0)} used
                            </div>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Recent Changes Log */}
                        <div>
                            <h3 className="text-[12px] font-light text-[#5A5A5A] uppercase tracking-wider mb-8">Recent Activity</h3>
                            <div className="flex flex-col gap-6 pl-4 border-l border-[#1E1E1E]">
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2A2A2A] border-2 border-black" />
                                    <p className="text-[13px] font-light text-white">System initialized</p>
                                    <p className="text-[11px] font-light text-[#5A5A5A] mt-1">CMS deployment successful.</p>
                                </div>
                                {/* Dynamic recent changes log will be populated from db triggers or activity table in future. Handled statically for now. */}
                            </div>
                        </div>

                        {/* Quick Edit */}
                        <div>
                            <h3 className="text-[12px] font-light text-[#5A5A5A] uppercase tracking-wider mb-8">Quick Edit</h3>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => navigate('/admin/hero')}
                                    className="flex items-center justify-between p-6 bg-transparent border border-[#2A2A2A] hover:border-white transition-colors group text-left"
                                >
                                    <div>
                                        <div className="text-[14px] font-light text-white group-hover:tracking-widest transition-all duration-500">HERO SECTION</div>
                                        <div className="text-[11px] font-light text-[#5A5A5A] mt-1">Edit main landing content & imagery</div>
                                    </div>
                                    <span className="text-white/50 group-hover:text-white transition-colors">→</span>
                                </button>

                                <button
                                    onClick={() => navigate('/admin/work')}
                                    className="flex items-center justify-between p-6 bg-transparent border border-[#2A2A2A] hover:border-white transition-colors group text-left"
                                >
                                    <div>
                                        <div className="text-[14px] font-light text-white group-hover:tracking-widest transition-all duration-500">WORK / PORTFOLIO</div>
                                        <div className="text-[11px] font-light text-[#5A5A5A] mt-1">Manage projects and featured reel</div>
                                    </div>
                                    <span className="text-white/50 group-hover:text-white transition-colors">→</span>
                                </button>

                                <button
                                    onClick={() => navigate('/admin/testimonials')}
                                    className="flex items-center justify-between p-6 bg-transparent border border-[#2A2A2A] hover:border-white transition-colors group text-left"
                                >
                                    <div>
                                        <div className="text-[14px] font-light text-white group-hover:tracking-widest transition-all duration-500">TESTIMONIALS</div>
                                        <div className="text-[11px] font-light text-[#5A5A5A] mt-1">Update client quotes and names</div>
                                    </div>
                                    <span className="text-white/50 group-hover:text-white transition-colors">→</span>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};
