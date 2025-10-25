import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

const EditorPage: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const [boldActive, setBoldActive] = React.useState(false);
  const [italicActive, setItalicActive] = React.useState(false);
  const [strikeActive, setStrikeActive] = React.useState(false);
  const [codeActive, setCodeActive] = React.useState(false);
  const [h1Active, setH1Active] = React.useState(false);
  const [h2Active, setH2Active] = React.useState(false);
  const [h3Active, setH3Active] = React.useState(false);
  const [bulletListActive, setBulletListActive] = React.useState(false);
  const [orderedListActive, setOrderedListActive] = React.useState(false);
  const [codeBlockActive, setCodeBlockActive] = React.useState(false);
  const [blockquoteActive, setBlockquoteActive] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
        style: 'min-height: 100%; padding: 20px 40px; font-size: 16px; line-height: 1.6; color: #ffffff;',
      },
    },
    onSelectionUpdate: ({ editor }) => {
      setBoldActive(editor.isActive('bold'));
      setItalicActive(editor.isActive('italic'));
      setStrikeActive(editor.isActive('strike'));
      setCodeActive(editor.isActive('code'));
      setH1Active(editor.isActive('heading', { level: 1 }));
      setH2Active(editor.isActive('heading', { level: 2 }));
      setH3Active(editor.isActive('heading', { level: 3 }));
      setBulletListActive(editor.isActive('bulletList'));
      setOrderedListActive(editor.isActive('orderedList'));
      setCodeBlockActive(editor.isActive('codeBlock'));
      setBlockquoteActive(editor.isActive('blockquote'));
    },
    onUpdate: ({ editor }) => {
      setBoldActive(editor.isActive('bold'));
      setItalicActive(editor.isActive('italic'));
      setStrikeActive(editor.isActive('strike'));
      setCodeActive(editor.isActive('code'));
      setH1Active(editor.isActive('heading', { level: 1 }));
      setH2Active(editor.isActive('heading', { level: 2 }));
      setH3Active(editor.isActive('heading', { level: 3 }));
      setBulletListActive(editor.isActive('bulletList'));
      setOrderedListActive(editor.isActive('orderedList'));
      setCodeBlockActive(editor.isActive('codeBlock'));
      setBlockquoteActive(editor.isActive('blockquote'));
    },
  });

  const clearFormatting = () => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#191919',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '0',
      position: 'relative'
    }}>
      <TopBar background="#202020" borderBottom="1px solid #2a2a2a" hideBorderLeftPx={collapsed ? 0 : 230} onToggleSidebar={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '0' }}>
        <Sidebar 
          collapsed={collapsed} 
          onOpenSearch={() => {}} 
          onLogout={() => {}}
        />
        <div style={{ flex: 1, padding: '0', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* Floating Toolbar */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #2a2a2a',
            padding: '12px 20px',
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
                setBoldActive(editor?.isActive('bold') || false);
              }}
              disabled={!editor?.can().chain().focus().toggleBold().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: boldActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
                setItalicActive(editor?.isActive('italic') || false);
              }}
              disabled={!editor?.can().chain().focus().toggleItalic().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: italicActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontStyle: 'italic',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleStrike().run();
                setStrikeActive(editor?.isActive('strike') || false);
              }}
              disabled={!editor?.can().chain().focus().toggleStrike().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: strikeActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                textDecoration: 'line-through',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Strikethrough"
            >
              S
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleCode().run();
                setCodeActive(editor?.isActive('code') || false);
              }}
              disabled={!editor?.can().chain().focus().toggleCode().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: codeActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Inline Code (Ctrl+E)"
            >
              {'</>'}
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#3a3a3a', margin: '0 4px' }} />
            <button
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 1 }).run();
                setH1Active(editor?.isActive('heading', { level: 1 }) || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: h1Active ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 2 }).run();
                setH2Active(editor?.isActive('heading', { level: 2 }) || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: h2Active ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 3 }).run();
                setH3Active(editor?.isActive('heading', { level: 3 }) || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: h3Active ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              title="Heading 3"
            >
              H3
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#3a3a3a', margin: '0 4px' }} />
            <button
              onClick={() => {
                editor?.chain().focus().toggleBulletList().run();
                setBulletListActive(editor?.isActive('bulletList') || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: bulletListActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Bullet List"
            >
              • List
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleOrderedList().run();
                setOrderedListActive(editor?.isActive('orderedList') || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: orderedListActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Numbered List"
            >
              1. List
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleCodeBlock().run();
                setCodeBlockActive(editor?.isActive('codeBlock') || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: codeBlockActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'monospace',
                transition: 'all 0.2s'
              }}
              title="Code Block"
            >
              {'{ }'}
            </button>
            <button
              onClick={() => {
                editor?.chain().focus().toggleBlockquote().run();
                setBlockquoteActive(editor?.isActive('blockquote') || false);
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: blockquoteActive ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Quote"
            >
              " Quote
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#3a3a3a', margin: '0 4px' }} />
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Horizontal Rule"
            >
              ―
            </button>
            <button
              onClick={() => editor?.chain().focus().setParagraph().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Normal Text"
            >
              P
            </button>
            <button
              onClick={() => editor?.chain().focus().setHardBreak().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Line Break (Shift+Enter)"
            >
              ↵
            </button>
            <button
              onClick={clearFormatting}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Clear Formatting"
            >
              ✕ Clear
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#3a3a3a', margin: '0 4px' }} />
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              style={{
                padding: '8px 12px',
                backgroundColor: showShortcuts ? '#3b82f6' : 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Keyboard Shortcuts"
            >
              ⌨ Help
            </button>
            <button
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid #3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          {/* Keyboard Shortcuts Panel */}
          {showShortcuts && (
            <div style={{
              position: 'absolute',
              top: '70px',
              right: '20px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              padding: '20px',
              zIndex: 100,
              maxWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '16px' }}>Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ display: 'grid', gap: '8px', fontSize: '13px', color: '#ccc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bold</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+B</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Italic</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+I</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Code</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+E</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Heading 1</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Alt+1</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Heading 2</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Alt+2</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bullet List</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Shift+8</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Numbered List</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Shift+7</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Code Block</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Alt+C</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Quote</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Shift+B</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Line Break</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Shift+Enter</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Undo</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Z</kbd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Redo</span>
                  <kbd style={{ backgroundColor: '#2a2a2a', padding: '2px 6px', borderRadius: '3px' }}>Ctrl+Y</kbd>
                </div>
              </div>
            </div>
          )}

          {/* Editor Content */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#191919',
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '20px 20px',
            }}>
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror h1 {
          font-size: 2.5em;
          font-weight: 700;
          margin: 1em 0 0.5em;
          line-height: 1.2;
        }
        .ProseMirror h2 {
          font-size: 2em;
          font-weight: 600;
          margin: 0.8em 0 0.4em;
          line-height: 1.3;
        }
        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.6em 0 0.3em;
          line-height: 1.4;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .ProseMirror li {
          margin: 0.25em 0;
        }
        .ProseMirror code {
          background-color: #2a2a2a;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .ProseMirror pre {
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          padding: 1em;
          margin: 1em 0;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
          font-size: 0.9em;
          color: #e0e0e0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #3b82f6;
          padding-left: 1em;
          margin: 1em 0;
          color: #b0b0b0;
          font-style: italic;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #2a2a2a;
          margin: 2em 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: 'Start writing or type "/" for commands...';
          color: #6b7280;
          pointer-events: none;
          height: 0;
          float: left;
        }
        .ProseMirror::selection {
          background-color: #3b82f6;
          color: #ffffff;
        }
        .ProseMirror::-moz-selection {
          background-color: #3b82f6;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default EditorPage;
