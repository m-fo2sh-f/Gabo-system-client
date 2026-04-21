import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../hooks/api/useTransactions';

const Transactions = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filters = {};
    if (search) filters.search = search;
    if (filterType !== 'all') filters.type = filterType;

    const { data, isLoading, isError, error } = useTransactions(filters);
    const transactions = data?.data ?? [];

    const getTypeStyle = (type) => {
        return type === 'income'
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
            : 'bg-error/10 text-error border border-error/20';
    };

    const formatCategory = (category) =>
        (category ?? '').replace(/_/g, ' ');

    const formatPaymentMethod = (method) =>
        (method ?? '').replace(/_/g, ' ');

    const renderSkeletonRows = () =>
        Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                    <div className="space-y-2">
                        <div className="h-3 w-32 bg-surface-container-high rounded" />
                        <div className="h-2 w-24 bg-surface-container-high rounded" />
                    </div>
                </td>
                <td className="py-4 border-b border-surface-container-high/50">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-3 w-20 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-20 bg-surface-container-high rounded" />
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
                        <h3 className="font-headline text-2xl font-bold text-on-surface">Transactions History</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Review your income and expenses.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Transactions</option>
                            <option value="income">Income Only</option>
                            <option value="expense">Expense Only</option>
                        </select>

                        <div className="relative w-full sm:w-auto">
                            <Input
                                prefix={<IoSearchSharp />}
                                placeholder="Search records..."
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
                        Failed to load transactions: {error?.response?.data?.message ?? error?.message}
                    </div>
                )}

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Transaction Details</th>
                                <th className="pb-4 font-medium">Type</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Payment Method</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Date</th>
                                <th className="pb-4 font-medium text-right pr-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {isLoading ? renderSkeletonRows() : transactions.length > 0 ? transactions.map((trx) => (
                                <tr key={trx.id} onClick={() => navigate(`/details/transaction/${trx.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view details">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-on-surface group-hover:text-primary transition-colors capitalize">
                                                {formatCategory(trx.category)}
                                            </span>
                                            <span className="text-xs text-on-surface-variant mt-0.5 whitespace-nowrap">
                                                {trx.client?.name ?? trx.employee?.name ?? trx.task?.client?.name ?? '—'}
                                                {trx.transaction_date && (
                                                    <span className="sm:hidden text-outline-variant/50 mx-1">
                                                        | {new Date(trx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${getTypeStyle(trx.type)}`}>
                                            <span className="mr-1 flex items-center">
                                                {trx.type === 'income' ? <MdArrowDownward className="text-[12px]" /> : <MdArrowUpward className="text-[12px]" />}
                                            </span>
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 capitalize hidden md:table-cell">
                                        {formatPaymentMethod(trx.payment_method)}
                                    </td>
                                    <td className="py-4 text-on-surface border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {trx.transaction_date
                                            ? new Date(trx.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </td>
                                    <td className={`py-4 text-right pr-2 font-medium font-headline text-base border-b border-surface-container-high/50 ${trx.type === 'income' ? 'text-emerald-600' : 'text-error'}`}>
                                        {trx.type === 'income' ? '+' : '-'}${parseFloat(trx.amount ?? 0).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-[40px] text-outline">receipt_long</span>
                                            <p>No transactions found matching your search.</p>
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
                            Showing <span className="font-medium text-on-surface">{transactions.length}</span> record{transactions.length !== 1 ? 's' : ''}
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

export default Transactions;