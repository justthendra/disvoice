import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    slug: string[];
}

export function Breadcrumbs({ slug }: BreadcrumbsProps) {
    const crumbs = [
        { name: 'Docs', path: '/docs' },
        ...slug.map((part, index) => ({
            name: part,
            path: `/docs/${slug.slice(0, index + 1).join('/')}`,
        })),
    ];

    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-white transition-colors">
                <Home className="w-4 h-4" />
            </Link>
            {crumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                    <ChevronRight className="w-4 h-4 mx-1 text-gray-600" />
                    {index === crumbs.length - 1 ? (
                        <span className="text-blurple font-medium">{crumb.name}</span>
                    ) : (
                        <Link href={crumb.path} className="hover:text-white transition-colors">
                            {crumb.name}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
