import { findNode, Kind } from '@/lib/docs';
import Link from 'next/link';
import { Box, FileCode, Layers, Zap, ExternalLink } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { DocNode } from '@/lib/docs';

function CategorySection({ title, items, icon: Icon, color }: { title: string, items: DocNode[], icon: any, color: string }) {
    if (items.length === 0) return null;

    return (
        <section className="mb-10">
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${color}`}>
                <Icon className="w-6 h-6" />
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <Link
                        key={item.id}
                        href={`/docs/${title.toLowerCase()}/${item.name}`}
                        className="p-4 bg-[#2f3136] rounded-lg border border-gray-800 hover:border-blurple transition-all hover:-translate-y-1 group"
                    >
                        <h3 className="text-lg font-bold text-white group-hover:text-blurple transition-colors mb-2 flex items-center justify-between">
                            {item.name}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" />
                        </h3>
                        {item.comment?.summary && (
                            <div className="text-sm text-gray-400 line-clamp-2">
                                <MarkdownRenderer content={item.comment.summary.map(s => s.text).join('')} />
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}

export default function DocsHomePage() {
    const node = findNode([]);

    if (!node) {
        return (
            <div className="prose prose-invert max-w-none text-center pt-20">
                <h1 className="text-5xl font-bold mb-4 text-blurple">Disvoice Docs</h1>
                <p className="text-xl text-gray-400 mb-8">Documentation could not be loaded.</p>
            </div>
        );
    }

    const classes = node.children?.filter(c => c.kind === Kind.Class) || [];
    const interfaces = node.children?.filter(c => c.kind === Kind.Interface) || [];
    const enums = node.children?.filter(c => c.kind === Kind.Enum) || [];
    const typeAliases = node.children?.filter(c => c.kind === Kind.TypeAlias) || [];
    const functions = node.children?.filter(c => c.kind === Kind.Function) || [];

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <header className="border-b border-gray-700 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blurple/20 text-blurple border border-blurple/30">
                        {node.kindString}
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-white">{node.name}</h1>

                {node.comment?.summary && (
                    <div className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl">
                        <MarkdownRenderer content={node.comment.summary.map(s => s.text).join('')} />
                    </div>
                )}
            </header>

            <CategorySection title="Classes" items={classes} icon={Box} color="text-blurple" />
            <CategorySection title="Interfaces" items={interfaces} icon={Layers} color="text-green-400" />
            <CategorySection title="Enums" items={enums} icon={FileCode} color="text-red-400" />
            <CategorySection title="Types" items={typeAliases} icon={FileCode} color="text-yellow-400" />
            <CategorySection title="Functions" items={functions} icon={Zap} color="text-purple-400" />
        </div>
    );
}
