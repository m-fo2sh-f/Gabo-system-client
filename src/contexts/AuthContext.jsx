import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setIsLoading(false);
                return;
            } else {
                try {
                    const response = await axiosInstance.get('v1/user');
                    loginUser(response.data);
                } catch (error) {
                    setUser(null);
                    localStorage.removeItem('access_token');
                    setIsAuthenticated(false);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUser();
        const handleLogout = () => logoutUser();
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const loginUser = (userData) => {
        setUser(userData.user);
        localStorage.setItem('access_token', userData.access_token);
        setIsAuthenticated(true);

    };

    const logoutUser = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {

        } finally {
            setUser(null);
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
        }
    };


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, loginUser, logoutUser }}>
            {!isLoading ? children : <div className="loading-screen">Checking Auth...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);