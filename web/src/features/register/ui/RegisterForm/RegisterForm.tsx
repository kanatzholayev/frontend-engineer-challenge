/* eslint-disable jsx-a11y/anchor-is-valid */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getApiErrorMessage } from '@/shared/api/http';
import {
  registerFormSchema,
  type RegisterFormValues,
} from '@/shared/lib/validation/auth-schemas';
import { Button, Input } from '@/shared/ui';
import { useRegisterMutation } from '@/features/auth';

import styles from './RegisterForm.module.scss';

type RegisterFormProps = {
  onRegistered?: () => void;
};

export const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      {
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      },
      {
        onSuccess: () => {
          onRegistered?.();
        },
        onError: (err) => {
          setError('root', { message: getApiErrorMessage(err, 'Не удалось зарегистрироваться') });
        },
      },
    );
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Регистрация в системе</h1>

      {errors.root?.message ? (
        <p className={styles.serverError} role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <Input
        placeholder="Введите e-mail"
        label="Email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={registerMutation.isPending}
        {...register('email')}
      />

      <Input
        placeholder="Введите отображаемое имя"
        label="Имя"
        autoComplete="name"
        error={errors.displayName?.message}
        disabled={registerMutation.isPending}
        {...register('displayName')}
      />

      <Input
        placeholder="Введите пароль"
        label="Пароль"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        disabled={registerMutation.isPending}
        {...register('password')}
      />

      <Input
        placeholder="Повторите пароль"
        label="Повторите пароль"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={registerMutation.isPending}
        {...register('confirmPassword')}
      />

      <Button type="submit" fullWidth disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Регистрация…' : 'Зарегистрироваться'}
      </Button>

      <span className={styles.agreement}>
        Зарегистрировавшись пользователь принимает условия
        {' '}

        <a
          href="#"
          target="_blank"
          className={styles.agreementLink}
          rel="noreferrer"
        >
          договора оферты
        </a>

        {' '}
        и

        {' '}

        <a
          href="#"
          target="_blank"
          className={styles.agreementLink}
          rel="noreferrer"
        >
          политики конфиденциальности
        </a>
      </span>
    </form>
  );
};
