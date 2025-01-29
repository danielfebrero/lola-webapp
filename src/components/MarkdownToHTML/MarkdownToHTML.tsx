// src/MarkdownRenderer.tsx
import React from "react";
// import "github-markdown-css/github-markdown.css";

interface MarkdownRendererProps {
  content: string;
  showWorkerIndicator: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  showWorkerIndicator,
}) => {
  // Basic Markdown to HTML conversion
  const parseMarkdown = (markdown: string): string => {
    let html = markdown;

    // Escape HTML tags
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^###### (.*$)/gim, "<h6>$1</h6>");
    html = html.replace(/^##### (.*$)/gim, "<h5>$1</h5>");
    html = html.replace(/^#### (.*$)/gim, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
    html = html.replace(/__(.*?)__/gim, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");
    html = html.replace(/_(.*?)_/gim, "<em>$1</em>");

    // Strikethrough
    html = html.replace(/~~(.*?)~~/gim, "<del>$1</del>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/gim,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Unordered Lists
    html = html.replace(/^\s*[-+*] (.*)/gim, "<li>$1</li>");
    html = html.replace(/<\/li>\n<li>/gim, "</li><li>");
    html = html.replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>");

    // Ordered Lists
    html = html.replace(/^\s*\d+\. (.*)/gim, "<li>$1</li>");
    html = html.replace(/<\/li>\n<li>/gim, "</li><li>");
    html = html.replace(/(<li>.*<\/li>)/gim, "<ol>$1</ol>");

    // Code Blocks
    html = html.replace(/```(.*$)```/gim, "<pre><code>$1</code></pre>");

    // Inline Code
    html = html.replace(/`([^`]+)`/gim, "<code>$1</code>");

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

    // New lines
    html = html.replace(/\n$/gim, "<br />");

    return html;
  };

  const htmlContent = showWorkerIndicator
    ? `${parseMarkdown(
        content
      )}<div class="inline-block ml-2 rounded-full w-[12px] h-[12px] bg-textPrimary dark:bg-darkTextPrimary"></div>`
    : parseMarkdown(content);

  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
