import { useQuery } from "@tanstack/react-query"
import axiosInstance from '../../api/axios';



export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => axiosInstance.get("v1/dashboard").then(res => res.data),
        staleTime: 60 * 1000,

    })

}