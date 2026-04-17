import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { addNewItems } from '../../constants/sideBarLinks';
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { useTheme } from '../../contexts/ThemeContext';
import { IoMdSunny } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
const AddNewSidebar = () => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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
                        Canvas Agency
                    </h1>
                    <button className='primary-btn'>Add New</button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="flex flex-col px-4 pb-4 pt-2 space-y-2 animate-in fade-in duration-200">
                        {menuItems.map((item) => (
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
                                        <span className="text-sm font-label">{item.label}</span>
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

                                    <p >Light</p>
                                </>
                                :
                                <>
                                    <span className="transition-colors flex items-center justify-center w-6 h-6 text-on-surface group-hover:text-primary  ">
                                        <MdOutlineDarkMode size={24} />
                                    </span>
                                    <p>Dark</p>
                                </>
                            }
                        </button>
                    </div>
                )}
            </nav >

            {/* desktop sidebar */}
            < nav className="fixed left-0 top-0 h-full w-64 hidden flex-col p-6 bg-surface-container-low border-r border-outline-variant/10 z-50 md:flex" >
                {/* Logo Section */}
                < div className="mb-12 px-4" >
                    <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                        Add New
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-1 font-body">
                        Create New Record
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
                                        <span className="text-sm font-label">{item.label}</span>
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