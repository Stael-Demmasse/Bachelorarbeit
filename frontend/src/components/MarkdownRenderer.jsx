import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content, darkMode }) => {
  return (
    <div className={`markdown-content ${darkMode ? 'dark' : ''}`}>
      <ReactMarkdown
        components={{
        // Personnalisation des composants Markdown
        h1: ({ children }) => (
          <h1 className={`text-xl font-bold mb-3 ${darkMode ? 'text-gray-200' : 'text-black'}`}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-black'}`}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-black'}`}>
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className={`list-disc list-inside mb-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={`list-decimal list-inside mb-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className={`${darkMode ? 'text-gray-300' : 'text-black'}`}>
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className={`border-l-4 pl-4 my-2 italic ${
            darkMode 
              ? 'border-gray-600 bg-gray-800 text-gray-300' 
              : 'border-gray-300 bg-gray-50 text-slate-900'
          }`}>
            {children}
          </blockquote>
        ),
        code: ({ inline, children }) => {
          if (inline) {
            return (
              <code className={`px-1 py-0.5 rounded text-sm font-mono ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200' 
                  : 'bg-gray-200 text-black'
              }`}>
                {children}
              </code>
            );
          }
          return (
            <pre className={`p-3 rounded-lg overflow-x-auto my-2 ${
              darkMode 
                ? 'bg-gray-800 text-gray-200' 
                : 'bg-gray-100 text-black'
            }`}>
              <code className="text-sm font-mono">{children}</code>
            </pre>
          );
        },
        strong: ({ children }) => (
          <strong className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-black'}`}>
            {children}
          </strong>
        ),
        em: ({ children }) => (
          <em className={`italic ${darkMode ? 'text-gray-300' : 'text-slate-900'}`}>
            {children}
          </em>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`underline hover:no-underline ${
              darkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className={`min-w-full border-collapse border ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className={`border px-3 py-2 text-left font-semibold ${
            darkMode 
              ? 'border-gray-600 bg-gray-700 text-gray-200' 
              : 'border-gray-300 bg-gray-100 text-black'
          }`}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={`border px-3 py-2 ${
            darkMode 
              ? 'border-gray-600 text-gray-300' 
              : 'border-gray-300 text-black'
          }`}>
            {children}
          </td>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;