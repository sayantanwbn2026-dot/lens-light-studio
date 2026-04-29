import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { Check } from 'lucide-react';

export const Settings = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingPass, setSavingPass] = useState(false);
    const [passSaved, setPassSaved] = useState(false);
    const [passError, setPassError] = useState<string | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPassError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setPassError("Password must be at least 6 characters.");
            return;
        }

        setSavingPass(true);
        setPassError(null);
        setPassSaved(false);

        const { error } = await supabase.auth.updateUser({ password });

        setSavingPass(false);
        if (error) {
            setPassError(error.message);
        } else {
            setPassSaved(true);
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => setPassSaved(false), 3000);
        }
    };

    const handleExportJSON = async () => {
        try {
            // Small helper to fetch all rows
            const fetchAll = async (table: string) => {
                const { data } = await supabase.from(table).select('*');
                return data;
            };

            const exportData = {
                timestamp: new Date().toISOString(),
                site_settings: await fetchAll('site_settings'),
                hero_content: await fetchAll('hero_content'),
                about_content: await fetchAll('about_content'),
                services: await fetchAll('services'),
                work_projects: await fetchAll('work_projects'),
                team_members: await fetchAll('team_members'),
                testimonials: await fetchAll('testimonials'),
                stats: await fetchAll('stats'),
                // not exporting media_library logic for brevity, just strings
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `twenty-one-backup-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error(e);
            alert('Error exporting content');
        }
    };

    const handleClearCache = () => {
        // Basic localstorage clear as a proxy for clearing standard browser cache for this origin
        localStorage.clear();
        sessionStorage.clear();
        alert('Local cache cleared. Hard refresh the page if issues persist.');
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-2xl pb-32">
            <AdminPageHeader title="SYSTEM SETTINGS" overline="ADMIN" />

            <div className="flex flex-col gap-16">

                {/* Change Admin Password */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#1E1E1E]">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">CHANGE PASSWORD</h3>
                    </div>

                    <form onSubmit={handlePasswordChange} className="bg-[#0A0A0A] border border-[#1E1E1E] p-8 flex flex-col gap-8">
                        <AdminInput
                            type="password"
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <AdminInput
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {passError && <p className="text-red-400 text-[12px] font-light">{passError}</p>}

                        <div className="flex items-center gap-4 mt-2">
                            <AdminButton type="submit" isLoading={savingPass} disabled={!password}>
                                Update Password
                            </AdminButton>
                            {passSaved && (
                                <div className="flex items-center gap-2 text-[#8A8A8A] font-light text-[12px]">
                                    <Check className="w-4 h-4 text-white" />
                                    <span>Password updated.</span>
                                </div>
                            )}
                        </div>
                    </form>
                </section>

                {/* Danger Zone */}
                <section className="flex flex-col gap-8">
                    <div className="pb-4 border-b border-[#3A3A3A] relative">
                        <h3 className="text-[13px] font-light text-white uppercase tracking-widest">DANGER ZONE</h3>
                        <div className="absolute inset-x-0 bottom-0 h-px bg-red-900/20" />
                    </div>

                    <div className="bg-[#0A0A0A] border border-[#3A3A3A] p-8 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10 border-b border-[#1E1E1E] pb-6">
                            <div>
                                <h4 className="text-[14px] font-light text-white">Clear All Cache</h4>
                                <p className="text-[11px] font-light text-[#5A5A5A] mt-1">Force refresh local state and clear browser storage tokens.</p>
                            </div>
                            <AdminButton variant="danger" onClick={handleClearCache}>
                                Clear Cache
                            </AdminButton>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                            <div>
                                <h4 className="text-[14px] font-light text-white">Export All Content</h4>
                                <p className="text-[11px] font-light text-[#5A5A5A] mt-1">Download a full JSON backup of the database structure.</p>
                            </div>
                            <AdminButton variant="outline" onClick={handleExportJSON}>
                                Export JSON
                            </AdminButton>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
};
