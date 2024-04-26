import { useMutation } from '@tanstack/react-query';
import { sendContactUs as apiSendContactUs } from '../api/main';
import { useNotification } from './useNotification';

export const useContactUs = () => {
  const { addNotification } = useNotification();

  const sendContactUs = useMutation({
    mutationFn: apiSendContactUs,
    onSuccess: () => addNotification('contactUs'),
    onError: () => addNotification('error'),
  });

  return {
    sendContactUs,
  };
};
