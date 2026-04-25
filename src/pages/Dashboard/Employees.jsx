import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../hooks/api/useEmployees';
import Pagination from '../../components/common/Pagination';
import capitalize from '../../utils/capitalize';
import { MdPersonSearch } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { getStatusDot } from '../../utils/getStatusStyleIcon';
import TableSkeleton from '../../components/common/TableSkeleton';
import useJobTitles from '../../hooks/api/useJobTitles';

const Employees = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [jobTitle, setJobTitle] = useState('all');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const filters = { page };
    if (search) filters.search = search;
    if (jobTitle !== 'all') filters.job_title_id = jobTitle;
    if (filterType !== 'all') filters.employment_type = filterType;



    const { data, isLoading, isError, error } = useEmployees(filters);

    const { data: jobTitlesData, isLoading: isLoadingJobTitles, isError: isErrorJobTitles, error: errorJobTitles } = useJobTitles();
    const jobTitles = jobTitlesData?.data ?? [];

    const employees = data?.data?.data ?? [];
    const meta = data?.data?.meta;

    const getTypeDisplay = (employmentType) => {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-outline-variant/40 text-secondary bg-surface">{capitalize(employmentType)}</span>
        )

    };



    const renderSkeletonRows = () =>
        <TableSkeleton rows={4} cols={5} />


    return (
        <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">{t('tables.employees_database')}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{t('tables.employees_subtitle_desc')}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="full_time">Full-time</option>
                            <option value="part_time">Part-time</option>
                            <option value="internship">Internship</option>
                            <option value="freelance">Freelance</option>
                        </select>
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        >
                            <option value="all">All Job Titles</option>
                            {isLoadingJobTitles ? <option>Loading...</option> : errorJobTitles ? <option>Error</option> : jobTitles.map((jobTitle) => (
                                <option key={jobTitle.id} value={jobTitle.id}>{jobTitle.name}</option>
                            ))}
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
                                <th className="pb-4 font-medium text-center pr-2 w-10"></th>
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
                                            <div className={`w-2 h-2 rounded-full ${getStatusDot(emp.status)}`} />
                                            <span className="capitalize text-sm">{emp.status ?? '—'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit/employee/${emp.id}`);
                                            }}
                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                            title="Edit Employee"
                                        >
                                            <MdEdit className="text-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-[40px] text-outline"> <MdPersonSearch /> </span>
                                            <p>No employees found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {
                    !isLoading && !isError && meta && (
                        <Pagination meta={meta} setPage={setPage} />
                    )
                }
            </section>
        </div>
    );
};

export default Employees;