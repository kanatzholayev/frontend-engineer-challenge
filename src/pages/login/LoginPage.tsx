import { useState } from 'react';

import { IMAGES } from '@/shared/assets';
import { Button } from '@/shared/ui';
import { LoginForm } from '@/features/login';
import { RegisterForm } from '@/features/register';

import styles from './LoginPage.module.scss';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={IMAGES.logo} alt="logo" className={styles.logo} />

        {isLogin

          ? (
            <>
              <LoginForm />

              <div className={styles.footer}>
                Еще не зарегистрированы?

                <Button variant="tertiary" className={styles.registerButton} onClick={() => setIsLogin(false)}>Регистрация</Button>
              </div>
            </>
          ) : (
            <>
              <RegisterForm />

              <div className={styles.footer}>
                Уже зарегистрированы?

                <Button variant="tertiary" className={styles.registerButton} onClick={() => setIsLogin(true)}>Войти</Button>
              </div>
            </>
          )}

      </div>

      <div className={styles.imageContainer}>
        <img src={IMAGES.authImage} alt="auth" className={styles.image} />
      </div>
    </div>
  );
};
