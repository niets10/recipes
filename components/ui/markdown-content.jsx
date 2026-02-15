'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
};

/**
 * Renders markdown as rich text. Safe by default (no raw HTML).
 * Supports **bold**, *italic*, lists, [links](url), and GFM (tables, strikethrough).
 */
export function MarkdownContent({ children, className, ...props }) {
    if (children == null || String(children).trim() === '') {
        return null;
    }

    return (
        <div
            className={cn('markdown-content text-muted-foreground leading-relaxed', className)}
            {...props}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children: linkChildren }) => (
                        <a href={href} {...linkProps} className="text-primary underline underline-offset-2 hover:no-underline">
                            {linkChildren}
                        </a>
                    ),
                    ul: ({ children: listChildren }) => (
                        <ul className="my-2 list-disc pl-6 space-y-0.5">{listChildren}</ul>
                    ),
                    ol: ({ children: listChildren }) => (
                        <ol className="my-2 list-decimal pl-6 space-y-0.5">{listChildren}</ol>
                    ),
                    li: ({ children: liChildren }) => <li className="leading-relaxed">{liChildren}</li>,
                    p: ({ children: pChildren }) => <p className="my-2 first:mt-0 last:mb-0">{pChildren}</p>,
                    strong: ({ children: strongChildren }) => (
                        <strong className="font-semibold text-foreground">{strongChildren}</strong>
                    ),
                    em: ({ children: emChildren }) => (
                        <em className="italic">{emChildren}</em>
                    ),
                    h1: ({ children: hChildren }) => (
                        <h3 className="mt-4 mb-2 text-base font-semibold text-foreground">{hChildren}</h3>
                    ),
                    h2: ({ children: hChildren }) => (
                        <h4 className="mt-3 mb-1.5 text-sm font-semibold text-foreground">{hChildren}</h4>
                    ),
                    h3: ({ children: hChildren }) => (
                        <h5 className="mt-2 mb-1 text-sm font-medium text-foreground">{hChildren}</h5>
                    ),
                    blockquote: ({ children: bqChildren }) => (
                        <blockquote className="border-l-2 border-muted-foreground/40 pl-4 my-2 italic">
                            {bqChildren}
                        </blockquote>
                    ),
                    code: ({ className: codeClassName, children: codeChildren, ...rest }) => {
                        const isInline = !codeClassName;
                        if (isInline) {
                            return (
                                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono" {...rest}>
                                    {codeChildren}
                                </code>
                            );
                        }
                        return (
                            <code className={cn('block rounded bg-muted p-3 text-sm font-mono overflow-x-auto', codeClassName)} {...rest}>
                                {codeChildren}
                            </code>
                        );
                    },
                }}
            >
                {String(children)}
            </ReactMarkdown>
        </div>
    );
}
