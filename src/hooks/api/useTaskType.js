import axiosInstance from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // 1. ضفنا useQueryClient

const QUERY_KEY = ['task-types']; // 2. وحدنا الـ Key

export const useTaskTypes = () => {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const response = await axiosInstance.get(`/v1/tasktypes`);
            return response.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

export const useCreateTaskType = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/v1/tasktypes', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
    });
};

export const useDeleteTaskType = () => {
    const queryClient = useQueryClient(); // عرفنا الكلاينت

    return useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/v1/tasktypes/${id}`);
            return response.data;
        },
      
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
    });
};