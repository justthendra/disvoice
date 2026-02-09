import { findNode, Kind, DocNode } from '@/lib/docs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ExternalLink, Hash, Box, FileCode, Layers, Zap } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const SOURCE_BASE_URL = 'https://github.com/justthendra/disvoice/blob/master/';

function SourceLink({ sources }: { sources?: DocNode['sources'] }) {
    if (!sources || sources.length === 0) return null;
    const source = sources[0];
    const url = `${SOURCE_BASE_URL}${source.fileName}#L${source.line}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blurple"
            title={`Defined in ${source.fileName}:${source.line}`}
        >
            <ExternalLink className="w-4 h-4" />
        </a>
    );
}

// Helper components for different kinds of nodes
function SignatureRenderer({ signature, parentName }: { signature: DocNode, parentName?: string }) {
    const anchor = signature.name;

    return (
        <div id={anchor} className="group mb-6 p-6 bg-[#2f3136] rounded-xl border border-gray-800 hover:border-gray-700 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-mono text-blue-300 flex items-center gap-2">
                    <a href={`#${anchor}`} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-blurple transition-colors">
                        <Hash className="w-4 h-4" />
                    </a>
                    <span className="text-blurple font-bold">{signature.name}</span>
                    <span className="text-gray-400">
                        (
                        {signature.parameters?.map((p, i) => (
                            <span key={p.id}>
                                {i > 0 && ', '}
                                {p.name}: <span className="text-yellow-300">{p.type?.name || 'any'}</span>
                            </span>
                        ))}
                        )
                    </span>
                    {signature.type && (
                        <>: <span className="text-green-400">{signature.type.name}</span></>
                    )}
                </h4>
                <SourceLink sources={signature.sources} />
            </div>

            {signature.comment?.summary && (
                <div className="text-gray-300 leading-relaxed pl-6 border-l-2 border-blurple/30">
                    <MarkdownRenderer content={signature.comment.summary.map(s => s.text).join('')} />
                </div>
            )}
        </div>
    );
}

function PropertyRenderer({ property }: { property: DocNode }) {
    const anchor = property.name;

    return (
        <div id={anchor} className="group mb-6 pl-4 border-l-2 border-gray-700 hover:border-blurple transition-colors py-2">
            <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <a href={`#${anchor}`} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-blurple transition-colors">
                        <Hash className="w-4 h-4" />
                    </a>
                    .{property.name}
                    {property.flags?.isOptional && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">Optional</span>}
                </h4>
                <SourceLink sources={property.sources} />
            </div>

            <div className="text-sm font-mono text-gray-400 mb-2 pl-6">
                Type: <span className="text-yellow-300">{property.type?.name || 'any'}</span>
            </div>
            {property.comment?.summary && (
                <div className="text-gray-300 pl-6">
                    <MarkdownRenderer content={property.comment.summary.map(s => s.text).join('')} />
                </div>
            )}
        </div>
    );
}

function EnumMemberRenderer({ member }: { member: DocNode }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 group">
            <div className="font-mono text-blue-300">{member.name}</div>
            <div className="text-gray-500 text-sm">= <span className="text-yellow-400">{member.type?.value || member.defaultValue || '...'}</span></div>
        </div>
    );
}

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

export default async function DocPage(props: { params: Promise<{ slug?: string[] }> }) {
    const params = await props.params;
    const slug = params.slug || [];
    const node = findNode(slug);

    if (!node) {
        if (slug.length === 0) {
            return (
                <div className="prose prose-invert max-w-none text-center pt-20">
                    <h1 className="text-5xl font-bold mb-4 text-blurple">Disvoice Docs</h1>
                    <p className="text-xl text-gray-400 mb-8">Documentation could not be loaded.</p>
                </div>
            )
        }
        return notFound();
    }

    // Leaf nodes
    const properties = node.children?.filter(c => c.kind === Kind.Property) || [];
    const methods = node.children?.filter(c => c.kind === Kind.Method) || [];
    const constructors = node.children?.filter(c => c.kind === Kind.Constructor) || [];
    const enumMembers = node.children?.filter(c => c.kind === Kind.EnumMember) || [];
    const signatures = node.signatures || []; // For TypeDoc Functions

    // Container nodes (for dashboard view)
    const classes = node.children?.filter(c => c.kind === Kind.Class) || [];
    const interfaces = node.children?.filter(c => c.kind === Kind.Interface) || [];
    const enums = node.children?.filter(c => c.kind === Kind.Enum) || [];
    const typeAliases = node.children?.filter(c => c.kind === Kind.TypeAlias) || [];
    const functions = node.children?.filter(c => c.kind === Kind.Function) || [];

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <Breadcrumbs slug={slug} />

            <header className="border-b border-gray-700 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blurple/20 text-blurple border border-blurple/30">
                                {node.kindString}
                            </span>
                            {node.flags?.isExternal && <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-400">External</span>}
                        </div>
                        <h1 className="text-4xl font-bold text-white">{node.name}</h1>
                    </div>
                    <SourceLink sources={node.sources} />
                </div>

                {node.comment?.summary && (
                    <div className="mt-6 text-lg text-gray-300 leading-relaxed max-w-3xl">
                        <MarkdownRenderer content={node.comment.summary.map(s => s.text).join('')} />
                    </div>
                )}
            </header>

            {/* Dashboard View for Container Nodes */}
            <CategorySection title="Classes" items={classes} icon={Box} color="text-blurple" />
            <CategorySection title="Interfaces" items={interfaces} icon={Layers} color="text-green-400" />
            <CategorySection title="Enums" items={enums} icon={FileCode} color="text-red-400" />
            <CategorySection title="Types" items={typeAliases} icon={FileCode} color="text-yellow-400" />
            <CategorySection title="Functions" items={functions} icon={Zap} color="text-purple-400" />

            {/* Detailed View for Leaf Nodes */}
            {/* Handle Top-level Functions (signatures) */}
            {signatures.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Signatures
                    </h2>
                    <div className="space-y-6">
                        {signatures.map(sig => <SignatureRenderer key={sig.id} signature={sig} parentName={node.name} />)}
                    </div>
                </section>
            )}

            {enumMembers.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-1 h-6 bg-red-400 rounded-full"></span>
                        Members
                    </h2>
                    <div className="bg-[#2f3136]/50 rounded-xl border border-gray-800 p-6">
                        {enumMembers.map(m => <EnumMemberRenderer key={m.id} member={m} />)}
                    </div>
                </section>
            )}

            {constructors.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                        Constructor
                    </h2>
                    {constructors.map(c =>
                        c.signatures?.map(sig => <SignatureRenderer key={sig.id} signature={sig} parentName={node.name} />)
                    )}
                </section>
            )}

            {properties.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                        Properties
                    </h2>
                    <div className="bg-[#2f3136]/50 rounded-xl border border-gray-800 p-6">
                        {properties.map(p => <PropertyRenderer key={p.id} property={p} />)}
                    </div>
                </section>
            )}

            {methods.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Methods
                    </h2>
                    <div className="space-y-6">
                        {methods.map(m =>
                            m.signatures?.map(sig => <SignatureRenderer key={sig.id} signature={sig} parentName={node.name} />)
                        )}
                    </div>
                </section>
            )}

        </div>
    );
}

export async function generateStaticParams() {
    return [];
}
