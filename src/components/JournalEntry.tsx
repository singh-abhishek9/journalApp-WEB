import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type JournalEntryRecord = {
	id?: string;
	title: string;
	content: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function JournalEntry() {
	const navigate = useNavigate();
	const [entries, setEntries] = useState<JournalEntryRecord[]>([]);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	function getToken() {
		const token = localStorage.getItem('journalAppToken');
		if (!token) {
			navigate('/user');
			return null;
		}
		return token;
	}

	async function request(path: string, options: RequestInit = {}) {
		const token = getToken();
		if (!token) {
			return null;
		}

		const response = await fetch(`${API_BASE_URL}${path}`, {
			...options,
			headers: {
				Authorization: `Bearer ${token}`,
				...(options.body ? { 'Content-Type': 'application/json' } : {}),
				...options.headers,
			},
		});

		if (!response.ok) {
			throw new Error((await response.text()) || 'The request failed.');
		}

		return response;
	}

	async function loadEntries() {
		try {
			const response = await request('/journal');
			if (!response) {
				return;
			}

			if (response.status === 404) {
				setEntries([]);
				return;
			}

			setEntries((await response.json()) as JournalEntryRecord[]);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Unable to load journal entries.');
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		void loadEntries();
	}, []);

	async function saveEntry(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSaving(true);
		setMessage('');

		try {
			const path = selectedId ? `/journal/${selectedId}` : '/journal';
			const response = await request(path, {
				method: selectedId ? 'PUT' : 'POST',
				body: JSON.stringify({ title, content }),
			});

			if (response) {
				const savedEntry = (await response.json()) as JournalEntryRecord;
				setEntries((currentEntries) => selectedId
					? currentEntries.map((entry) => entry.id === selectedId ? savedEntry : entry)
					: [savedEntry, ...currentEntries]);
			}

			clearForm();
			setMessage(selectedId ? 'Entry updated.' : 'Entry created.');
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Unable to save the entry.');
		} finally {
			setIsSaving(false);
		}
	}

	async function viewEntry(id: string) {
		try {
			const response = await request(`/journal/id/${id}`);
			if (response) {
				const entry = (await response.json()) as JournalEntryRecord;
				setTitle(entry.title);
				setContent(entry.content);
				setSelectedId(entry.id ?? id);
				setMessage('Entry loaded for editing.');
			}
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Unable to load the entry.');
		}
	}

	async function deleteEntry(id: string) {
		if (!window.confirm('Delete this journal entry?')) {
			return;
		}

		try {
			await request(`/journal/id/${id}`, { method: 'DELETE' });
			setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== id));
			if (selectedId === id) {
				clearForm();
			}
			setMessage('Entry deleted.');
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Unable to delete the entry.');
		}
	}

	function clearForm() {
		setTitle('');
		setContent('');
		setSelectedId(null);
	}

	return (
		<main className="journal-page">
			<section aria-labelledby="journal-title">
				<p className="user-eyebrow">JournalApp</p>
				<h1 id="journal-title">My journal</h1>
				<p>Capture a thought, keep it close.</p>
			</section>

			<section aria-labelledby="entry-form-title">
				<h2 id="entry-form-title">{selectedId ? 'Edit entry' : 'New entry'}</h2>
				<form onSubmit={saveEntry}>
					<label htmlFor="entry-title">Title</label>
					<input id="entry-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
					<label htmlFor="entry-content">Content</label>
					<textarea id="entry-content" value={content} onChange={(event) => setContent(event.target.value)} rows={6} required />
					<button type="submit" disabled={isSaving}>
						{isSaving ? 'Saving...' : selectedId ? 'Update entry' : 'Save entry'}
					</button>
					{selectedId && <button type="button" onClick={clearForm}>Cancel edit</button>}
				</form>
			</section>

			<section aria-labelledby="entries-title">
				<h2 id="entries-title">Your entries</h2>
				{isLoading && <p>Loading entries...</p>}
				{!isLoading && entries.length === 0 && <p>No journal entries yet.</p>}
				{entries.map((entry) => entry.id && (
					<article key={entry.id}>
						<h3>{entry.title}</h3>
						<p>{entry.content}</p>
						<button type="button" onClick={() => void viewEntry(entry.id as string)}>View or edit</button>
						<button type="button" onClick={() => void deleteEntry(entry.id as string)}>Delete</button>
					</article>
				))}
			</section>

			{message && <p role="status">{message}</p>}
		</main>
	);
}

export default JournalEntry;
