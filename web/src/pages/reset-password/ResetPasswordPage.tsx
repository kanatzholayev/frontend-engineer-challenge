import { IMAGES } from '@/shared/assets';
import { ResetPasswordForm } from '@/features/reset-password';

import styles from './ResetPasswordPage.module.scss';

export const ResetPasswordPage = () => (
  <div className={styles.container}>
    <img src={IMAGES.logo} alt="logo" className={styles.logo} />

    <ResetPasswordForm />
  </div>
);
