import { Button, Input } from '@/shared/ui';

import styles from './LoginForm.module.scss';

export const LoginForm = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Войти в систему</h1>

    <Input placeholder="Email" />

    <Input placeholder="Password" />

    <Button>Login</Button>
  </div>
);
