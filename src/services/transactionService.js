import axios from './axios';

export const getTransactions = () => axios.get('/transactions');
export const createTransaction = (data) => axios.post('/transactions', data);
export const deleteTransaction = (id) => axios.delete(`/transactions/${id}`);
