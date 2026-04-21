import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/api/useEmployees';

const Employees = () => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const navigate = useNavigate();

    const filters = {};
    if (search) filters.search = search;
    if (filterType !== 'all') filters.employment_type = filterType;

    const { data, isLoading, isError, error } = useEmployees(filters);
    const employees = data?.data ?? [];

    const getTypeDisplay = (employmentType) => {
        const isFreelance = employmentType === 'freelance';
        return isFreelance ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-outline-variant/40 text-secondary bg-surface">Freelance</span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant">Full-time</span>
        );
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'paused': return 'bg-amber-400';
            case 'stopped': return 'bg-error';
            default: return 'bg-outline';
        }
    };

    const renderSkeletonRows = () =>
        Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container-high" />
                        <div className="space-y-2">
                            <div className="h-3 w-32 bg-surface-container-high rounded" />
                            <div className="h-2 w-20 bg-surface-container-high rounded" />
                        </div>
                    </div>
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 text-right pr-2 border-b border-surface-container-high/50">
                    <div className="h-3 w-16 bg-surface-container-high rounded ml-auto" />
                </td>
            </tr>
        ));

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
                            <option value="full_time">Full-time</option>
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

                {/* Error State */}
                {isError && (
                    <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3 mb-6">
                        Failed to load employees: {error?.response?.data?.message ?? error?.message}
                    </div>
                )}

                {/* Employees Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Employee Details</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Job Title</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Type</th>
                                <th className="pb-4 font-medium text-right pr-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {isLoading ? renderSkeletonRows() : employees.length > 0 ? employees.map((emp) => (
                                <tr key={emp.id} onClick={() => navigate(`/details/employee/${emp.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view full profile">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-semibold text-secondary shrink-0 border border-outline-variant/20">
                                                {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">{emp.name}</span>
                                                <span className="text-xs text-on-surface-variant sm:hidden mt-0.5">{emp.job_title?.name ?? emp.job_title}</span>
                                                <div className="md:hidden mt-1 opacity-80 scale-90 origin-left">
                                                    {getTypeDisplay(emp.employment_type)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">{emp.job_title?.name ?? emp.job_title ?? '—'}</td>
                                    <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                                        {getTypeDisplay(emp.employment_type)}
                                    </td>
                                    <td className="py-4 text-right pr-2 border-b border-surface-container-high/50">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDot(emp.employee_status)}`} />
                                            <span className="capitalize text-sm">{emp.employee_status ?? '—'}</span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-[40px] text-outline">person_search</span>
                                            <p>No employees found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!isLoading && !isError && (
                    <div className="flex items-center justify-between pt-6 mt-2">
                        <span className="text-sm text-on-surface-variant">
                            Showing <span className="font-medium text-on-surface">{employees.length}</span> member{employees.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <MdKeyboardArrowLeft className="text-[20px]" />
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center justify-center">1</button>
                            <button className="p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <MdKeyboardArrowRight className="text-[20px]" />
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Employees;