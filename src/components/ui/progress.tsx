import React from 'react';
export const Progress = ({ value, className }: any) => (
  <div className={className} style={{ background: '#eee', borderRadius: 4, height: 8, width: '100%' }}>
    <div style={{ width: `${value}%`, background: '#888', height: '100%', borderRadius: 4 }} />
  </div>
);
export default Progress; 