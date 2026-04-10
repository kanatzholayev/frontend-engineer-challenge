import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useId,
  useState,
} from 'react';
import { clsx } from 'clsx';

import styles from './Input.module.scss';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    id: idProp,
    disabled,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    ...rest
  }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const errorId = `${id}-error`;
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState(
      () => (defaultValue !== undefined ? String(defaultValue) : ''),
    );
    const [isFocused, setIsFocused] = useState(false);

    const valueLength = isControlled ? String(value ?? '').length : innerValue.length;
    const showFloatingLabel = Boolean(label && (isFocused || valueLength > 0));

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInnerValue(event.target.value);
        }
        onChange?.(event);
      },
      [isControlled, onChange],
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(event);
      },
      [onBlur],
    );

    return (
      <div className={styles.wrapper}>
        <div
          className={clsx(
            styles.field,
            error && styles.error,
            showFloatingLabel && styles.floated,
          )}
        >
          {label && !showFloatingLabel ? (
            <label className={styles.visuallyHidden} htmlFor={id}>
              {label}
            </label>
          ) : null}

          {label && showFloatingLabel ? (
            <label className={styles.label} htmlFor={id}>
              {label}
            </label>
          ) : null}

          <div className={styles.fieldInner}>
            <input
              ref={ref}
              id={id}
              className={clsx(styles.input, className)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              disabled={disabled}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...(isControlled ? { value: value ?? '' } : {})}
              {...(!isControlled && defaultValue !== undefined ? { defaultValue } : {})}
              {...rest}
            />
          </div>
        </div>

        {error ? (
          <span className={styles.errorText} id={errorId} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
