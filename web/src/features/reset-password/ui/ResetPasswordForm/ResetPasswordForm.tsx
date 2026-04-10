import { IconChevronLeft } from '@/shared/assets/icons';
import { Button, Input } from '@/shared/ui';

import styles from './ResetPasswordForm.module.scss';

export const ResetPasswordForm = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <button type="button" className={styles.backButton}>
        <IconChevronLeft />
      </button>

      <h1 className={styles.title}>Восстановление пароля</h1>
    </div>

    <p className={styles.description}>
      Укажите адрес почты на который был зарегистрирован аккаунт
    </p>

    <Input placeholder="Введите e-mail" label="Email" />

    <Button variant="secondary">Восстановить пароль</Button>
  </div>
);
