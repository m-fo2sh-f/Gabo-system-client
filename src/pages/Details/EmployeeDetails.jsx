import { useState } from 'react';
import { MdChevronLeft, MdDelete, MdEdit, MdCall, MdBadge, MdPublic, MdTag, MdAlternateEmail, MdLink, MdStickyNote2, MdWorkHistory } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleDelete = () => {
        setShowDeleteModal(false);
    }
    return (
        <div className="flex flex-col h-full bg-surface text-on-surface ">
            {/* Header */}
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col ">

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

                    {/* Profile Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 overflow-hidden ghost-border shadow-[0_10px_20px_rgba(19,27,46,0.03)] flex items-center justify-center text-3xl font-headline font-bold text-secondary">
                            EC
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Emily Chen</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">Senior Frontend Developer</p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Active
                            </div>
                            <div className="px-4 py-1.5 bg-secondary-container/40 text-on-secondary-container border border-secondary-container rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                Full-Time
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Middle Section */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Personal Info Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Personal Info</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCall className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Phone Number</p>
                                        <p className="font-body text-on-surface font-medium">+1 (555) 987-6543</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBadge className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">National ID</p>
                                        <p className="font-body text-on-surface font-medium tracking-wide">123-456-7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Employment Details</h3>
                            <div className="mb-6 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">Monthly Salary</p>
                                <p className="font-headline text-4xl font-extrabold text-primary">$4,500</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Start Date</p>
                                    <p className="font-body text-on-surface font-medium">Mar 15, 2022</p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1"></p>
                                    <p className="font-body text-on-surface font-medium"></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* profit from thhis Employee */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                        <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Profit from this Emily</h3>
                        <div className="grid grid-cols-3 gap-4 relative z-10">
                            <div>
                                <p className="font-label text-xs text-on-surface-variant mb-1">Income</p>
                                <p className="font-body text-on-surface font-medium">$45,500</p>
                            </div>
                            <div>
                                <p className="font-label text-xs text-on-surface-variant mb-1">Tasks Completed</p>
                                <p className="font-body text-on-surface font-medium">15 Tasks</p>
                            </div>
                            <div>
                                <p className="font-label text-xs text-on-surface-variant mb-1">Clients </p>
                                <p className="font-body text-on-surface font-medium">3 Clients</p>
                            </div>
                        </div>
                    </div>




                    {/* Social Links Card */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 ghost-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <span className="font-label text-sm text-on-surface-variant uppercase tracking-wider">Digital Presence</span>
                        <div className="flex flex-wrap gap-4">
                            <button title="Facebook" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border">
                                <MdPublic className="text-[20px]" />
                            </button>
                            <button title="Instagram" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border">
                                <MdTag className="text-[20px]" />
                            </button>
                            <button title="Portfolio" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border">
                                <MdLink className="text-[20px]" />
                            </button>
                        </div>
                    </div>

                    {/* Notes / Activity */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                <MdWorkHistory className="text-[18px]" />
                                Recent Activity & Notes
                            </h3>
                            <span className="text-xs text-on-surface-variant">Last updated: 1 week ago</span>
                        </div>
                        <div className="bg-surface rounded-lg p-6 ghost-border min-h-[120px]">
                            <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                Emily successfully led the frontend migration to React 19 and implemented the new Tailwind V4 design system.
                                Upcoming performance review is scheduled for next month. Consider a bonus related to the Acme Corp delivery milestone.
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

export default EmployeeDetails;