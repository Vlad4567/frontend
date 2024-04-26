import { useQuery, useQueryClient } from '@tanstack/react-query';

type HeaderType = 'dark' | 'light';

const queryKey = 'app';

interface AppState {
  headerShown: boolean;
  headerType: HeaderType;
  footerShown: boolean;
}

const initialState: AppState = {
  headerShown: true,
  headerType: 'dark',
  footerShown: true,
};

export const useApp = () => {
  const queryClient = useQueryClient();

  const { data: queryApp } = useQuery({
    queryKey: [queryKey],
    initialData: initialState,
  });

  const updateApp = (app: Partial<AppState>) => {
    queryClient.setQueryData<AppState>([queryKey], prev => ({
      ...queryApp,
      ...(prev || {}),
      ...app,
    }));
  };

  return {
    app: queryApp,
    updateApp,
  };
};
