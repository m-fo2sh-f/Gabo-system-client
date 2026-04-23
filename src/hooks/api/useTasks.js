import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axios';

const QUERY_KEY = ['tasks'];

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/v1/tasks', { params: filters });
      return data;
    },
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/v1/tasks/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask) => {
      const { data } = await axiosInstance.post('/v1/tasks', newTask);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await axiosInstance.put(`/v1/tasks/${id}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, variables.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/v1/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
