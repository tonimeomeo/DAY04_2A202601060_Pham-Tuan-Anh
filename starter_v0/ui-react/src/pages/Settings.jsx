import React from 'react';

export default function Settings() {
    return (
        <div className="p-unit-xl">
            <div className="max-w-container-max mx-auto mt-8 max-w-3xl">
                <h1 className="font-headline-lg text-4xl text-on-surface mb-unit-lg">Account Settings</h1>
                <div className="glass-card rounded-xl p-unit-xl flex flex-col gap-6">
                    <div className="flex items-center gap-6 border-b border-outline-variant/30 pb-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary shrink-0">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL3Nt0wTSgrb_0_f3ov7R2D8t9KqysPlhuRYiJUGbJUvvKwI3yL9HyNIHeTW8Ml0lBp7Z4WXJYdIg8Ij_QmE1xKSX69Tx_e5f7YDZrqFXuzc8oLPxbUPT4Qw1N8gxdhmDCRJGWqdYdjjuVAiNXn4J51CDGS7e5iAAwIWJ-eo5npztjxs4T-6RGXrUNhonI_vhZkfE93tPYRmTRdQz5-gXxThyY-g4zWfhQFHIQXnbfp8hrNBb0XrVn" alt="Avatar"/>
                        </div>
                        <div>
                            <h2 className="text-2xl text-on-surface font-bold">Dr. Academic Researcher</h2>
                            <p className="text-on-surface-variant">Free Plan &bull; Upgraded to ScholarAI Core</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-on-surface">Preferences</h3>
                        <label className="flex items-center gap-3 text-on-surface-variant">
                            <input type="checkbox" defaultChecked className="rounded bg-surface-container-high border-outline-variant text-secondary focus:ring-secondary"/>
                            Enable Deep-Sea Mode (Experimental)
                        </label>
                        <label className="flex items-center gap-3 text-on-surface-variant">
                            <input type="checkbox" defaultChecked className="rounded bg-surface-container-high border-outline-variant text-secondary focus:ring-secondary"/>
                            Auto-save citations to Library
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
