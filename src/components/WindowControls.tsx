interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMaximized?: boolean;
}

export default function WindowControls({ onMinimize, onMaximize, onClose, isMaximized = false }: WindowControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Minimize Button */}
      <button 
        onClick={onMinimize}
        className="border-none outline-none transition-colors duration-200 flex items-center justify-center"
        style={{ 
          backgroundColor: 'transparent',
          height: '30px',
          width: '46px',
          padding: '0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4B5563';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Minimize"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path fill="white" d="m1.146 14.146l4-4a.5.5 0 0 1 .765.638l-.057.07l-4 4a.5.5 0 0 1-.765-.638zl4-4zM6.5 8A1.5 1.5 0 0 1 8 9.5v3a.5.5 0 1 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1 0-1zm2-5a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 1 1 0 1h-3A1.5 1.5 0 0 1 8 6.5v-3a.5.5 0 0 1 .5-.5m1.651 2.146l4-4a.5.5 0 0 1 .765.638l-.057.07l-4 4a.5.5 0 0 1-.765-.638zl4-4z"/>
        </svg>
      </button>
      
      {/* Maximize Button */}
      <button 
        onClick={onMaximize}
        className="border-none outline-none transition-colors duration-200 flex items-center justify-center"
        style={{ 
          backgroundColor: 'transparent',
          height: '30px',
          width: '46px',
          padding: '0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4B5563';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Maximize"
      >
        {isMaximized ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="white" d="M9.8 4H5.27c.193-.334.479-.606.824-.782C6.522 3 7.082 3 8.204 3h1.6c1.12 0 1.68 0 2.11.218c.376.192.682.498.874.874c.218.428.218.988.218 2.11v1.6c0 1.12 0 1.68-.218 2.11a2 2 0 0 1-.782.824v-4.53c0-.577 0-.949-.024-1.23c-.022-.272-.06-.372-.085-.422a1 1 0 0 0-.437-.437c-.05-.025-.15-.063-.422-.085a17 17 0 0 0-1.23-.024z"/>
            <path fill="white" fillRule="evenodd" d="M3 8.2c0-1.12 0-1.68.218-2.11c.192-.376.498-.682.874-.874c.428-.218.988-.218 2.11-.218h1.6c1.12 0 1.68 0 2.11.218c.376.192.682.498.874.874c.218.428.218.988.218 2.11v1.6c0 1.12 0 1.68-.218 2.11a2 2 0 0 1-.874.874c-.428.218-.988.218-2.11.218h-1.6c-1.12 0-1.68 0-2.11-.218a2 2 0 0 1-.874-.874C3 11.482 3 10.922 3 9.8zM6.2 6h1.6c.577 0 .949 0 1.23.024c.272.022.372.06.422.085c.188.096.341.249.437.437c.025.05.063.15.085.422c.023.283.024.656.024 1.23v1.6c0 .577 0 .949-.024 1.23c-.022.272-.06.372-.085.422a1 1 0 0 1-.437.437c-.05.025-.15.063-.422.085c-.283.023-.656.024-1.23.024H6.2c-.577 0-.949 0-1.23-.024c-.272-.022-.372-.06-.422-.085a1 1 0 0 1-.437-.437c-.025-.05-.063-.15-.085-.422a17 17 0 0 1-.024-1.23v-1.6c0-.577 0-.949.024-1.23c.022-.272.06-.372.085-.422c.096-.188.249-.341.437-.437c.05-.025.15-.063.422-.085C5.253 6 5.626 6 6.2 6" clipRule="evenodd"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 28 28">
            <path fill="white" d="M3 6.25A3.25 3.25 0 0 1 6.25 3h15.5A3.25 3.25 0 0 1 25 6.25v15.5A3.25 3.25 0 0 1 21.75 25H6.25A3.25 3.25 0 0 1 3 21.75V6.25ZM6.25 4.5A1.75 1.75 0 0 0 4.5 6.25v15.5c0 .966.784 1.75 1.75 1.75h15.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75H6.25Z"/>
          </svg>
        )}
      </button>
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="border-none outline-none transition-colors duration-200 flex items-center justify-center"
        style={{ 
          backgroundColor: 'transparent',
          height: '30px',
          width: '46px',
          padding: '0'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#DC2626';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path fill="white" d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12L5.293 6.707a1 1 0 0 1 0-1.414z"/>
        </svg>
      </button>
    </div>
  );
}
