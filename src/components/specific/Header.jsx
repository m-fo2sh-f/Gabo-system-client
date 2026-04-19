import React from 'react'
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { routeConfigs } from '../../constants/LayoutConstants';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isAddNewPage = location.pathname.startsWith('/add-new');
    const getConfig = () => {
        // لو المسار فيه ID (زي /details/client/5)


        // المسارات العادية
        return routeConfigs[pathname] || routeConfigs['/'];

    };
    const currentConfig = getConfig();
    return (
        // <header className="hidden items-center justify-between mb-8 md:flex">
        //     <div>
        //         <h1 className="text-3xl font-bold text-on-surface">Dashboard Overview</h1>
        //         <p className="text-on-surface-variant mt-1">Here's what's happening with your system today.</p>
        //     </div>

        // </header>
        <header className="hidden items-center justify-between mb-8 md:flex">
            <div>
                <h1 className="text-3xl font-bold text-on-surface">{currentConfig.title}</h1>
                <p className="text-on-surface-variant mt-1">{currentConfig.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer">
                    {theme === 'light' ? <IoMdSunny className="text-on-surface" size={24} /> : <MdOutlineDarkMode className="text-on-surface" size={24} />}
                </button>
                <button className="primary-btn" onClick={() => isAddNewPage ? navigate('/') : navigate('/add-new')}>
                    {isAddNewPage ? 'Back to Dashboard' : 'Add New'}
                </button>

            </div>
        </header>
    )
}

export default Header