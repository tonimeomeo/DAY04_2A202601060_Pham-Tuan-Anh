import React from 'react';
import { Link } from 'react-router-dom';

export default function Library() {
    return (
        <div className="p-unit-xl">
            <div className="max-w-container-max mx-auto mt-8">
                <h1 className="font-headline-lg text-4xl text-on-surface mb-unit-lg">Library</h1>
                <div className="glass-card rounded-xl p-unit-xl flex flex-col items-center justify-center min-h-[400px] text-center">
                    <span className="material-symbols-outlined text-[64px] text-secondary mb-4 opacity-50">auto_stories</span>
                    <h2 className="font-headline-md text-2xl text-on-surface mb-2">Your Research Library is Empty</h2>
                    <p className="text-on-surface-variant max-w-md">Saved papers, citations, and datasets will appear here. Start a new research session to map your first sources.</p>
                    <Link to="/chat" className="mt-6 px-6 py-3 bg-secondary text-on-secondary-fixed rounded-lg font-bold hover:scale-105 transition-all">Start New Research</Link>
                </div>
            </div>
        </div>
    );
}
