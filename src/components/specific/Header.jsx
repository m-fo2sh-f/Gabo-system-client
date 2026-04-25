import React from 'react'
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { routeConfigs } from '../../constants/LayoutConstants';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    const isAddNewPage = pathname.startsWith('/add-new');

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    const getConfig = () => {
        return routeConfigs[pathname] || routeConfigs['/'];
    };

    const currentConfig = getConfig();

    return (
        <header className="hidden items-center justify-between mb-8 md:flex">
            <div>
                <h1 className="text-3xl font-bold text-on-surface">{t(currentConfig.title)}</h1>
                <p className="text-on-surface-variant mt-1">{t(currentConfig.subtitle)}</p>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors text-sm font-bold text-on-surface"
                >
                    {i18n.language === 'en' ? 'العربية' : 'English'}
                </button>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer">
                    {theme === 'light' ? <IoMdSunny className="text-on-surface" size={24} /> : <MdOutlineDarkMode className="text-on-surface" size={24} />}
                </button>
                <button className="primary-btn" onClick={() => isAddNewPage ? navigate('/') : navigate('/add-new')}>
                    {isAddNewPage ? t('common.back') : t('sidebar.add_new')}
                </button>
            </div>
        </header>
    )
}

export default Header