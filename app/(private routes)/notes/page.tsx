'use client';

import { useEffect, useState, useDeferredValue } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content?: string;
  [key: string]: unknown;
}

export default function FilterNotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  

  const initialQuery = searchParams.get('query') || '';

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const deferredQuery = useDeferredValue(searchQuery);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch('/api/notes');
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/sign-in');
            return;
          }
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        setNotes(Array.isArray(data) ? data : data.notes || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [router]);

  const filteredNotes = notes.filter((note) => {
    const query = deferredQuery.toLowerCase();
    const titleMatch = note.title.toLowerCase().includes(query);
    const contentMatch = note.content?.toLowerCase().includes(query) || false;
    return titleMatch || contentMatch;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading notes...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Filter Notes</h1>
        <button 
          onClick={() => router.push('/notes')}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          Back to All Notes
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filteredNotes.length === 0 ? (
        <p>No notes matching your search criteria.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredNotes.map((note) => (
            <li key={note.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px', border: '1px solid #eaeaea' }}>
              <Link href={`/notes/${note.id}`} style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>
                {note.title}
              </Link>
              {note.content && <p style={{ margin: '8px 0 0', color: '#555' }}>{note.content.substring(0, 100)}...</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}