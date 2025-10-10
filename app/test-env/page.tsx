'use client';

import React from 'react';

export default function TestEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const handleClick = () => {
    alert('Button click works!');
    console.log('Button clicked successfully');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Environment Check:</h2>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl || '❌ NOT SET'}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseKey ? `✅ SET (${supabaseKey.substring(0, 20)}...)` : '❌ NOT SET'}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Button Test:</h2>
        <button 
          onClick={handleClick}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Click Me to Test
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Check if environment variables show above</li>
          <li>Click the button to test if JavaScript works</li>
          <li>Open browser console (F12) to see any errors</li>
        </ol>
        
        <h3 style={{ marginTop: '20px' }}>If variables are NOT SET:</h3>
        <p>1. Make sure <code>.env.local</code> exists in project root</p>
        <p>2. Stop dev server (Ctrl+C)</p>
        <p>3. Restart: <code>npm run dev</code></p>
        <p>4. Refresh this page</p>
      </div>
    </div>
  );
}

