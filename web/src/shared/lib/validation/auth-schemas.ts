import { z } from 'zod';

/** Mirrors `domain.ValidatePassword` in Go (unicode-aware). */
export function isPasswordStrong(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  return (
    /\p{Lu}/u.test(password)
    && /\p{Ll}/u.test(password)
    && /\p{N}/u.test(password)
    && /[\p{P}\p{S}]/u.test(password)
  );
}

const passwordField = z
  .string()
  .min(1, 'Введите пароль')
  .refine(isPasswordStrong, {
    message:
      'Пароль не менее 8 символов, с заглавной и строчной буквой, цифрой и спецсимволом',
  });

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Введите e-mail').email('Некорректный e-mail'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z
  .object({
    email: z.string().min(1, 'Введите e-mail').email('Некорректный e-mail'),
    password: passwordField,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    displayName: z.string().min(1, 'Введите отображаемое имя'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, 'Введите e-mail').email('Некорректный e-mail'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export const newPasswordFormSchema = z
  .object({
    token: z.string().min(1, 'Отсутствует токен сброса'),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>;
