import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function Public() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [greeting, setGreeting] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('journalAppToken');

        if (!token) {
            navigate('/user');
            return;
        }

        async function loadUser() {
            try {
                const response = await fetch(`${API_BASE_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const responseBody = await response.text();
                if (!response.ok) {
                    throw new Error(responseBody || 'Unable to load your account.');
                }

                setGreeting(responseBody);
            } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Unable to connect to the server.');
            } finally {
                setIsLoading(false);
            }
        }

        void loadUser();
    }, [navigate]);

    async function updateUser(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const token = localStorage.getItem('journalAppToken');

        if (!token) {
            navigate('/user');
            return;
        }

        setIsSaving(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                throw new Error((await response.text()) || 'Unable to update your account.');
            }

            setMessage('Account updated successfully.');
            setPassword('');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to connect to the server.');
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteUser() {
        const token = localStorage.getItem('journalAppToken');
        if (!token || !window.confirm('Delete your account permanently?')) {
            return;
        }

        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/user`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error((await response.text()) || 'Unable to delete your account.');
            }

            localStorage.removeItem('journalAppToken');
            navigate('/user');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Unable to connect to the server.');
        }
    }

    if (isLoading) {
        return <main className="public-page"><p>Loading your JournalApp...</p></main>;
    }

    return (
        <main className="public-page">
            <section className="account-panel" aria-labelledby="account-title">
                <p className="user-eyebrow">JournalApp</p>
                <h1 id="account-title">Your journal account</h1>
                {greeting && <p className="account-greeting">{greeting}</p>}

                <form onSubmit={updateUser}>
                    <label htmlFor="account-userName">Username</label>
                    <input
                        id="account-userName"
                        type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="account-password">New password</label>
                    <input
                        id="account-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Update account'}
                    </button>
                </form>

                <button type="button" onClick={() => void deleteUser()}>
                    Delete account
                </button>

                {message && <p role="status">{message}</p>}
            </section>
        </main>
    );
}

export default Public;