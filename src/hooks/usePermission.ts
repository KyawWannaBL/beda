import { useAuth } from '@/hooks/useAuth';

export const usePermission = (permission: string) => {
  const { userData } = useAuth();
  return !!userData?.permissions?.[permission];
};
