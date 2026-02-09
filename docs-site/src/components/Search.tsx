'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Search as SearchIcon, File, Box, Braces, Calculator } from 'lucide-react';
import { getAllSearchItems, SearchItem, Kind } from '@/lib/docs';
import clsx from 'clsx';

export function Search() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const [items, setItems] = React.useState<SearchItem[]>([]);

    React.useEffect(() => {
        setItems(getAllSearchItems());

        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-discord-nav rounded-md border border-gray-700 hover:border-gray-600 hover:text-gray-300 transition-colors"
            >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden md:inline">Search documentation...</span>
                <span className="hidden md:inline text-xs text-gray-500 border border-gray-700 px-1.5 py-0.5 rounded">Ctrl K</span>
            </button>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Search"
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full bg-[#2f3136] rounded-xl shadow-2xl border border-gray-800 z-50 overflow-hidden"
            >
                <div className="flex items-center gap-3 px-4 border-b border-gray-700">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                    <Command.Input
                        className="w-full bg-transparent py-4 text-white placeholder-gray-500 outline-none text-lg"
                        placeholder="Search for classes, methods, properties..."
                    />
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <Command.Empty className="py-6 text-center text-gray-500">No results found.</Command.Empty>

                    <Command.Group heading="Result" className="text-xs font-bold text-gray-500 px-2 py-1 mb-1">
                        {items.map((item) => (
                            <Command.Item
                                key={item.path}
                                value={`${item.title} ${item.kindString}`}
                                onSelect={() => {
                                    runCommand(() => router.push(item.path));
                                }}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-gray-300 transition-colors",
                                    "aria-selected:bg-blurple aria-selected:text-white"
                                )}
                            >
                                <div className={clsx(
                                    "flex items-center justify-center w-6 h-6 rounded-md bg-opacity-20",
                                    item.kind === Kind.Class && "bg-blue-500 text-blue-400",
                                    item.kind === Kind.Interface && "bg-green-500 text-green-400",
                                    item.kind === Kind.Method && "bg-purple-500 text-purple-400",
                                    item.kind === Kind.Property && "bg-yellow-500 text-yellow-500",
                                )}>
                                    {item.kind === Kind.Class && <Box className="w-4 h-4" />}
                                    {item.kind === Kind.Interface && <Braces className="w-4 h-4" />}
                                    {item.kind === Kind.Method && <span className="text-xs font-bold">M</span>}
                                    {item.kind === Kind.Property && <span className="text-xs font-bold">P</span>}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{item.title}</span>
                                    <span className="text-xs opacity-70">{item.kindString}</span>
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>
            </Command.Dialog>

            {/* Overlay */}
            {open && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />}
        </>
    );
}
