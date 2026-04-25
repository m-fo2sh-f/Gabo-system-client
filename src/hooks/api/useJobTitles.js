import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";


const QUERY_KEY = ['job-titles'];
const useJobTitles = () => {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await axiosInstance.get('/v1/jobtitles');
            return data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

export const useCreateJobTitle = () => {
    const queryClient = useQueryClient(); // عرفنا الـ Client

    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/v1/jobtitles', payload);
            return data;
        },
        // 💡 التريكة التانية: تحديث الـ Cache فوراً بعد الإضافة
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
    });
};
export const useDeleteJobTitle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/v1/jobtitles/${id}`);
            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        }
    });
};

export default useJobTitles;