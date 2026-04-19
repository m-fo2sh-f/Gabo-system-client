import {useState} from 'react';
import { MdChevronLeft, MdDelete, MdEdit, MdSwapVert, MdDateRange, MdPayments, MdArrowDownward, MdArrowUpward, MdPerson, MdStickyNote2 } from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Mock data based on the route or state
    const transactionType = 'income'; // 'income' or 'expense'
    const isIncome = transactionType === 'income';

    const handleDelete = () => {
        setShowDeleteModal(false);
    }
    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">


            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                <div>
                    <button
                        onClick={() => navigate(-1)}

                        className="primary-btn w-full md:w-40 md:float-right mt-5">
                        <MdChevronLeft className="text-[18px] md:text-[20px]" />
                        <span className="hidden sm:inline">Back</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">

                    {/* Flow Card (Amount & Type) */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center relative overflow-hidden">
                        <div className={`absolute top-0 w-full h-1 ${isIncome ? 'bg-emerald-500' : 'bg-error'}`}></div>
                        <div className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center shadow-inner ${isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-error/10 text-error'}`}>
                            {isIncome ? <MdArrowDownward className="text-3xl" /> : <MdArrowUpward className="text-3xl" />}
                        </div>
                        <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-2">Total Amount</p>
                        <h2 className={`font-headline text-4xl font-extrabold mb-6 ${isIncome ? 'text-emerald-600' : 'text-error'}`}>
                            {isIncome ? '+' : '-'}$1,200
                        </h2>
                        <div className={`px-5 py-2 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isIncome ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-error/10 text-error border-error/20'}`}>
                            {isIncome ? 'Income Record' : 'Expense Record'}
                        </div>
                    </div>

                    {/* Bento Grid Middle Section */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Transaction Info Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Transaction Details</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdSwapVert className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Category</p>
                                        <p className="font-body text-on-surface font-medium capitalize">Task Payment</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdPerson className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Entity / Related To</p>
                                        <Link to="/details/client/1" className="font-body text-primary font-medium hover:underline">Acme Corp</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Payment Info</h3>
                            <div className="flex items-start gap-4 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdPayments className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Payment Method</p>
                                    <p className="font-body text-on-surface font-medium capitalize">Bank Transfer</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdDateRange className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Transaction Date</p>
                                    <p className="font-body text-on-surface font-medium">Oct 15, 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                <MdStickyNote2 className="text-[18px]" />
                                Transaction Notes
                            </h3>
                        </div>
                        <div className="bg-surface rounded-lg p-6 ghost-border min-h-[120px]">
                            <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                Payment received for the initial milestone of the Redesign Task. Transferred via wire to the main corporate account. Receipt #4059 attached to internal email logs.
                            </p>
                        </div>
                    </div>

                </div>
                <div className='  md:flex md:justify-between gap-5'>
                    {/* delete Button */}
                    <button onClick={() => { setShowDeleteModal(true) }} className='error-btn w-full  mt-5  flex items-center justify-center' >
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span className="hidden sm:inline">Delete </span>
                        <span className="sm:hidden">Delete</span>
                    </button>

                    {/* edit Button */}
                    <button className='primary-btn w-full  mt-5  flex items-center justify-center' >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span className="hidden sm:inline">Edit </span>
                        <span className="sm:hidden">Edit</span>
                    </button>
                </div>

            </div>

            {/* delete confirmation model */}
            <div className={`${showDeleteModal ? 'fixed' : 'hidden'} inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50`}>
                <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md">
                    <h3 className="font-label text-xl font-bold text-on-surface mb-4">Delete Transaction</h3>
                    <p className="font-body text-on-surface-variant mb-6">Are you sure you want to delete this transaction?</p>
                    <div className="flex gap-4">
                        <button onClick={() => { setShowDeleteModal(false) }} className="primary-btn flex-1">Cancel</button>
                        <button onClick={() => { handleDelete() }} className="error-btn flex-1 ">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;