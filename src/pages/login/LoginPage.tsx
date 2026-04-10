import { IMAGES } from '@/shared/assets';
import { LoginForm } from '@/features/login';

import styles from './LoginPage.module.scss';

export const LoginPage = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <img src={IMAGES.logo} alt="logo" className={styles.logo} />

      <LoginForm />
    </div>
  </div>
);
