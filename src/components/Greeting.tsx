import * as React from 'react';
import logoImage from '../logo/logo.png';

interface GreetingProps {
  line?: string;
}

export default function Greeting({ line = 'Your personal AI — ready when you are.' }: GreetingProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 8 }}>
        <img
          src={logoImage}
          alt="Lumi Logo"
          style={{ width: 80, height: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </div>
      <div style={{ color: '#ffffff', fontSize: 30, fontWeight: 500, letterSpacing: 0.2 }}>{line}</div>
    </div>
  );
}
