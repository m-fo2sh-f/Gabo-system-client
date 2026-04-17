import axios from './axios';

export const getClients = () => axios.get('/clients');
export const getClient = (id) => axios.get(`/clients/${id}`);
export const createClient = (data) => axios.post('/clients', data);
export const updateClient = (id, data) => axios.put(`/clients/${id}`, data);
export const deleteClient = (id) => axios.delete(`/clients/${id}`);
