import React from 'react';

export default function Analysis() {
    return (
        <div className="p-unit-xl">
            <div className="max-w-container-max mx-auto mt-8">
                <h1 className="font-headline-lg text-4xl text-on-surface mb-unit-lg">Analysis Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
                    <div className="glass-card rounded-xl p-unit-lg flex flex-col gap-4">
                        <h3 className="font-headline-md text-xl text-on-surface">Recent Extractions</h3>
                        <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                            <span className="material-symbols-outlined text-secondary">memory</span>
                            <div>
                                <div className="text-sm text-on-surface font-bold">Methodology Analysis</div>
                                <div className="text-xs text-on-surface-variant">Extracted from 12 sources</div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-xl p-unit-lg flex items-center justify-center min-h-[300px]">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-[48px] text-tertiary mb-2 opacity-50">monitoring</span>
                            <p className="text-on-surface-variant">Run a query to generate analysis graphs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
