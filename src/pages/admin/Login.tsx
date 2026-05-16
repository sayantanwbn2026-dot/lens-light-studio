import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminInput } from '../../components/admin/ui/AdminInput';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError('Access denied. Invalid credentials.');
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="admin-container min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden font-inter selection:bg-white/20">

            {/* Noise Background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] z-[10]"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
            />

            <div className="w-full max-w-[320px] z-20 flex flex-col gap-12 text-center animate-in fade-in duration-1000">

                <h1 className="font-light text-[30px] tracking-[0.2em] text-white">
                    THE TWENTY-ONE
                </h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-8 text-left">
                    <AdminInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="w-full text-center placeholder:text-center text-[15px]"
                        autoFocus
                    />
                    <AdminInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full text-center placeholder:text-center text-[15px]"
                    />

                    {error && (
                        <p className="text-[#8A8A8A] text-[12px] font-light text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 relative overflow-hidden rounded-full font-inter text-[13px] font-normal transition-all duration-500 w-full bg-white text-black py-3.5 group disabled:opacity-50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "ENTER THE STUDIO →"
                            )}
                        </span>
                        {!loading && (
                            <>
                                <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.19, 1, 0.22, 1)' }} />
                                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    ENTER THE STUDIO →
                                </span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
