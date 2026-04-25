import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

const QUERY_KEY = ['transactions'];

export const useTransactions = (filters = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/v1/transactions', { params: filters });
      return data;
    },
  });
};

export const useTransaction = (id, params = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/transactions/${id}`, { params });
      return data;
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTransaction) => {
      const { data } = await axiosInstance.post('/v1/transactions', newTransaction);
      return data;

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // <--- اللغم الأول اتفك
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // <--- ربط الداشبورد
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });

      // السطر ده خاص بالـ Update بس عشان يحدث الـ Cache بتاع المعاملة نفسها

    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await axiosInstance.put(`/v1/transactions/${id}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // <--- اللغم الأول اتفك
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // <--- ربط الداشبورد
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });

      // السطر ده خاص بالـ Update بس عشان يحدث الـ Cache بتاع المعاملة نفسها
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
      }
    },

  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/v1/transactions/${id}`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // <--- اللغم الأول اتفك
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // <--- ربط الداشبورد
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });

      // السطر ده خاص بالـ Update بس عشان يحدث الـ Cache بتاع المعاملة نفسها

    },
  });
};
