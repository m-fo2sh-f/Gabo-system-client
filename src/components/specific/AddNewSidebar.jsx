import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { addNewItems } from '../../constants/LayoutConstants';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { useTheme } from '../../contexts/ThemeContext';
import { IoMdSunny } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RiTranslate2 } from "react-icons/ri";

const AddNewSidebar = ({ lang }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isAddNewPage = location.pathname.startsWith('/add-new');
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <>
            {/* mobile navbar */}
            <nav className='md:hidden bg-surface-container-low border-b border-outline-variant/10'>
                <div className='w-full flex justify-between items-center px-5 py-4'>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-1 rounded-md hover:bg-primary/5 transition-colors cursor-pointer"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <MdClose className='text-on-primary-fixed-variant' size={30} />
                        ) : (
                            <GiHamburgerMenu className='text-on-primary-fixed-variant' size={30} />
                        )}
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                        Agora
                    </h1>
                    <button
                        onClick={() => isAddNewPage ? navigate('/') : navigate('/add-new')}
                        className='primary-btn'>{isAddNewPage ? 'Back' : 'Add New'}</button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="flex flex-col px-4 pb-4 pt-2 space-y-2 animate-in fade-in duration-200">
                        {addNewItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                        : 'text-on-surface-variant hover:bg-primary/5 hover:text-on-surface'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`transition-colors flex items-center justify-center w-6 h-6 ${isActive ? 'text-primary' : 'group-hover:text-primary text-on-surface-variant'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-label">{t(item.label)}</span>
                                    </>
                                )}
                            </NavLink>

                        ))}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-on-surface-variant hover:bg-primary/5 cursor-pointer">
                            {theme === 'light' ?
                                <>
                                    <span className="transition-colors flex items-center justify-center w-6 h-6 text-on-surface group-hover:text-primary  ">
                                        <IoMdSunny size={24} />
                                    </span>

                                    <p>{t('common.light')}</p>
                                </>
                                :
                                <>
                                    <span className="transition-colors flex items-center justify-center w-6 h-6 text-on-surface group-hover:text-primary  ">
                                        <MdOutlineDarkMode size={24} />
                                    </span>
                                    <p>{t('common.dark')}</p>
                                </>
                            }
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-on-surface-variant hover:bg-primary/5 cursor-pointer">
                            {lang === 'ar' ?
                                <>
                                    <span className="transition-colors flex items-center justify-center w-6 h-6 text-on-surface group-hover:text-primary  ">
                                        <RiTranslate2 />
                                    </span>

                                    <p >English</p>
                                </>
                                :
                                <>
                                    <span className="transition-colors flex items-center justify-center w-6 h-6 text-on-surface group-hover:text-primary  ">
                                        <RiTranslate2 />
                                    </span>
                                    <p>العربية</p>
                                </>
                            }
                        </button>
                    </div>
                )}
            </nav >

            {/* desktop sidebar */}
            < nav className={`fixed ${lang === 'ar' ? 'right-0' : 'left-0'} top-0 h-full w-64 hidden flex-col p-6 bg-surface-container-low border-r border-outline-variant/10 z-50 md:flex ${theme === 'dark' ? 'bg-[#09090b] border-white/10' : 'bg-white border-black/10'}`} >
                {/* Logo Section */}
                < div className="mb-12 px-4" >
                    <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                        {t('sidebar.add_new')}
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-1 font-body">
                        {t('sidebar.create_new_record')}
                    </p>
                </div >

                {/* Navigation Links */}
                < div className="flex-1 space-y-2" >
                    {
                        addNewItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                                        : 'text-on-surface-variant hover:bg-primary/5 hover:text-on-surface'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`transition-colors flex items-center justify-center w-6 h-6 ${isActive ? 'text-primary' : 'group-hover:text-primary text-on-surface-variant'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-label">{t(item.label)}</span>
                                    </>
                                )}
                            </NavLink>
                        ))
                    }
                </div >
            </nav >
        </>
    );
};

export default AddNewSidebar;