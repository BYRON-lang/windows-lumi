import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface NewNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewNotes: React.FC<NewNotesProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavourited, setIsFavourited] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);
  const createdBy = React.useMemo(() => 'You', []);

  const handleTagKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const value = tagInput.trim();
    if (!value) return;

    event.preventDefault();
    if (tags.includes(value)) {
      setTagInput('');
      return;
    }

    setTags((prev) => [...prev, value]);
    setTagInput('');
  }, [tagInput, tags]);

  const handleRemoveTag = React.useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        navigate('/editor');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99990,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '50%',
          height: '100vh',
          backgroundColor: '#202020',
          zIndex: 100000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
            WebkitAppRegion: 'no-drag',
          } as React.CSSProperties & { WebkitAppRegion: string }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'auto',
              gap: 12,
            }}
          >
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                cursor: 'pointer',
                lineHeight: 0,
              }}
              onClick={() => onClose()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <svg
                width="12"
                height="12"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{
                  color: isHovered ? '#cccccc' : '#ffffff',
                  display: 'block',
                }}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12.311.75L23.03 11.47a.75.75 0 0 1 0 1.06L12.311 23.25M1.061.75L11.78 11.47a.75.75 0 0 1 0 1.06L1.061 23.25"
                />
              </svg>
            </button>
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              style={{ fill: '#9ca3af' }}
            >
              <path d="M14.5 13a.5.5 0 1 1 0 1h-13a.5.5 0 1 1 0-1zM14 4H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m0 1v5H2V5zm.5-4a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1z" />
            </svg>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'auto',
            }}
          >
            <button
              type="button"
              style={{
                background: 'none',
                border: '1px solid #262626',
                padding: '6px 12px',
                minWidth: 56,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Share clicked');
              }}
            >
              Share
            </button>
            <button
              type="button"
              aria-label="Favourite"
              title="Favourite"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavourited((prev) => !prev);
              }}
            >
              <svg
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{
                  fill: isFavourited ? '#ffffff' : 'none',
                  stroke: '#ffffff',
                  strokeWidth: '1.5',
                  transition: 'fill 0.2s ease, stroke 0.2s ease',
                }}
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          style={{
            marginTop: 60,
            padding: '0 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="New note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: title ? '#ffffff' : '#8f8f8f',
              outline: 'none',
              fontSize: '24px',
              fontWeight: 600,
              padding: 0,
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ fill: '#9ca3af' }}
            >
              <path d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z" />
            </svg>
            <span style={{ fontWeight: 600, color: '#d1d5db' }}>Date</span>
            <span>{formattedDate}</span>
          </div>
          <input
            type="text"
            placeholder="Subject"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              outline: 'none',
              fontSize: '18px',
              fontWeight: 500,
              padding: '8px 0 0',
            }}
          />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 15 16"
              style={{ fill: '#9ca3af' }}
            >
              <path d="M7.5 7a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5Zm0-4C6.67 3 6 3.67 6 4.5S6.67 6 7.5 6S9 5.33 9 4.5S8.33 3 7.5 3Z" />
              <path d="M13.5 11c-.28 0-.5-.22-.5-.5s.22-.5.5-.5s.5-.22.5-.5A2.5 2.5 0 0 0 11.5 7h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c.83 0 1.5-.67 1.5-1.5S11.33 3 10.5 3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5A2.5 2.5 0 0 1 13 4.5c0 .62-.22 1.18-.6 1.62c1.49.4 2.6 1.76 2.6 3.38c0 .83-.67 1.5-1.5 1.5Zm-12 0C.67 11 0 10.33 0 9.5c0-1.62 1.1-2.98 2.6-3.38c-.37-.44-.6-1-.6-1.62A2.5 2.5 0 0 1 4.5 2c.28 0 .5.22.5.5s-.22.5-.5.5C3.67 3 3 3.67 3 4.5S3.67 6 4.5 6c.28 0 .5.22.5.5s-.22.5-.5.5h-1A2.5 2.5 0 0 0 1 9.5c0 .28.22.5.5.5s.5.22.5.5s-.22.5-.5.5Zm9 3h-6c-.83 0-1.5-.67-1.5-1.5v-1C3 9.57 4.57 8 6.5 8h2c1.93 0 3.5 1.57 3.5 3.5v1c0 .83-.67 1.5-1.5 1.5Zm-4-5A2.5 2.5 0 0 0 4 11.5v1c0 .28.22.5.5.5h6c.28 0 .5-.22.5-.5v-1A2.5 2.5 0 0 0 8.5 9h-2Z" />
            </svg>
            <span style={{ fontWeight: 600, color: '#d1d5db' }}>Created by</span>
            <span>{createdBy}</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              color: '#9ca3af',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ fill: '#9ca3af' }}
            >
              <path d="m7.135 19.077l1-4H4.519l.25-1h3.616l1.038-4.154H5.808l.25-1h3.615l1-4h.962l-1 4h4.269l1-4h.961l-1 4h3.616l-.25 1h-3.616l-1.038 4.154h3.615l-.25 1h-3.615l-1 4h-.962l1-4H9.096l-1 4h-.961Zm2.211-5h4.27l1.038-4.154h-4.27l-1.038 4.154Z" />
            </svg>
            <span style={{ fontWeight: 600, color: '#d1d5db' }}>Tags</span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 8,
                minHeight: 28,
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '2px 10px',
                    borderRadius: 999,
                    backgroundColor: '#2a2a2a',
                    color: '#f3f4f6',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                      fontSize: 12,
                    }}
                    aria-label={`Remove ${tag}`}
                    title={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Add tags' : 'Add another'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#d1d5db',
                  outline: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: 0,
                  minWidth: 80,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginTop: 40,
              padding: '12px 0 32px',
              color: '#9ca3af',
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style={{ fill: '#9ca3af' }}
            >
              <g fill="#9ca3af" fillRule="evenodd" clipRule="evenodd">
                <path d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z" />
                <path d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z" />
              </g>
            </svg>
            <span>Press Enter to open the editor</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNotes;
