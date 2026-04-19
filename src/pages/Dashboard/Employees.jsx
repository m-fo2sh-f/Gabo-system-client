import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const mockEmployees = [
    {
        id: 1,
        name: "Emily Chen",
        job_title: "Senior Media Buyer",
        is_freelance: false,
        employee_status: "active",
        revenue: "$145,200",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqkcs30pmcmn8-ER1IrBeLLSsXC-FPJRAmWHrkAHv4ea2BKGIf4ZZH66Folor89IqZGX3VINbbxpZYRpgvKyYWk1Z2gC3pnCor2R887R-kgt2LgQDmwM92UKHtQ7oLvwOWOq98vhNI4qCqpmyJQcF5rDO_x9qqo7F5KdBPH4TrA81nxK5uT9iyDVEjJB_MlOE3mKAMuRJYf3xdMScG5Ansiyiitl23R4xIaZ4nYtztrKAwZJ1KzG265Shn2n9irocOBPFxU9GmmZs"
    },
    {
        id: 2,
        name: "John Doe",
        job_title: "Creative Strategist",
        is_freelance: true,
        employee_status: "active",
        revenue: "$82,500",
        avatar: null
    },
    {
        id: 3,
        name: "Marcus Johnson",
        job_title: "Ad Operations Lead",
        is_freelance: false,
        employee_status: "active",
        revenue: "$210,000",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC_vk2it4eU0YQJ6JZq-aob7NBRd1CnSSri1bBLP4_u8yhHYG9Woe-W1V-8iGwC9WqbO_BToifjj9yV37knXA-Ifp3AOApqoOXAABItfocxLcFm8qT9b1XtaPn484vKViOyiA5bo6Z55RxzcWjduayPJkKkZxL1ML1hMHgiqdeJCOuV7hxBnK1yhVhgkCdtZFVGPgGHAo-ws2WZOsCWzX_V9kuF0vTeQhgojWiSrUr6hiriHZtTwNekodmBM-VmNkilGZAAvOQ24Y"
    }
];

const Employees = () => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const navigate = useNavigate();

    // Filter Logic
    const filteredEmployees = mockEmployees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.job_title.toLowerCase().includes(search.toLowerCase());

        let matchesType = true;
        if (filterType === 'freelance') matchesType = emp.is_freelance === true;
        if (filterType === 'full-time') matchesType = emp.is_freelance === false;

        return matchesSearch && matchesType;
    });

    const getTypeDisplay = (isFreelance) => {
        return isFreelance ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-outline-variant/40 text-secondary bg-surface">Freelance</span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">Full-time</span>
        );
    };

    return (
        <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">Team Performance</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Monitor employee contribution and revenues.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="full-time">Full-time</option>
                            <option value="freelance">Freelance</option>
                        </select>

                        <div className="relative w-full sm:w-auto">
                            <Input
                                prefix={<IoSearchSharp />}
                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 pl-9 pr-4 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none transition-all duration-200"
                                placeholder="Search team..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Employees Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Employee Details</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Job Title</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Type</th>
                                <th className="pb-4 font-medium text-right pr-2">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                                <tr key={emp.id} onClick={() => navigate(`/details/employee/${emp.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view full profile">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex items-center gap-3">

                                            <div className="flex flex-col">
                                                <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">{emp.name}</span>
                                                <span className="text-xs text-on-surface-variant sm:hidden mt-0.5">{emp.job_title}</span>
                                                <div className="md:hidden mt-1 opacity-80 scale-90 origin-left">
                                                    {getTypeDisplay(emp.is_freelance)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">{emp.job_title}</td>
                                    <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                                        {getTypeDisplay(emp.is_freelance)}
                                    </td>
                                    <td className="py-4 text-right pr-2 font-medium font-headline text-base border-b border-surface-container-high/50">
                                        {emp.revenue}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-on-surface-variant">No employees found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-6 mt-2">
                    <span className="text-sm text-on-surface-variant">Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">{filteredEmployees.length}</span> of <span className="font-medium text-on-surface">{mockEmployees.length}</span> members</span>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowLeft /></span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center justify-center">1</button>
                        <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container-high text-sm font-medium flex items-center justify-center transition-colors">2</button>
                        <button className="p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowRight /></span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Employees;