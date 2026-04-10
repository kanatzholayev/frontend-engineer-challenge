import { Button, Input } from '@/shared/ui';

import styles from './LoginForm.module.scss';

export const LoginForm = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Войти в систему</h1>

    <Input placeholder="Введите e-mail" label="Email" />

    <Input placeholder="Введите пароль" label="Пароль" type="password" />

    <Button>Войти</Button>

    <Button variant="tertiary">Забыли пароль?</Button>
  </div>
);
