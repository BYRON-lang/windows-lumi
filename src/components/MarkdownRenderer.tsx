import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Paragraphs
        p: ({ children }) => (
          <p style={{ 
            margin: '0 0 12px 0',
            lineHeight: '1.6',
            color: '#ffffff'
          }}>
            {children}
          </p>
        ),
        // Headings
        h1: ({ children }) => (
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '16px 0 12px 0',
            color: '#ffffff'
          }}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '14px 0 10px 0',
            color: '#ffffff'
          }}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '12px 0 8px 0',
            color: '#ffffff'
          }}>
            {children}
          </h3>
        ),
        // Bold text
        strong: ({ children }) => (
          <strong style={{ 
            fontWeight: 'bold',
            color: '#ffffff'
          }}>
            {children}
          </strong>
        ),
        // Italic text
        em: ({ children }) => (
          <em style={{ 
            fontStyle: 'italic',
            color: '#e5e5e5'
          }}>
            {children}
          </em>
        ),
        // Unordered lists
        ul: ({ children }) => (
          <ul style={{ 
            margin: '8px 0 12px 0',
            paddingLeft: '24px',
            listStyleType: 'disc',
            color: '#ffffff'
          }}>
            {children}
          </ul>
        ),
        // Ordered lists
        ol: ({ children }) => (
          <ol style={{ 
            margin: '8px 0 12px 0',
            paddingLeft: '24px',
            listStyleType: 'decimal',
            color: '#ffffff'
          }}>
            {children}
          </ol>
        ),
        // List items
        li: ({ children }) => (
          <li style={{ 
            margin: '4px 0',
            lineHeight: '1.6',
            color: '#ffffff'
          }}>
            {children}
          </li>
        ),
        // Code blocks
        code: ({ inline, children }) => {
          if (inline) {
            return (
              <code style={{ 
                backgroundColor: '#2a2a2a',
                color: '#22c55e',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}>
                {children}
              </code>
            );
          }
          return (
            <code style={{ 
              display: 'block',
              backgroundColor: '#1a1a1a',
              color: '#e5e5e5',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              margin: '8px 0',
              border: '1px solid #2a2a2a'
            }}>
              {children}
            </code>
          );
        },
        // Pre blocks (code blocks wrapper)
        pre: ({ children }) => (
          <pre style={{ 
            margin: '8px 0 12px 0',
            overflow: 'auto'
          }}>
            {children}
          </pre>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote style={{ 
            borderLeft: '4px solid #22c55e',
            paddingLeft: '16px',
            margin: '8px 0 12px 0',
            color: '#b0b0b0',
            fontStyle: 'italic'
          }}>
            {children}
          </blockquote>
        ),
        // Links
        a: ({ href, children }) => (
          <a 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: '#22c55e',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {children}
          </a>
        ),
        // Horizontal rule
        hr: () => (
          <hr style={{ 
            border: 'none',
            borderTop: '1px solid #2a2a2a',
            margin: '16px 0'
          }} />
        ),
        // Tables
        table: ({ children }) => (
          <table style={{ 
            borderCollapse: 'collapse',
            width: '100%',
            margin: '8px 0 12px 0',
            border: '1px solid #2a2a2a'
          }}>
            {children}
          </table>
        ),
        thead: ({ children }) => (
          <thead style={{ 
            backgroundColor: '#1a1a1a'
          }}>
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody>
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr style={{ 
            borderBottom: '1px solid #2a2a2a'
          }}>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th style={{ 
            padding: '8px 12px',
            textAlign: 'left',
            fontWeight: 'bold',
            color: '#ffffff',
            borderRight: '1px solid #2a2a2a'
          }}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td style={{ 
            padding: '8px 12px',
            color: '#e5e5e5',
            borderRight: '1px solid #2a2a2a'
          }}>
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
