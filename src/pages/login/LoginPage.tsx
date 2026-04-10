import { IMAGES } from '@/shared/assets';
import { Button } from '@/shared/ui';
import { LoginForm } from '@/features/login';

import styles from './LoginPage.module.scss';

export const LoginPage = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <img src={IMAGES.logo} alt="logo" className={styles.logo} />

      <LoginForm />

      <div className={styles.footer}>
        Еще не зарегистрированы?
        {' '}

        <Button variant="tertiary" className={styles.registerButton}>Регистрация</Button>
      </div>
    </div>

    <div className={styles.imageContainer}>
      <img src={IMAGES.authImage} alt="auth" className={styles.image} />
    </div>
  </div>
);
