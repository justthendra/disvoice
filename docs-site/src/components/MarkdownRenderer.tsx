import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Or any other style

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-invert max-w-none prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <code className={`${className} !bg-[#1e1f22]`} {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className="bg-[#2f3136] rounded px-1 py-0.5 text-sm font-mono text-gray-200" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre({ node, children, ...props }: any) {
                        return <pre className="bg-[#232529] rounded-lg p-4 overflow-x-auto border border-[#232529] my-4" {...props}>{children}</pre>
                    },
                    a({ node, children, ...props }: any) {
                        return <a className="text-blurple hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
                    },
                    table({ node, children, ...props }: any) {
                        return <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-[#2f3136]" {...props}>{children}</table></div>
                    },
                    th({ node, children, ...props }: any) {
                        return <th className="px-4 py-2 bg-[#2f3136] text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props}>{children}</th>
                    },
                    td({ node, children, ...props }: any) {
                        return <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 border-t border-gray-700" {...props}>{children}</td>
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
