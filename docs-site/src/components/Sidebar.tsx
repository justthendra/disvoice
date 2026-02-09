'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSidebarData, SidebarItem } from '@/lib/docs';
import { useState, useEffect } from 'react';
import { Search } from './Search';
import { Menu, X, ChevronRight } from 'lucide-react';

function SidebarItemNode({ item }: { item: SidebarItem }) {
    const pathname = usePathname();
    const isActive = pathname === item.path;
    const [isOpen, setIsOpen] = useState(true);

    if (item.children && item.children.length > 0) {
        return (
            <div className="mb-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center w-full px-2 py-1 text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
                >
                    <ChevronRight className={`w-4 h-4 mr-2 transform transition-transform duration-200 ${isOpen ? 'rotate-90 text-white' : 'text-gray-500 group-hover:text-white'}`} />
                    {item.title}
                </button>
                {isOpen && (
                    <div className="ml-4 border-l border-gray-700 pl-2">
                        {item.children.map((child, idx) => (
                            <SidebarItemNode key={idx} item={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.path}
            className={`block px-2 py-1 text-sm rounded transition-colors ${isActive
                ? 'bg-blurple text-white shadow-md shadow-blurple/20'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
        >
            {item.title}
        </Link>
    );
}

export default function Sidebar() {
    const sidebarData = getSidebarData();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-blurple text-white rounded-full shadow-lg shadow-blurple/50 hover:bg-blurple-hover transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#2f3136] border-r border-gray-800 flex flex-col transform transition-transform duration-300 ease-in-out font-sans
        md:translate-x-0 md:static md:w-64 md:border-r
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
                <div className="p-4 flex flex-col h-full">
                    <div className="mb-6 flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-blurple rounded-full flex items-center justify-center font-bold text-white shadow-sm shadow-blurple/50">
                                D
                            </div>
                            Disvoice
                        </Link>
                        {isMobileOpen && (
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="mb-4">
                        <Search />
                    </div>

                    <nav className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pr-2">
                        {sidebarData.map((item, idx) => (
                            <SidebarItemNode key={idx} item={item} />
                        ))}
                    </nav>

                    <div className="pt-4 mt-2 border-t border-gray-800 text-xs text-center text-gray-500">
                        <p>Disvoice Documentation</p>
                        <p className="opacity-50">v1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
