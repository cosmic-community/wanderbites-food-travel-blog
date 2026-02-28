import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-charcoal-900 prose-p:text-gray-700 prose-a:text-terracotta-500 hover:prose-a:text-terracotta-700 prose-strong:text-charcoal-800 prose-blockquote:border-terracotta-400 prose-blockquote:text-gray-600 prose-hr:border-gray-200">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}