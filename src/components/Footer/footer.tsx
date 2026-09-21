import type { CSSProperties } from 'react';
import styles from './style';

const typedStyles: Record<string, CSSProperties> = {
  footer: {
    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    color: '#f9fafb',
    padding: '18px 24px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: 'auto',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
    width: '100%',
    boxSizing: 'border-box',
  },
  text: {
    margin: 0,
    fontSize: '0.95rem',
    letterSpacing: '0.04em',
    fontWeight: 500,
    opacity: 0.9,
  },
};

function Footer() {
  return (
    <footer style={typedStyles.footer}>
      <p style={typedStyles.text}>© 2026 JournalApp</p>
    </footer>
  );
}

export default Footer;