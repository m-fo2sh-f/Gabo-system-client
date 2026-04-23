import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";


const useJobTitles = () => {
    return useQuery({
        queryKey: ['job-titles'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/v1/jobtitles');
            return data;
        },
    });
};

export const useCreateJobTitle = () => {
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/v1/jobtitles', payload);
            return data;
        },

    });
};
export const useDeleteJobTitle = () => {
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/v1/jobtitles/${id}`);
            return data;
        },

    });
};

export default useJobTitles;