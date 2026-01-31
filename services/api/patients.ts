import { api } from './client';

export const getPatients = async () => {
  const res = await api.get('/patients');
  return res.data;
};
