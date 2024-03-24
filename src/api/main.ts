import { ContactUs } from '../types/main';
import { client } from '../utils/axiosClient';

export const sendContactUs = (data: ContactUs) => {
  return client.post('/contactUs', data);
};
