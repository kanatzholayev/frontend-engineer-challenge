import { useMutation } from '@tanstack/react-query';

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from '@/shared/api/auth';
import { useAuthStore } from '@/shared/stores/auth-store';

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerUser });
}

export function useLoginMutation() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword });
}
