import type { CSSProperties } from 'react';

const styles: Record<string, CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 32px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    color: '#f8fafc',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    width: '100%',
    boxSizing: 'border-box',
  },
  brand: {
    margin: 0,
    fontSize: '1.7rem',
    fontWeight: 700,
    letterSpacing: '-0.05em',
    color: '#f8fafc',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.96rem',
    fontWeight: 500,
    transition: 'color 0.2s ease',
  },
  cta: {
    background: '#f59e0b',
    color: '#111827',
    padding: '10px 18px',
    borderRadius: '999px',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
  },
};

export default styles;
