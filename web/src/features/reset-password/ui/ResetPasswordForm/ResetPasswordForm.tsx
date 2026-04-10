import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { getApiErrorMessage } from '@/shared/api/http';
import { IconChevronLeft } from '@/shared/assets/icons';
import {
  forgotPasswordFormSchema,
  type ForgotPasswordFormValues,
} from '@/shared/lib/validation/auth-schemas';
import { Button, Input } from '@/shared/ui';
import { useForgotPasswordMutation } from '@/features/auth';

import styles from './ResetPasswordForm.module.scss';

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const forgotMutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotMutation.mutate(values, {
      onError: (err) => {
        setError('root', { message: getApiErrorMessage(err, 'Не удалось отправить запрос') });
      },
    });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/login')}
          aria-label="Назад к входу"
        >
          <IconChevronLeft />
        </button>

        <h1 className={styles.title}>Восстановление пароля</h1>
      </div>

      {forgotMutation.isSuccess ? (
        <p className={styles.success} role="status">
          Если указанный адрес зарегистрирован, мы отправили инструкцию. Проверьте лог сервера в режиме разработки.
        </p>
      ) : null}

      {errors.root?.message ? (
        <p className={styles.serverError} role="alert">
          {errors.root.message}
        </p>
      ) : null}

      <p className={styles.description}>
        Укажите адрес почты на который был зарегистрирован аккаунт
      </p>

      <Input
        placeholder="Введите e-mail"
        label="Email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={forgotMutation.isPending || forgotMutation.isSuccess}
        {...register('email')}
      />

      <Button
        variant="secondary"
        type="submit"
        fullWidth
        disabled={forgotMutation.isPending || forgotMutation.isSuccess}
      >
        {forgotMutation.isPending ? 'Отправка…' : 'Восстановить пароль'}
      </Button>
    </form>
  );
};
