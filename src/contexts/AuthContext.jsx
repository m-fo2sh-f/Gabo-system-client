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


    const LoadingScreen = () => (
        <div className="loading-screen">
            {/* Animated logo */}
            <div className="ls-logo-wrap">
                <div className="ls-orbit-dot" />
                <div className="ls-orbit-dot" />
                <div className="ls-orbit-dot" />
                <div className="ls-logo-inner">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ fill: 'none', stroke: 'var(--on-primary)' }}
                        />
                    </svg>
                </div>
            </div>

            {/* Text */}
            <div className="ls-text-group">
                <span className="ls-title"> AGORA </span>
                <span className="ls-subtitle">Verifying your Identity</span>
            </div>

            {/* Bouncing dots */}
            <div className="ls-dots">
                <span />
                <span />
                <span />
            </div>

            {/* Progress bar */}
            <div className="ls-progress-track">
                <div className="ls-progress-fill" />
            </div>
        </div>
    );

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, loginUser, logoutUser }}>
            {!isLoading ? children : <LoadingScreen />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);