import { useState } from 'react';
import {
    MdChevronLeft, MdDelete, MdClose, MdEdit,
    MdAttachMoney, MdCalendarToday, MdPerson, MdBusiness, MdStickyNote2,
    MdArrowDownward, MdArrowUpward
} from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTransaction, useDeleteTransaction } from '../../hooks/api/useTransactions';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, isLoading, isError, error } = useTransaction(id);
    const trx = data?.data ?? data;

    const { mutateAsync: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

    const handleDelete = async () => {
        try {
            await deleteTransaction(id);
            navigate('/transactions');
        } catch {
            setShowDeleteModal(false);
        }
    };

    const isIncome = trx?.type === 'income';

    const formatCategory = (c) => (c ?? '').replace(/_/g, ' ');
    const formatMethod = (m) => (m ?? '').replace(/_/g, ' ');

    const typeStyle = isIncome
        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
        : 'bg-error/10 text-error border-error/20';

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-surface text-on-surface animate-pulse">
                <div className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col mt-8 gap-6">
                    <div className="h-10 w-36 bg-surface-container-high rounded-xl ml-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 h-64" />
                        <div className="md:col-span-8 grid grid-cols-2 gap-6">
                            <div className="bg-surface-container-low rounded-xl h-48" />
                            <div className="bg-surface-container-low rounded-xl h-48" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[60px] text-error/50">error</span>
                <p className="text-lg font-medium">Failed to load transaction</p>
                <p className="text-sm text-error">{error?.response?.data?.message ?? error?.message}</p>
                <button onClick={() => navigate('/transactions')} className="primary-btn mt-2">
                    <MdChevronLeft /> Back to Transactions
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back */}
                <div>
                    <button onClick={() => navigate(-1)} className="primary-btn w-full md:w-40 md:float-right mt-5">
                        <MdChevronLeft className="text-[18px] md:text-[20px]" />
                        <span>Back</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Summary Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 ${isIncome ? 'bg-emerald-500/5' : 'bg-error/5'} pointer-events-none`} />
                        <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-4xl relative z-10 ${isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-error/10 text-error'}`}>
                            {isIncome ? <MdArrowDownward /> : <MdArrowUpward />}
                        </div>
                        <p className={`font-headline text-4xl font-extrabold mb-2 relative z-10 ${isIncome ? 'text-emerald-600' : 'text-error'}`}>
                            {isIncome ? '+' : '-'}${parseFloat(trx?.amount ?? 0).toLocaleString()}
                        </p>
                        <p className="font-body text-on-surface-variant text-sm mb-6 capitalize relative z-10">
                            {formatCategory(trx?.category)}
                        </p>
                        <div className={`px-5 py-2 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 relative z-10 ${typeStyle}`}>
                            <span className={`w-2 h-2 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-error'}`} />
                            {trx?.type}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Payment Info */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col gap-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">Payment Info</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdAttachMoney className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Payment Method</p>
                                    <p className="font-body text-on-surface font-medium capitalize">{formatMethod(trx?.payment_method)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdCalendarToday className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Transaction Date</p>
                                    <p className="font-body text-on-surface font-medium">
                                        {trx?.transaction_date
                                            ? new Date(trx.transaction_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Relations */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col gap-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">Related To</h3>
                            {trx?.client && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBusiness className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Client</p>
                                        <Link to={`/details/client/${trx.client.id}`} className="font-body text-primary font-medium hover:underline">
                                            {trx.client.name}
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {trx?.employee && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdPerson className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Employee</p>
                                        <Link to={`/details/employee/${trx.employee.id}`} className="font-body text-primary font-medium hover:underline">
                                            {trx.employee.name}
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {!trx?.client && !trx?.employee && (
                                <p className="font-body text-on-surface-variant text-sm">No related entities.</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {trx?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex items-center gap-2 mb-6">
                                <MdStickyNote2 className="text-[18px] text-on-surface-variant" />
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">Notes</h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{trx.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="md:flex md:justify-between gap-5 mt-5">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="error-btn w-full flex items-center justify-center gap-2"
                    >
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span>Delete Transaction</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/transaction/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>Edit Transaction</span>
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`${showDeleteModal ? 'fixed' : 'hidden'} inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
                <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md shadow-xl">
                    <h3 className="font-label text-xl font-bold text-on-surface mb-2">Delete Transaction</h3>
                    <p className="font-body text-on-surface-variant mb-2">
                        Are you sure you want to delete this transaction of
                        <span className={`font-semibold ml-1 ${isIncome ? 'text-emerald-600' : 'text-error'}`}>
                            {isIncome ? '+' : '-'}${parseFloat(trx?.amount ?? 0).toLocaleString()}
                        </span>?
                    </p>
                    <p className="text-xs text-error/70 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setShowDeleteModal(false)} className="primary-btn flex-1" disabled={isDeleting}>
                            <MdClose /> Cancel
                        </button>
                        <button onClick={handleDelete} className="error-btn flex-1 flex items-center justify-center gap-2" disabled={isDeleting}>
                            {isDeleting ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                            ) : (
                                <><MdDelete /> Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;