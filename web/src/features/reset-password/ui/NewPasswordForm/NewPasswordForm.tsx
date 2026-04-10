import { Button, Input } from '@/shared/ui';

import styles from './NewPasswordForm.module.scss';

export const NewPasswordForm = () => (
  <div className={styles.container}>

    <h1 className={styles.title}>Задайте пароль</h1>

    <p className={styles.description}>
      Напишите новый пароль, который будете использовать для входа
    </p>

    <Input placeholder="Введите пароль" label="Пароль" type="password" />

    <Input placeholder="Повторите пароль" label="Повторите пароль" type="password" />

    <Button>Изменить пароль</Button>
  </div>
);
