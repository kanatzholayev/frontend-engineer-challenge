import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { getApiErrorMessage } from '@/shared/api/http';
import {
  newPasswordFormSchema,
  type NewPasswordFormValues,
} from '@/shared/lib/validation/auth-schemas';
import { Button, Input } from '@/shared/ui';
import { useResetPasswordMutation } from '@/features/auth';

import styles from './NewPasswordForm.module.scss';

type NewPasswordFormProps = {
  token: string;
};

export const NewPasswordForm = ({ token }: NewPasswordFormProps) => {
  const navigate = useNavigate();
  const resetMutation = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ token: t, newPassword }: NewPasswordFormValues) => {
    resetMutation.mutate(
      { token: t, newPassword },
      {
        onSuccess: () => {
          navigate('/login');
        },
        onError: (err) => {
          setError('root', { message: getApiErrorMessage(err, 'Не удалось сменить пароль') });
        },
      },
    );
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Задайте пароль</h1>

      {errors.root?.message ? (
        <p className={styles.serverError} role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <p className={styles.description}>
        Напишите новый пароль, который будете использовать для входа
      </p>

      <input type="hidden" {...register('token')} />

      <Input
        placeholder="Введите пароль"
        label="Пароль"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        disabled={resetMutation.isPending}
        {...register('newPassword')}
      />

      <Input
        placeholder="Повторите пароль"
        label="Повторите пароль"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        disabled={resetMutation.isPending}
        {...register('confirmPassword')}
      />

      <Button type="submit" fullWidth disabled={resetMutation.isPending}>
        {resetMutation.isPending ? 'Сохранение…' : 'Изменить пароль'}
      </Button>
    </form>
  );
};
