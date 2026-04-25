import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const useLogin = () => {
    const navigate = useNavigate();
    const { loginUser} = useAuth()
    return useMutation({
        mutationFn: async (credentials) => {
            const { data } = await axiosInstance.post('/login', credentials)
            return data
        },
        onSuccess: (data) => {
            loginUser(data);
            navigate('/', { replace: true });
        },
        onError: () => {
            // Error is handled by the mutation's error state
        }
    });
}