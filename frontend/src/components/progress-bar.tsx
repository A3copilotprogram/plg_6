import type { CSSProperties } from 'react';

export default function ProgressBar({ progress }: { progress: number }) {
  const containerStyles: CSSProperties = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
    marginTop: 10,
  };

  const fillerStyles: CSSProperties = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: 'var(--primary)',
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 0.2s ease-in-out',
  };

  const labelStyles: CSSProperties = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyles} className='mr-4'>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${progress}%`}</span>
      </div>
    </div>
  );
}