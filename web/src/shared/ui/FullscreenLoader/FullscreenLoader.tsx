import Logo from '@/shared/assets/images/logo.svg?react';

import styles from './FullscreenLoader.module.scss';

export const FullscreenLoader = () => (
  <div className={styles.container}>
    <Logo />
  </div>
);
