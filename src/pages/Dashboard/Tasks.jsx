import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../hooks/api/useTasks';

const Tasks = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filters = {};
    if (search) filters.search = search;
    if (filterStatus !== 'all') filters.status = filterStatus;

    const { data, isLoading, isError, error } = useTasks(filters);
    const tasks = data?.data ?? [];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-primary/10 text-primary border border-primary/20';
            case 'pending': return 'bg-secondary-container text-on-secondary-container border border-secondary-container/50';
            case 'cancelled': return 'bg-error/10 text-error border border-error/20';
            default: return 'bg-surface-container-high text-on-surface-variant';
        }
    };

    const renderSkeletonRows = () =>
        Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                    <div className="space-y-2">
                        <div className="h-3 w-32 bg-surface-container-high rounded" />
                        <div className="h-2 w-20 bg-surface-container-high rounded" />
                    </div>
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-5 w-20 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 text-right border-b border-surface-container-high/50">
                    <div className="h-3 w-16 bg-surface-container-high rounded ml-auto" />
                </td>
                <td className="py-4 text-right pr-2 border-b border-surface-container-high/50 hidden lg:table-cell">
                    <div className="h-3 w-12 bg-surface-container-high rounded ml-auto" />
                </td>
            </tr>
        ));

    return (
        <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">Tasks Management</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Track ongoing and completed tasks.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <div className="relative w-full sm:w-auto">
                            <Input
                                prefix={<IoSearchSharp />}
                                placeholder="Search tasks..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Error */}
                {isError && (
                    <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3 mb-6">
                        Failed to load tasks: {error?.response?.data?.message ?? error?.message}
                    </div>
                )}

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Task / Client</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Assigned To</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Task Type</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium text-right">Price</th>
                                <th className="pb-4 font-medium text-right pr-2 hidden lg:table-cell">Cost</th>
                                <th className="pb-4 font-medium text-center pr-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {isLoading ? renderSkeletonRows() : tasks.length > 0 ? tasks.map((task) => (
                                <tr key={task.id} onClick={() => navigate(`/details/task/${task.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view task details">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                {task.client?.name ?? task.name ?? `Task #${task.id}`}
                                            </span>
                                            <span className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                                                {task.start_date ? new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                                <span className="md:hidden inline-block px-1.5 py-0.5 bg-surface-container-low rounded text-[10px] uppercase tracking-wider ml-1">
                                                    {task.task_type?.name ?? task.task_type ?? ''}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {task.employee?.name ?? '—'}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 text-on-surface capitalize hidden md:table-cell">
                                        {task.task_type?.name ?? task.task_type ?? '—'}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right font-medium font-headline border-b border-surface-container-high/50">
                                        ${parseFloat(task.price ?? 0).toLocaleString()}
                                    </td>
                                    <td className="py-4 text-right pr-2 font-medium font-headline text-secondary border-b border-surface-container-high/50 hidden lg:table-cell">
                                        ${parseFloat(task.cost ?? 0).toLocaleString()}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit/task/${task.id}`);
                                            }}
                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                            title="Edit Task"
                                        >
                                            <MdEdit className="text-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-[40px] text-outline">task_alt</span>
                                            <p>No tasks found matching your filters.</p>
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
                            Showing <span className="font-medium text-on-surface">{tasks.length}</span> task{tasks.length !== 1 ? 's' : ''}
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

export default Tasks;