import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from 'react';
import { clsx } from 'clsx';

import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  startIcon?: ReactNode;
  /** Для `link`: не передавайте — покажется шеврон; передайте `null`, чтобы скрыть. */
  endIcon?: ReactNode | null;
};

const LinkChevron = () => (
  <svg
    aria-hidden
    fill="none"
    height={24}
    viewBox="0 0 24 24"
    width={24}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m10 7 5 5-5 5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    type = 'button',
    fullWidth,
    startIcon,
    endIcon,
    disabled,
    ...rest
  }, ref) => {
    const isLink = variant === 'link';
    const resolvedEndIcon = (() => {
      if (!isLink) {
        return endIcon;
      }
      if (endIcon === null) {
        return null;
      }
      if (endIcon !== undefined) {
        return endIcon;
      }
      return <LinkChevron />;
    })();

    const bodyClasses = [styles.body];
    if (isLink) {
      bodyClasses.push(styles.bodyLink);
    } else if (startIcon) {
      bodyClasses.push(styles.bodyWithIcon);
    }

    const nativeType: ButtonHTMLAttributes<HTMLButtonElement>['type'] = type === 'submit' ? 'submit' : 'button';

    const rootClassName = clsx(
      styles.button,
      styles[variant],
      fullWidth && styles.fullWidth,
      ...bodyClasses,
      className,
    );

    const inner = (
      <>
        {startIcon ? (
          <span aria-hidden className={styles.icon}>
            {startIcon}
          </span>
        ) : null}

        {children}

        {resolvedEndIcon ? (
          <span aria-hidden className={styles.icon}>
            {resolvedEndIcon}
          </span>
        ) : null}
      </>
    );

    return (
      <button
        ref={ref}
        className={rootClassName}
        disabled={disabled}
        // eslint-disable-next-line react/button-has-type
        type={nativeType}
        {...rest}
      >
        {inner}
      </button>
    );
  },
);

Button.displayName = 'Button';
