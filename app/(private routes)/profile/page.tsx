import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';

import css from './ProfilePage.module.css';

export const metadata = {
  title: 'Profile | NoteHub',
  description: 'User profile page',
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>

          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
