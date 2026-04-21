import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

const QUERY_KEY = ['clients'];

export const useClients = (filters = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/clients', { params: filters });
      return data;
    },
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/clients/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newClient) => {
      const { data } = await axiosInstance.post('/clients', newClient);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await axiosInstance.put(`/clients/${id}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/clients/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
