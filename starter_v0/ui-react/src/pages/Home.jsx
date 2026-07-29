import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCanvas from '../components/HeroCanvas';

export default function Home() {
    useEffect(() => {
        // Micro-interactions
        const cards = document.querySelectorAll('.glass-card');
        const handleMouseMove = (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };

        cards.forEach(card => card.addEventListener('mousemove', handleMouseMove));

        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-10');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.grid > div').forEach(el => {
            el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
            observer.observe(el);
        });

        return () => {
            cards.forEach(card => card.removeEventListener('mousemove', handleMouseMove));
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden px-4 md:px-margin py-unit-xl">
                <div className="absolute inset-0 academic-mesh z-0"></div>
                <div className="absolute inset-0 ocean-glow z-0"></div>
                
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-70" style={{WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'}}>
                    <HeroCanvas />
                </div>
                
                <div className="relative z-10 max-w-container-max text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 mb-unit-lg">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">Deep-Sea Research Lab</span>
                    </div>
                    <h1 className="font-display-lg text-4xl md:text-5xl lg:text-[56px] text-on-surface max-w-4xl mx-auto mb-unit-md leading-tight">
                        Map Research Evidence with <span className="text-secondary">AI Precision.</span>
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-tertiary-container max-w-2xl mx-auto mb-unit-xl">
                        A sophisticated AI-driven platform for literature review, citation mapping, and evidence synthesis. Accelerate your academic writing with precise deep-sea analysis.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-unit-md">
                        <Link to="/chat" className="bg-secondary text-on-secondary-fixed px-unit-xl py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20 flex items-center gap-2">
                            Start Researching <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                        <button className="border border-outline-variant bg-surface-container-low text-on-surface px-unit-xl py-4 rounded-lg font-bold text-lg hover:bg-surface-container-high transition-all">
                            Try Sample Query
                        </button>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="px-4 md:px-margin py-unit-xl max-w-container-max mx-auto">
                <div className="mb-unit-xl">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Deep Intellectual Tools</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Advanced capabilities engineered for the rigorous demands of higher academic research.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-unit-lg h-auto md:h-[600px]">
                    {/* Large Feature: Analysis */}
                    <div className="md:col-span-8 glass-card rounded-xl p-unit-xl flex flex-col justify-between group overflow-hidden relative">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-unit-lg border border-secondary/20">
                                <span className="material-symbols-outlined text-secondary">analytics</span>
                            </div>
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm">Deep-Sea Analysis</h3>
                            <p className="font-body-md text-body-md text-on-tertiary-container max-w-md">Our proprietary algorithm dives deep into archival databases to find obscure connections and synthesize meta-analytical insights in seconds.</p>
                        </div>
                        
                        {/* Mock UI Details */}
                        <div className="relative z-10 mt-8 w-full border border-outline-variant bg-surface-container-lowest/50 backdrop-blur-md rounded-xl p-4 shadow-2xl flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
                                <span className="font-label-sm text-on-surface-variant text-xs uppercase tracking-wider flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-secondary">search</span> Query: Impact of LLMs on Peer Review</span>
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            </div>
                            
                            {/* Source Row 1 */}
                            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded bg-tertiary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary">article</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-label-md text-sm text-on-surface truncate">Generative AI in Academic Publishing</h4>
                                    <div className="flex gap-2 text-xs text-on-surface-variant mt-1">
                                        <span>Smith et al. (2024)</span> &bull; 
                                        <span className="text-secondary">Peer-Reviewed</span>
                                    </div>
                                </div>
                                <div className="w-16 flex flex-col gap-1 items-end shrink-0">
                                    <span className="text-[10px] text-teal-400 font-label-sm">98% Match</span>
                                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-400 w-[98%]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Source Row 2 */}
                            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded bg-tertiary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary">dataset</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-label-md text-sm text-on-surface truncate">Dataset: LLM hallucinations in citations</h4>
                                    <div className="flex gap-2 text-xs text-on-surface-variant mt-1">
                                        <span>Chen (2023)</span> &bull; 
                                        <span className="text-[#f59e0b]">Dataset</span>
                                    </div>
                                </div>
                                <div className="w-16 flex flex-col gap-1 items-end shrink-0">
                                    <span className="text-[10px] text-teal-400 font-label-sm">85% Match</span>
                                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-400 w-[85%]"></div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Source Row 3 */}
                            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 hover:border-secondary/50 transition-colors cursor-pointer opacity-70">
                                <div className="w-10 h-10 rounded bg-tertiary/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary">biotech</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-label-md text-sm text-on-surface truncate">Evaluating Methodologies for NLP</h4>
                                    <div className="flex gap-2 text-xs text-on-surface-variant mt-1">
                                        <span>Johnson (2022)</span> &bull; 
                                        <span className="text-[#8b5cf6]">Method</span>
                                    </div>
                                </div>
                                <div className="w-16 flex flex-col gap-1 items-end shrink-0">
                                    <span className="text-[10px] text-[#f59e0b] font-label-sm">62% Match</span>
                                    <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                        <div className="h-full bg-[#f59e0b] w-[62%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Feature: Smart Outlining */}
                    <div className="md:col-span-4 bg-surface-container-high rounded-xl p-unit-lg border border-outline-variant hover:border-secondary/40 transition-colors flex flex-col">
                        <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center mb-unit-md border border-tertiary/20">
                            <span className="material-symbols-outlined text-tertiary">schema</span>
                        </div>
                        <h3 className="font-headline-md text-[24px] text-on-surface mb-unit-sm">Smart Outlining</h3>
                        <p className="font-label-md text-label-md text-on-tertiary-container flex-1">Automatically structure complex arguments with AI-generated hierarchies that maintain logical flow and academic rigor.</p>
                        <div className="mt-unit-md p-4 bg-primary-container rounded border border-outline-variant/30">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                <div className="w-32 h-1.5 bg-outline-variant rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 mb-2">
                                <div className="w-2 h-2 border border-secondary rounded-full"></div>
                                <div className="w-24 h-1.5 bg-outline-variant/50 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <div className="w-2 h-2 border border-secondary rounded-full"></div>
                                <div className="w-28 h-1.5 bg-outline-variant/50 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Stats Section */}
            <section className="border-t border-outline-variant bg-surface-container-low py-unit-xl mt-unit-xl">
                <div className="max-w-container-max mx-auto px-margin flex flex-wrap justify-center gap-unit-xl md:gap-32 text-center">
                    <div>
                        <h4 className="font-display-lg text-4xl text-on-surface mb-1">50M+</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Indexed Papers</p>
                    </div>
                    <div>
                        <h4 className="font-display-lg text-4xl text-on-surface mb-1">&lt; 0.2s</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Synthesis Speed</p>
                    </div>
                    <div>
                        <h4 className="font-display-lg text-4xl text-on-surface mb-1">99.9%</h4>
                        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Citation Accuracy</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-unit-lg px-margin border-t border-outline-variant bg-background text-center">
                <p className="font-label-md text-label-md text-on-surface-variant">© 2026 ScholarAI Core. Designed for academic excellence.</p>
            </footer>
        </>
    );
}
