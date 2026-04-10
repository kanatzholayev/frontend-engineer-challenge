import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { getApiErrorMessage } from '@/shared/api/http';
import { loginFormSchema, type LoginFormValues } from '@/shared/lib/validation/auth-schemas';
import { Button, Input } from '@/shared/ui';
import { useLoginMutation } from '@/features/auth';

import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onError: (err) => {
        setError('root', { message: getApiErrorMessage(err, 'Не удалось войти') });
      },
    });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Войти в систему</h1>

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
        disabled={loginMutation.isPending}
        {...register('email')}
      />

      <Input
        placeholder="Введите пароль"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={loginMutation.isPending}
        {...register('password')}
      />

      <Button type="submit" fullWidth disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Вход…' : 'Войти'}
      </Button>

      <Button
        variant="tertiary"
        type="button"
        onClick={() => navigate('/reset-password')}
      >
        Забыли пароль?
      </Button>
    </form>
  );
};
