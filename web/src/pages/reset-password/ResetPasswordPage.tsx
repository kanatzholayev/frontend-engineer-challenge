import { useSearchParams } from 'react-router-dom';

import { IMAGES } from '@/shared/assets';
import { NewPasswordForm, ResetPasswordForm } from '@/features/reset-password';

import styles from './ResetPasswordPage.module.scss';

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');

  return (
    <div className={styles.container}>
      <img src={IMAGES.logo} alt="logo" className={styles.logo} />

      {token
        ? <NewPasswordForm key={token} token={token} />
        : <ResetPasswordForm />}
    </div>
  );
};
