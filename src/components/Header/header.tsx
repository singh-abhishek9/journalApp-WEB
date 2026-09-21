import styles from './style';

function Header() {
  return (
    <header style={styles.header}>
      <h1 style={styles.brand}>JournalApp</h1>

      <nav style={styles.nav}>
        <a href="/" style={styles.link}>Home</a>
        <a href="/journal" style={styles.link}>Journal</a>
        <a href="/user" style={styles.link}>User</a>
        <a href="/admin" style={styles.link}>Admin</a>
        <a href="/public" style={styles.link}>Public</a>
        <a href="/" style={styles.cta}>Get Started</a>
      </nav>
    </header>
  );
}

export default Header;