'use client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';
interface Props {
  id: string;
}
export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['note', id], queryFn: () => fetchNoteById(id) });
  const handleClose = () => {
    router.back();
  };
  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        {' '}
        <p>Loading, please wait...</p>{' '}
      </Modal>
    );
  }
  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        {' '}
        <p>Something went wrong.</p>{' '}
        <button type="button" onClick={handleClose}>
          {' '}
          Close{' '}
        </button>{' '}
      </Modal>
    );
  }
  return (
    <Modal onClose={handleClose}>
      {' '}
      <div className={css.container}>
        {' '}
        <button type="button" onClick={handleClose} className={css.closeButton} aria-label="Close">
          {' '}
          ×{' '}
        </button>{' '}
        <div className={css.item}>
          {' '}
          <div className={css.header}>
            {' '}
            <h2>{note.title}</h2>{' '}
          </div>{' '}
          <p className={css.tag}>{note.tag}</p> <p className={css.content}>{note.content}</p>{' '}
          <p className={css.date}>
            {' '}
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'No date'}{' '}
          </p>{' '}
        </div>{' '}
      </div>{' '}
    </Modal>
  );
}
