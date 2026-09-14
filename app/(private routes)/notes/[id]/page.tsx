'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
  id: string;
  title: string;
  content?: string;
  [key: string]: unknown;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NoteDetailPage({ params }: PageProps) {
 
  const resolvedParams = use(params);
  const noteId = resolvedParams.id;

  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchNoteDetail() {
      try {
        const response = await fetch(`/api/notes/${noteId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Note not found');
          }
          throw new Error('Failed to fetch note details');
        }

        const data = await response.json();
        setNote(data);
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

    fetchNoteDetail();
  }, [noteId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      router.push('/notes');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete note');
      }
      setDeleting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading note...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
        <button onClick={() => router.push('/notes')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      {note && (
        <>
          <h1>{note.title}</h1>
          <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '6px', margin: '20px 0', border: '1px solid #eaeaea' }}>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{note.content || 'No content provided.'}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => router.push('/notes')}
              style={{ padding: '10px 15px', cursor: 'pointer' }}
            >
              Back to List
            </button>

            <button 
              onClick={handleDelete}
              disabled={deleting}
              style={{ padding: '10px 15px', cursor: 'pointer', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              {deleting ? 'Deleting...' : 'Delete Note'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}