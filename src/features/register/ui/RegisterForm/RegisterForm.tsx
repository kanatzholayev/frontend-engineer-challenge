/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Input } from '@/shared/ui';

import styles from './RegisterForm.module.scss';

export const RegisterForm = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Регистрация в системе</h1>

    <Input placeholder="Введите e-mail" label="Email" />

    <Input placeholder="Введите пароль" label="Пароль" type="password" />

    <Input placeholder="Повторите пароль" label="Повторите пароль" type="password" />

    <Button>Зарегистрироваться</Button>

    <span className={styles.agreement}>
      Зарегистрировавшись пользователь принимает условия
      {' '}

      <a href="#" target="_blank" className={styles.agreementLink}>договора оферты</a>

      {' '}
      и

      {' '}

      <a href="#" target="_blank" className={styles.agreementLink}>политики конфиденциальности</a>
    </span>
  </div>
);
