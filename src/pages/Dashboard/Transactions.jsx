import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const mockTransactions = [
    {
        id: 1,
        type: "income",
        category: "task_payment",
        amount: 1200,
        date: "Oct 15, 2023",
        payment_method: "bank_transfer",
        related_to: "Acme Corp (Task)"
    },
    {
        id: 2,
        type: "expense",
        category: "salary",
        amount: 3000,
        date: "Oct 16, 2023",
        payment_method: "bank_transfer",
        related_to: "Emily Chen"
    },
    {
        id: 3,
        type: "expense",
        category: "ads",
        amount: 500,
        date: "Oct 18, 2023",
        payment_method: "credit_card",
        related_to: "Facebook Ads"
    },
    {
        id: 4,
        type: "income",
        category: "manual_collection",
        amount: 800,
        date: "Oct 20, 2023",
        payment_method: "cash",
        related_to: "Globex Innovations"
    }
];

const Transactions = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = mockTransactions.filter(trx => {
        const matchesSearch = trx.related_to.toLowerCase().includes(search.toLowerCase()) ||
            trx.category.toLowerCase().includes(search.toLowerCase());

        let matchesType = true;
        if (filterType !== 'all') matchesType = trx.type === filterType;

        return matchesSearch && matchesType;
    });

    const getTypeStyle = (type) => {
        return type === 'income'
            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
            : 'bg-error/10 text-error border border-error/20';
    };

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
                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 pl-9 pr-4 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none transition-all duration-200"
                                placeholder="Search records..."
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
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
                            {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                                <tr key={trx.id} onClick={() => navigate(`/details/transaction/${trx.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view details">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                {trx.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-on-surface-variant mt-0.5 whitespace-nowrap">
                                                {trx.related_to}
                                                <span className="sm:hidden text-outline-variant/50 mx-1">|</span>
                                                <span className="sm:hidden">{trx.date.substring(0, 6)}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${getTypeStyle(trx.type)}`}>
                                            <span className="material-symbols-outlined text-[10px] sm:text-[14px] mr-1 flex items-center">
                                                {trx.type === 'income' ? <MdArrowDownward /> : <MdArrowUpward />}
                                            </span>
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 capitalize hidden md:table-cell">
                                        {trx.payment_method.replace('_', ' ')}
                                    </td>
                                    <td className="py-4 text-on-surface border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {trx.date}
                                    </td>
                                    <td className={`py-4 text-right pr-2 font-medium font-headline text-base border-b border-surface-container-high/50 ${trx.type === 'income' ? 'text-emerald-600' : 'text-error'}`}>
                                        {trx.type === 'income' ? '+' : '-'}${trx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-on-surface-variant">No transactions found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-6 mt-2">
                    <span className="text-sm text-on-surface-variant">Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">{filteredTransactions.length}</span> of <span className="font-medium text-on-surface">{mockTransactions.length}</span> records</span>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowLeft /></span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center justify-center">1</button>
                        <button className="p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowRight /></span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Transactions;