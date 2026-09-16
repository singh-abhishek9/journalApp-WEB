import { FormEvent, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function User() {
    const [isLogin, setIsLogin] = useState(true);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            const endpoint = isLogin ? '/public/login' : '/public/signup';
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, password }),
            });

            const responseBody = await response.text();
            if (!response.ok) {
                throw new Error(responseBody || 'The request failed.');
            }

            if (isLogin) {
                localStorage.setItem('journalAppToken', responseBody);
                setMessage('Login successful.');
            } else {
                setMessage('Account created. You can now log in.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to connect to the server.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="user-page">
            <section className="user-panel" aria-labelledby="user-page-title">
                <p className="user-eyebrow">JournalApp</p>
                <h2 id="user-page-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                <p className="user-description">
                    {isLogin ? 'Sign in to continue to your journal.' : 'Start keeping your thoughts in one place.'}
                </p>

                <div className="user-tabs" role="tablist" aria-label="Account actions">
                    <button type="button" className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
                        Log in
                    </button>
                    <button type="button" className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
                        Sign up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="userName">Username</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        required
                    />

                    <button className="submit-button" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
                    </button>
                </form>

                {message && <p className="user-message" role="status">{message}</p>}
            </section>
        </main>
    );
}

export default User;