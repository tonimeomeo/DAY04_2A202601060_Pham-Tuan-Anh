import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeContext';

export default function Layout() {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    return (
        <div className="font-body-md text-body-md overflow-x-hidden min-h-screen bg-background text-on-surface">
            {/* TopNavBar */}
            <header className="flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50 bg-surface border-b border-outline-variant">
                <div className="flex items-center gap-unit-md cursor-pointer">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">ScholarAI</span>
                </div>
                
                {location.pathname === '/' && (
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-gutter">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input className="w-full bg-primary-container border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary transition-all font-label-md text-label-md" placeholder="Search research papers..." type="text"/>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-unit-md">
                    <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 bg-transparent cursor-pointer">notifications</button>
                    <button onClick={toggleTheme} className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 bg-transparent cursor-pointer">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </button>
                    <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary transition-colors duration-200 bg-transparent cursor-pointer">settings</button>
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer active:opacity-80 transition-opacity">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAL3Nt0wTSgrb_0_f3ov7R2D8t9KqysPlhuRYiJUGbJUvvKwI3yL9HyNIHeTW8Ml0lBp7Z4WXJYdIg8Ij_QmE1xKSX69Tx_e5f7YDZrqFXuzc8oLPxbUPT4Qw1N8gxdhmDCRJGWqdYdjjuVAiNXn4J51CDGS7e5iAAwIWJ-eo5npztjxs4T-6RGXrUNhonI_vhZkfE93tPYRmTRdQz5-gXxThyY-g4zWfhQFHIQXnbfp8hrNBb0XrVn" alt="Avatar"/>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)]">
                {/* SideNavBar */}
                <aside className="hidden md:flex flex-col w-[280px] h-full p-unit-md gap-unit-sm bg-surface-container-low border-r border-outline-variant sticky top-16">
                    <div className="mb-unit-xl px-2">
                        <h3 className="font-headline-md text-[20px] text-primary mb-1">Research Portal</h3>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Deep-Sea Analysis</p>
                    </div>
                    
                    <nav className="flex flex-col gap-1 flex-1">
                        <NavLink to={location.pathname === '/chat' ? '/' : '/chat'} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-[0.98] ${isActive || location.pathname === '/chat' ? 'font-bold bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                            <span className="material-symbols-outlined" style={{fontVariationSettings: (location.pathname === '/chat' || location.pathname === '/') ? "'FILL' 1" : "'FILL' 0"}}>science</span>
                            <span className="font-label-md text-label-md">{location.pathname === '/chat' ? 'Current Research' : 'Research'}</span>
                        </NavLink>
                        
                        <NavLink to="/library" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-[0.98] ${isActive ? 'font-bold bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                            <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/library' ? "'FILL' 1" : "'FILL' 0"}}>auto_stories</span>
                            <span className="font-label-md text-label-md">Library</span>
                        </NavLink>
                        
                        <NavLink to="/analysis" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-[0.98] ${isActive ? 'font-bold bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                            <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/analysis' ? "'FILL' 1" : "'FILL' 0"}}>analytics</span>
                            <span className="font-label-md text-label-md">Analysis</span>
                        </NavLink>
                        
                        <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-[0.98] ${isActive ? 'font-bold bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                            <span className="material-symbols-outlined" style={{fontVariationSettings: location.pathname === '/settings' ? "'FILL' 1" : "'FILL' 0"}}>person</span>
                            <span className="font-label-md text-label-md">Account</span>
                        </NavLink>
                        
                        <div className="mt-unit-xl pt-unit-xl border-t border-outline-variant/30 flex flex-col gap-1">
                            <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-[0.98]">
                                <span className="material-symbols-outlined">settings</span>
                                <span className="font-label-md text-label-md">Settings</span>
                            </NavLink>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-[0.98]">
                                <span className="material-symbols-outlined">help</span>
                                <span className="font-label-md text-label-md">Help</span>
                            </a>
                        </div>
                    </nav>
                    
                    <button className="mt-auto w-full bg-secondary text-on-secondary-fixed font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-secondary/10">
                        <span className="material-symbols-outlined">add</span>
                        <span className="font-label-md text-label-md">New Project</span>
                    </button>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 w-full relative bg-background overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
