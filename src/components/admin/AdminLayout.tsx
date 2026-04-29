import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const navLinks = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/hero', label: 'Hero' },
    { path: '/admin/services', label: 'Services' },
    { path: '/admin/work', label: 'Work / Portfolio' },
    { path: '/admin/about', label: 'About' },
    { path: '/admin/testimonials', label: 'Testimonials' },
    { path: '/admin/stats', label: 'Stats' },
    { path: '/admin/footer', label: 'Footer & Contact' },
    { path: '/admin/media', label: 'Media Library' },
    { path: '/admin/settings', label: 'Settings' },
];

export const AdminLayout = () => {
    const { user, signOut } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white flex font-inter overflow-hidden relative selection:bg-white/20">

            {/* Noise overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03] z-[100]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
            />

            {/* Sidebar */}
            <aside className="w-[240px] flex-shrink-0 border-r border-[#1E1E1E] bg-black flex flex-col h-screen fixed top-0 left-0 z-10">
                <div className="pt-8 px-6 pb-12 flex flex-col gap-1">
                    <h1 className="font-light text-[11px] tracking-widest text-white uppercase">
                        The Twenty-One
                    </h1>
                    <p className="font-light text-[9px] tracking-[0.3em] text-[#5A5A5A] uppercase">
                        Content Studio
                    </p>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.exact}
                            className={({ isActive }) =>
                                `px-4 py-2 text-[13px] font-light transition-all duration-300 border-l-2 ${isActive
                                    ? 'border-white text-white bg-white/5'
                                    : 'border-[#3A3A3A] text-white/70 hover:text-white hover:border-white/50'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-[#1E1E1E]/50 flex flex-col gap-4">
                    <div className="text-[10px] font-light text-[#5A5A5A] truncate">
                        {user?.email}
                    </div>
                    <button
                        onClick={signOut}
                        className="text-[13px] font-light text-white/70 hover:text-white flex items-center justify-between group transition-colors"
                    >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[240px] h-screen overflow-y-auto w-full">
                <div className="p-12 max-w-6xl mx-auto pb-32">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
