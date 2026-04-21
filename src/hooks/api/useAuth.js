import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (credentials) => {
            const { data } = await axiosInstance.post('/login', credentials)
            return data
        },
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/';

        },
        onError: (error) => {
            console.log(error);
        }
    });
}