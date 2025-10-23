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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
      // Simulate search
      setTimeout(() => {
        const results = performSearch(value);
        setSearchResults(results);
        setIsLoading(false);

        // Add to recent searches
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
    switch (type) {
      case 'chat':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{color: '#808080', flexShrink: 0}}>
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
            </g>
          </svg>
        );
      case 'note':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{color: '#808080', flexShrink: 0}}>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
              <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
              <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
            </g>
          </svg>
        );
      case 'reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" style={{color: '#808080', flexShrink: 0}}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
          </svg>
        );
      case 'setting':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{color: '#808080', flexShrink: 0}}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
          </svg>
        );
      case 'goal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{color: '#808080', flexShrink: 0}}>
            <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
            <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
            <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
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

      if (showSortDropdown && !target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }

      if (showCreatedByDropdown && !target.closest('.created-by-dropdown-container')) {
        setShowCreatedByDropdown(false);
      }

      if (showContentTypeDropdown && !target.closest('.content-type-dropdown-container')) {
        setShowContentTypeDropdown(false);
      }

      if (showDateRangeDropdown && !target.closest('.date-range-dropdown-container')) {
        setShowDateRangeDropdown(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when modal is open
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Modal */}
      <div 
        className="relative bg-[#202020] border border-[#262626] rounded-xl w-[900px] h-[650px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Icon and Input */}
        <div className="px-6 pt-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#808080] border-t-transparent rounded-full animate-spin"></div>
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
              className="bg-transparent border-none outline-none text-white text-lg font-medium placeholder-[#808080] flex-1"
              autoFocus
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-[#808080] hover:text-white transition-colors bg-transparent border-none p-1 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                <path fill="currentColor" fillRule="evenodd" d="M7.999 15.999a8 8 0 1 1 0-16a8 8 0 0 1 0 16M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M3.5 5h9a.5.5 0 1 1 0 1h-9a.5.5 0 0 1 0-1m2 3h5a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1m2 3h1a.5.5 0 1 1 0 1h-1a.5.5 0 1 1 0-1"/>
              </svg>
            </button>
          </div>
        </div>
          <div style={{ padding: '0 24px 16px 24px', borderTop: '1px solid #262626' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
              {/* Sort */}
              <div style={{ position: 'relative' }} className="sort-dropdown-container">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'backgroundColor 0.2s',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 21" style={{color: '#808080'}}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m10.5 12.5l4 4.107l4-4.107m-8-4l-4-4l-4 3.997m4-3.997v12m8-12v12"/>
                  </svg>
                  <span style={{color: '#808080'}}>Sort</span>
                  <svg width="12px" height="12px" style={{color: '#808080'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showSortDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#262626',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      <button
                        onClick={() => {
                          setSortBy('created-first');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: sortBy === 'created-first' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Created first
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('created-last');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: sortBy === 'created-last' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Created last
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('last-edited');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: sortBy === 'last-edited' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Last edited
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('first-edited');
                          setShowSortDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: sortBy === 'first-edited' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        First edited
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Title Only */}
              <div>
                <button
                  onClick={() => setTitleOnly(!titleOnly)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: titleOnly ? '#2a2a2a' : 'transparent',
                    borderRadius: '9999px',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256" style={{color: titleOnly ? 'white' : '#808080'}}>
                    <path fill="currentColor" d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144L80 74.79L112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68c13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25a8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36Zm0 88c-13.23 0-24-9-24-20s10.77-20 24-20s24 9 24 20s-10.77 20-24 20Z"/>
                  </svg>
                  <span style={{color: titleOnly ? 'white' : '#808080', fontSize: '14px'}}>Title only</span>
                </button>
              </div>

              {/* Created By */}
              <div style={{ position: 'relative' }} className="created-by-dropdown-container">
                <button
                  onClick={() => setShowCreatedByDropdown(!showCreatedByDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'backgroundColor 0.2s',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{color: '#808080'}}>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20.75a1 1 0 0 0 1-1v-1.246c.004-2.806-3.974-5.004-8-5.004s-8 2.198-8 5.004v1.246a1 1 0 0 0 1 1zM15.604 6.854a3.604 3.604 0 1 1-7.208 0a3.604 3.604 0 0 1 7.208 0"/>
                  </svg>
                  <span style={{color: '#808080', fontSize: '14px'}}>Created by</span>
                  <svg width="12px" height="12px" style={{color: '#808080'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showCreatedByDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#262626',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      <button
                        onClick={() => {
                          setCreatedBy('all');
                          setShowCreatedByDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: createdBy === 'all' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        All
                      </button>
                      <button
                        onClick={() => {
                          setCreatedBy('user');
                          setShowCreatedByDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: createdBy === 'user' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName || 'User'}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}>
                            {user?.initials || 'U'}
                          </div>
                        )}
                        <span>{user?.fullName || 'User'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCreatedBy('lumi');
                          setShowCreatedByDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: createdBy === 'lumi' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                          <g fill="none">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                            <path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/>
                          </g>
                        </svg>
                        <span>Lumi</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Type */}
              <div style={{ position: 'relative' }} className="content-type-dropdown-container">
                <button
                  onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'backgroundColor 0.2s',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{color: '#808080'}}>
                    <path fill="currentColor" d="M20 8.94a1.31 1.31 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09L13.06 2H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H14ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v5a1 1 0 0 0 1 1h5Z"/>
                  </svg>
                  <span style={{color: '#808080', fontSize: '14px'}}>In</span>
                  <svg width="12px" height="12px" style={{color: '#808080'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showContentTypeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#262626',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      <button
                        onClick={() => {
                          setContentType('all');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'all' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V5z"/>
                        </svg>
                        <span>All</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('chats');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'chats' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                          <g fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 12a8 8 0 1 1 16 0v5.09c0 .848 0 1.27-.126 1.609a2 2 0 0 1-1.175 1.175C18.36 20 17.937 20 17.09 20H12a8 8 0 0 1-8-8z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6m-3 4h3"/>
                          </g>
                        </svg>
                        <span>Chats</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('reminders');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'reminders' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" style={{flexShrink: 0}}>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M37.275 32.678V21.47A13.27 13.27 0 0 0 27.08 8.569v-.985a3.102 3.102 0 0 0-6.203 0v.996a13.27 13.27 0 0 0-10.152 12.89v11.208L6.52 36.883v1.942h34.96v-1.942Zm-17.948 6.147a4.65 4.65 0 0 0 9.301.048v-.048"/>
                        </svg>
                        <span>Reminders</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('notes');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'notes' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                            <path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/>
                            <path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/>
                          </g>
                        </svg>
                        <span>Notes</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('goals');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'goals' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                          <path fill="currentColor" d="M20.172 6.75h-1.861l-4.566 4.564a1.874 1.874 0 1 1-1.06-1.06l4.565-4.565V3.828a.94.94 0 0 1 .275-.664l1.73-1.73a.249.249 0 0 1 .25-.063c.089.026.155.1.173.191l.46 2.301l2.3.46c.09.018.164.084.19.173a.25.25 0 0 1-.062.249l-1.731 1.73a.937.937 0 0 1-.663.275Z"/>
                          <path fill="currentColor" d="M2.625 12A9.375 9.375 0 0 0 12 21.375A9.375 9.375 0 0 0 21.375 12c0-.898-.126-1.766-.361-2.587A.75.75 0 0 1 22.455 9c.274.954.42 1.96.42 3c0 6.006-4.869 10.875-10.875 10.875S1.125 18.006 1.125 12S5.994 1.125 12 1.125c1.015-.001 2.024.14 3 .419a.75.75 0 1 1-.413 1.442A9.39 9.39 0 0 0 12 2.625A9.375 9.375 0 0 0 2.625 12Z"/>
                          <path fill="currentColor" d="M7.125 12a4.874 4.874 0 1 0 9.717-.569a.748.748 0 0 1 1.047-.798c.251.112.42.351.442.625a6.373 6.373 0 0 1-10.836 5.253a6.376 6.376 0 0 1 5.236-10.844a.75.75 0 1 1-.17 1.49A4.876 4.876 0 0 0 7.125 12Z"/>
                        </svg>
                        <span>Goals</span>
                      </button>
                      <button
                        onClick={() => {
                          setContentType('settings');
                          setShowContentTypeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: contentType === 'settings' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{flexShrink: 0}}>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21.25 12H8.895m-4.361 0H2.75m18.5 6.607h-5.748m-4.361 0H2.75m18.5-13.214h-3.105m-4.361 0H2.75m13.214 2.18a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm-9.25 6.607a2.18 2.18 0 1 0 0-4.36a2.18 2.18 0 0 0 0 4.36Zm6.607 6.608a2.18 2.18 0 1 0 0-4.361a2.18 2.18 0 0 0 0 4.36Z"/>
                        </svg>
                        <span>Settings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div style={{ position: 'relative' }} className="date-range-dropdown-container">
                <button
                  onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'backgroundColor 0.2s',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15" style={{color: '#808080'}}>
                    <path fill="currentColor" fillRule="evenodd" d="M4.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 12.5v-9A1.5 1.5 0 0 1 2.5 2H4v-.5a.5.5 0 0 1 .5-.5ZM10 3v.5a.5.5 0 0 0 1 0V3h1.5a.5.5 0 0 1 .5.5V5H2V3.5a.5.5 0 0 1 .5-.5H4v.5a.5.5 0 0 0 1 0V3h5ZM2 6v6.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6H2Zm5 1.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM9.5 7a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm.5 1.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM9 9.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM7.5 9a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM5 9.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0ZM3.5 9a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1ZM3 11.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Zm1.5.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0Zm2.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1Z" clipRule="evenodd"/>
                  </svg>
                  <span style={{color: '#808080', fontSize: '14px'}}>Date</span>
                  <svg width="12px" height="12px" style={{color: '#808080'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDateRangeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#262626',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '160px'
                  }}>
                    <div style={{ padding: '4px' }}>
                      <button
                        onClick={() => {
                          setDateRange('all');
                          setShowDateRangeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: dateRange === 'all' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        All time
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('today');
                          setShowDateRangeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: dateRange === 'today' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('week');
                          setShowDateRangeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: dateRange === 'week' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        This week
                      </button>
                      <button
                        onClick={() => {
                          setDateRange('month');
                          setShowDateRangeDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'backgroundColor 0.2s',
                          color: dateRange === 'month' ? 'white' : '#808080',
                          backgroundColor: 'transparent',
                        }}
                      >
                        This month
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
          {searchQuery.trim() === '' ? (
            <>
              {recentSearches.length > 0 && (
                <>
                  <div style={{ color: '#808080', fontSize: '12px', marginBottom: '8px' }}>Recent searches</div>
                  <div style={{ marginBottom: '24px' }}>
                    {recentSearches.map((search, index) => (
                      <div key={index} style={{
                        padding: '8px 12px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'backgroundColor 0.2s',
                      }}>
                        {search}
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div style={{ color: '#808080', fontSize: '12px', marginBottom: '8px' }}>Quick access</div>
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #2a2a2a',
                  background: '#1f1f1f',
                  color: '#e5e5e5',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  {getCategoryIcon('chat')}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Recent item {i}</div>
                    <div style={{ color: '#9a9a9a', fontSize: '12px', marginTop: '4px' }}>Short preview text for item {i}...</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {searchResults.length > 0 ? (
                <>
                  <div style={{ color: '#808080', fontSize: '12px', marginBottom: '8px' }}>
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </div>
                  {searchResults.map((result) => (
                    <div key={result.id} style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #2a2a2a',
                      background: '#1f1f1f',
                      color: '#e5e5e5',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      {getCategoryIcon(result.type)}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{result.title}</div>
                        <div style={{ color: '#9a9a9a', fontSize: '12px', marginTop: '4px' }}>{result.content}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ color: '#808080', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};