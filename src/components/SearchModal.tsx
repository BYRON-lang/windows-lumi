import React, { useEffect, useState } from 'react';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  user?: {
    fullName?: string;
    avatar?: string;
    initials?: string;
  };
}

export function SearchModal({ open, onClose, user }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCreatedByDropdown, setShowCreatedByDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('created-last');
  const [titleOnly, setTitleOnly] = useState(false);
  const [createdBy, setCreatedBy] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock data for search results
  const mockData = {
    chats: [
      { id: 1, title: "How to implement React hooks", content: "I need help with useState and useEffect...", date: "2024-01-15", type: "chat" },
      { id: 2, title: "Database optimization tips", content: "What are the best practices for...", date: "2024-01-14", type: "chat" },
      { id: 3, title: "API integration discussion", content: "Let's talk about RESTful APIs...", date: "2024-01-13", type: "chat" }
    ],
    notes: [
      { id: 1, title: "Meeting Notes - Project Planning", content: "Discussed Q1 goals and deliverables...", date: "2024-01-15", type: "note" },
      { id: 2, title: "Ideas for new features", content: "User feedback suggests we need...", date: "2024-01-14", type: "note" },
      { id: 3, title: "Code review checklist", content: "Before submitting PR, check...", date: "2024-01-13", type: "note" }
    ],
    reminders: [
      { id: 1, title: "Team standup meeting", content: "Daily standup at 9 AM", date: "2024-01-15", type: "reminder" },
      { id: 2, title: "Submit project report", content: "Due by end of week", date: "2024-01-14", type: "reminder" },
      { id: 3, title: "Review code changes", content: "Check pending PRs", date: "2024-01-13", type: "reminder" }
    ],
    settings: [
      { id: 1, title: "Profile Settings", content: "Update your personal information", date: "2024-01-15", type: "setting" },
      { id: 2, title: "Notification Preferences", content: "Configure how you receive notifications", date: "2024-01-14", type: "setting" },
      { id: 3, title: "Privacy & Security", content: "Manage your privacy settings", date: "2024-01-13", type: "setting" }
    ],
    goals: [
      { id: 1, title: "Learn React Hooks", content: "Master useState, useEffect, and custom hooks", date: "2024-01-15", type: "goal" },
      { id: 2, title: "Complete Project", content: "Finish the Lumi AI application by end of month", date: "2024-01-14", type: "goal" },
      { id: 3, title: "Improve Performance", content: "Optimize app loading times and responsiveness", date: "2024-01-13", type: "goal" }
    ]
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        const results = performSearch(value);
        setSearchResults(results);
        setIsLoading(false);
        
        if (!recentSearches.includes(value)) {
          setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
        }
      }, 500);
    } else {
      setIsLoading(false);
      setSearchResults([]);
    }
  };

  const performSearch = (query: string) => {
    const allData = [
      ...mockData.chats,
      ...mockData.notes,
      ...mockData.reminders,
      ...mockData.settings,
      ...mockData.goals
    ];
    
    return allData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getCategoryIcon = (type: string) => {
    const iconStyle = { 
      width: '20px', 
      height: '20px', 
      color: '#808080', 
      flexShrink: 0 
    };
    
    switch (type) {
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
            </g>
          </svg>
        );
      case 'note':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
            </g>
          </svg>
        );
      case 'reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} viewBox="0 0 48 48">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
          </svg>
        );
      case 'setting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
          </svg>
        );
      case 'goal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" style={iconStyle} viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
            <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Close dropdowns if clicked outside - we'll use a more specific approach
      if (showSortDropdown || showCreatedByDropdown || showContentTypeDropdown || showDateRangeDropdown) {
        // Check if clicked on any dropdown or button
        const isDropdownClick = target.closest('button') || target.closest('div[style*="position: absolute"]');
        if (!isDropdownClick) {
          setShowSortDropdown(false);
          setShowCreatedByDropdown(false);
          setShowContentTypeDropdown(false);
          setShowDateRangeDropdown(false);
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose, showSortDropdown, showCreatedByDropdown, showContentTypeDropdown, showDateRangeDropdown]);
  
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        style={{
          position: 'relative',
          backgroundColor: '#1f1f1f',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          width: '900px',
          height: '650px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ padding: '24px 24px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              {isLoading ? (
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #808080',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"/>
                </svg>
              )}
            </div>
            <input
              type="text"
              placeholder="Search everything in your space"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '18px',
                fontWeight: 500,
                flex: 1,
                fontFamily: 'inherit'
              }}
              autoFocus
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                color: '#808080',
                transition: 'color 0.2s',
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'white'}
              onMouseOut={(e) => e.currentTarget.style.color = '#808080'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" fillRule="evenodd" d="M7.999 15.999a8 8 0 1 1 0-16a8 8 0 0 1 0 16M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M3.5 5h9a.5.5 0 1 1 0 1h-9a.5.5 0 0 1 0-1m2 3h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1m2 3h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #2a2a2a',
            backgroundColor: '#161616'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '14px',
              flexWrap: 'wrap'
            }}>
              {/* Sort Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21" style={{ color: '#808080' }}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m10.5 12.5l4 4.107l4-4.107m-8-4l-4-4l-4 3.997m4-3.997v12m8-12v12"/>
                  </svg>
                  <span style={{ color: '#808080' }}>Sort</span>
                  <svg style={{ width: '12px', height: '12px', color: '#808080' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {showSortDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      {['created-first', 'created-last', 'last-edited', 'first-edited'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            fontSize: '14px',
                            transition: 'background-color 0.2s',
                            color: sortBy === option ? 'white' : '#808080',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Title Only Toggle */}
              <button 
                onClick={() => setTitleOnly(!titleOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                  backgroundColor: titleOnly ? '#2a2a2a' : 'transparent',
                  border: 'none'
                }}
                onMouseOver={(e) => !titleOnly && (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseOut={(e) => !titleOnly && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" style={{ color: titleOnly ? 'white' : '#808080' }}>
                  <path fill="currentColor" d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144L80 74.79L112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68c13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25a8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36Zm0 88c-13.23 0-24-9-24-20s10.77-20 24-20s24 9 24 20s-10.77 20-24 20Z"/>
                </svg>
                <span style={{ fontSize: '14px', color: titleOnly ? 'white' : '#808080' }}>Title only</span>
              </button>

              <span style={{ color: '#404040' }}>•</span>

              {/* Content Type Filter */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    border: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ color: '#808080' }}>In: {contentType}</span>
                  <svg style={{ width: '12px', height: '12px', color: '#808080' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                
                {showContentTypeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '140px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      {['all', 'chats', 'notes', 'reminders', 'goals', 'settings'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setContentType(type);
                            setShowContentTypeDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 12px',
                            fontSize: '14px',
                            transition: 'background-color 0.2s',
                            textTransform: 'capitalize',
                            color: contentType === type ? 'white' : '#808080',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div 
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto'
          }}
          className="custom-scrollbar"
        >
          {searchQuery.trim() ? (
            // Search Results
            <div style={{ paddingTop: '16px' }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 0'
                }}>
                  <div style={{ color: '#808080', fontSize: '14px' }}>Searching...</div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div style={{
                    color: '#808080',
                    fontSize: '14px',
                    paddingBottom: '8px'
                  }}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: '#262626',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#262626'}
                    >
                      <div style={{ marginTop: '4px' }}>
                        {getCategoryIcon(result.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '14px',
                          marginBottom: '4px'
                        }}>
                          {result.title}
                        </div>
                        <div style={{
                          color: '#808080',
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {result.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#2a2a2a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#808080' }}>
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <div style={{
                    color: '#808080',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    No results found for "{searchQuery}"
                  </div>
                  <div style={{
                    color: '#666',
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '4px'
                  }}>
                    Try different keywords or check your spelling
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div style={{ paddingTop: '16px' }}>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ color: 'white', fontSize: '14px', fontWeight: 500, margin: 0 }}>Recent Searches</h3>
                    <button
                      onClick={clearRecentSearches}
                      style={{
                        color: '#808080',
                        fontSize: '12px',
                        transition: 'color 0.2s',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#808080'}
                    >
                      Clear all
                    </button>
                  </div>
                  <div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(search)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px',
                          backgroundColor: '#262626',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          transition: 'background-color 0.2s',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#262626'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#808080' }}>
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                          </svg>
                          <span style={{ color: '#e5e5e5', fontSize: '14px' }}>{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Access */}
              <div>
                <h3 style={{ color: 'white', fontSize: '14px', fontWeight: 500, marginBottom: '12px', marginTop: 0 }}>Quick Access</h3>
                <div>
                  {[
                    { icon: 'chat', title: 'Chat History', desc: 'Browse recent conversations' },
                    { icon: 'note', title: 'Notes', desc: 'Access your saved notes' },
                    { icon: 'goal', title: 'Goals', desc: 'Review your objectives' },
                    { icon: 'reminder', title: 'Reminders', desc: 'Check upcoming tasks' },
                    { icon: 'setting', title: 'Settings', desc: 'Configure preferences' }
                  ].map((item, index) => (
                    <button 
                      key={index} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#262626',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        transition: 'background-color 0.2s',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#262626'}
                    >
                      {getCategoryIcon(item.icon)}
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                        <div style={{ color: '#808080', fontSize: '12px' }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 4px;
            transition: background 0.2s ease;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555555;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: #666666;
          }

          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #404040 transparent;
          }
        `}
      </style>
    </div>
  );
}

export default SearchModal;