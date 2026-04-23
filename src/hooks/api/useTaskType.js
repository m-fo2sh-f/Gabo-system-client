import axiosInstance from "../../api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateTaskType = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/v1/tasktypes', data);
            return response.data;
        }
    })
}
export const useTaskTypes = () => {
    return useQuery({
        queryKey: ['task-types'],
        queryFn: async () => {
            const response = await axiosInstance.get(`/v1/tasktypes`);
            return response.data;
        }
    })
}
export const useDeleteTaskType = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.delete(`/v1/tasktypes/${id}`);
            return response.data;
        }
    })
}