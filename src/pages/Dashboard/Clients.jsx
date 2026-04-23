import React, { useState, useEffect } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdEdit } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../hooks/api/useClients';
import Pagination from '../../components/common/Pagination';
import { MdPersonSearch } from "react-icons/md";

const Clients = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1)
    useEffect(() => {
        setPage(1);
    }, [search, filterStatus]);



    const filters = { page };
    if (search) filters.search = search;
    if (filterStatus !== 'all') filters.status = filterStatus;

    const { data, isLoading, isError, error } = useClients(filters);

    const clients = data?.data.data ?? [];
    const meta = data?.data?.meta;
    const getPaymentCycleStyle = (cycle) => {
        switch (cycle) {
            case 'monthly': return 'bg-secondary-container text-on-secondary-container';
            case 'weakly': return 'bg-surface-container-highest text-primary';
            case 'once': return 'bg-tertiary-container/20 text-tertiary';
            default: return 'bg-surface-container-high text-on-surface-variant';
        }
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
                    <div className="h-3 w-32 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden lg:table-cell">
                    <div className="h-3 w-20 bg-surface-container-high rounded ml-auto" />
                </td>
            </tr>
        ));

    return (
        <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">Clients Database</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Manage and track your client relationships.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="stopped">Stopped</option>
                        </select>

                        <div className="relative w-full sm:w-auto">
                            <Input
                                type="text"
                                prefix={<IoSearchSharp />}
                                placeholder="Search clients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {isError && (
                    <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3 mb-6">
                        Failed to load clients: {error?.response?.data?.message ?? error?.message}
                    </div>
                )}

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Client Name</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Brand Name</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Payment Cycle</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Is Late</th>
                                <th className="pb-4 font-medium text-right pr-2 hidden lg:table-cell">Start Date</th>
                                <th className="pb-4 font-medium text-center pr-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {isLoading ? renderSkeletonRows() : clients.length > 0 ? clients.map((client) => (
                                <tr key={client.id} onClick={() => navigate(`/details/client/${client.id}`)} className={` ${client.is_late ? 'bg-error/10' : ''} hover:bg-surface-container-high/30 transition-colors group cursor-pointer`} title="Click to view details">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                            {client.name}
                                        </span>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {client.brand_name ?? '—'}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDot(client.status)}`} />
                                            <span className="capitalize">{client.status ?? '—'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentCycleStyle(client.payment_cycle)}`}>
                                            {client.payment_cycle === 'weakly' ? 'weekly' : (client.payment_cycle ?? '—')}
                                        </span>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${getStatusDot(client.is_late ? 'stopped' : 'active')}`} />
                                            <span className="capitalize">{client.is_late ? 'Late' : 'On Time'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right pr-2 font-medium border-b border-surface-container-high/50 hidden lg:table-cell">
                                        {client.contract_start_date ? new Date(client.contract_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit/client/${client.id}`);
                                            }}
                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                            title="Edit Client"
                                        >
                                            <MdEdit className="text-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <MdPersonSearch className="text-[40px] text-outline" />
                                            <p>No clients found matching your search.</p>
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
            </section >
        </div >
    );
};

export default Clients;