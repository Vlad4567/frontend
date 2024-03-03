import instance from './axiosInterceptors';

export const client = {
  async get<T>(url: string) {
    const response = await instance.get<T>(url);

    return response.data;
  },

  async post<T>(url: string, data?: unknown) {
    if (typeof data === 'undefined') {
      const response = await instance.post<T>(url);

      return response.data;
    }

    const response = await instance.post<T>(url, data);

    return response.data;
  },

  async patch<T>(url: string, data?: unknown) {
    if (typeof data === 'undefined') {
      const response = await instance.post<T>(url);

      return response.data;
    }

    const response = await instance.post<T>(url, data);

    return response.data;
  },

  async delete(url: string) {
    return instance.delete(url);
  },
};
