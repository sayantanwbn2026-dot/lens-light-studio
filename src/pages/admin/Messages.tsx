import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminPageHeader } from '../../components/admin/ui/AdminPageHeader';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { Mail, Trash2, CheckCircle, Clock, Filter, Eye } from 'lucide-react';

interface ContactMessage {
    id: string;
    created_at: string;
    name: string;
    email: string;
    service: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
}

export const Messages = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        let query = supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (!error && data) {
            setMessages(data);
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleStatusChange = async (id: string, newStatus: 'read' | 'unread' | 'archived') => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (!error) {
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="animate-in fade-in duration-700 pb-32">
            <AdminPageHeader 
                title="CLIENT INQUIRIES" 
                overline="MESSAGES" 
            />

            <div className="flex flex-col lg:flex-row gap-8 mt-12">
                
                {/* List Column */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`text-[11px] uppercase tracking-widest ${filter === 'all' ? 'text-white' : 'text-[#5A5A5A]'} transition-colors`}
                            >
                                All ({messages.length})
                            </button>
                            <button 
                                onClick={() => setFilter('unread')}
                                className={`text-[11px] uppercase tracking-widest ${filter === 'unread' ? 'text-white' : 'text-[#5A5A5A]'} transition-colors`}
                            >
                                Unread ({messages.filter(m => m.status === 'unread').length})
                            </button>
                        </div>
                        <Filter className="w-3 h-3 text-[#5A5A5A]" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-[#0A0A0A] border border-[#1E1E1E] animate-pulse" />
                            ))
                        ) : messages.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-[#1E1E1E]">
                                <Mail className="w-8 h-8 text-[#1E1E1E] mx-auto mb-4" />
                                <p className="text-[12px] text-[#5A5A5A] uppercase tracking-widest">No messages found</p>
                            </div>
                        ) : (
                            messages.map(msg => (
                                <div 
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (msg.status === 'unread') handleStatusChange(msg.id, 'read');
                                    }}
                                    className={`group relative p-6 border transition-all cursor-pointer ${
                                        selectedMessage?.id === msg.id 
                                            ? 'bg-[#111111] border-white' 
                                            : 'bg-[#0A0A0A] border-[#1E1E1E] hover:border-[#333]'
                                    }`}
                                >
                                    {msg.status === 'unread' && (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-white" />
                                    )}
                                    
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-width-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className={`text-[14px] truncate ${msg.status === 'unread' ? 'font-medium text-white' : 'font-light text-[#8A8A8A]'}`}>
                                                    {msg.name}
                                                </h4>
                                                <span className="text-[10px] text-[#444] tracking-tighter">/</span>
                                                <span className="text-[10px] text-[#444] uppercase tracking-widest">{msg.service || 'General'}</span>
                                            </div>
                                            <p className="text-[12px] text-[#5A5A5A] truncate font-light">
                                                {msg.message}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-[10px] text-[#333] uppercase mb-1">{formatDate(msg.created_at)}</div>
                                            {msg.status === 'read' && <CheckCircle className="w-3 h-3 text-[#222] ml-auto" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="w-full lg:w-[440px] flex-shrink-0">
                    <div className="sticky top-8">
                        {selectedMessage ? (
                            <div className="bg-[#0D0D0D] border border-[#1E1E1E] p-8 flex flex-col gap-10">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[9px] px-2 py-0.5 uppercase tracking-widest border ${
                                            selectedMessage.status === 'unread' ? 'border-white text-white' : 'border-[#1E1E1E] text-[#5A5A5A]'
                                        }`}>
                                            {selectedMessage.status}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleDelete(selectedMessage.id)}
                                                className="p-2 hover:bg-red-950/20 text-[#333] hover:text-red-500 transition-all rounded-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-[24px] font-light text-white mb-2">{selectedMessage.name}</h2>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-[13px] text-[#8A8A8A] hover:text-white transition-colors border-b border-[#1E1E1E] pb-1">
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Service Interest</p>
                                            <p className="text-[13px] text-white font-light">{selectedMessage.service || 'General Inquiry'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#444] uppercase tracking-widest mb-1">Received At</p>
                                            <p className="text-[13px] text-white font-light">{formatDate(selectedMessage.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-[#1E1E1E]">
                                        <p className="text-[10px] text-[#444] uppercase tracking-widest mb-4">Message Body</p>
                                        <p className="text-[15px] text-[#BBB] font-light leading-relaxed whitespace-pre-wrap">
                                            "{selectedMessage.message}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <a 
                                        href={`mailto:${selectedMessage.email}?subject=Re: Your Inquiry to The Twenty-One`}
                                        className="flex-1"
                                    >
                                        <AdminButton className="w-full">
                                            Reply via Email
                                        </AdminButton>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[400px] bg-[#0A0A0A] border border-[#1E1E1E] border-dashed flex flex-col items-center justify-center p-12 text-center">
                                <Clock className="w-8 h-8 text-[#1E1E1E] mb-4" />
                                <p className="text-[11px] text-[#444] uppercase tracking-widest">Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
