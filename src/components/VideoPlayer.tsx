import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';

interface VideoPlayerProps {
    videoUrl: string;
    videoType: 'upload' | 'embed';
    coverImage?: string;
    title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, videoType, coverImage, title }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        // YouTube
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        if (ytMatch && ytMatch[1]) {
            return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
        }
        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`;
        }
        return url; // Fallback
    };

    const handlePlay = () => {
        setIsPlaying(true);
        if (videoType === 'upload' && videoRef.current) {
            videoRef.current.play();
        }
    };

    // Pause video if it scrolls out of view (minimizing)
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isPlaying) {
                    // Pausing when out of view
                    if (videoType === 'upload' && videoRef.current) {
                        videoRef.current.pause();
                    } else if (videoType === 'embed') {
                        // For iframe, we can't easily pause without postMessage API, 
                        // but resetting state removes the iframe entirely.
                        setIsPlaying(false);
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isPlaying, videoType]);

    return (
        <div 
            ref={containerRef}
            className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden group"
            style={{ aspectRatio: '16/9' }}
        >
            {!isPlaying ? (
                <>
                    {coverImage ? (
                        <img 
                            src={coverImage} 
                            alt={title || "Video Cover"} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5A5A5A] uppercase tracking-widest text-[12px] bg-[#0A0A0A]">
                            Video Player
                        </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                    <button 
                        onClick={handlePlay}
                        className="absolute z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 hover:scale-110"
                        aria-label="Play Video"
                    >
                        <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </button>
                </>
            ) : (
                <div className="w-full h-full animate-in fade-in duration-1000">
                    {videoType === 'upload' ? (
                        <video 
                            ref={videoRef}
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain bg-black"
                            playsInline
                        />
                    ) : (
                        <iframe 
                            src={getEmbedUrl(videoUrl)}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                        />
                    )}
                </div>
            )}
        </div>
    );
};
