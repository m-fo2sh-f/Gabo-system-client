import { useState } from 'react';
import { MdChevronLeft, MdDelete, MdCalendarToday, MdEdit, MdPerson, MdBusiness, MdAssignment, MdAttachMoney, MdStickyNote2 } from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);


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

                    {/* Task Overview Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-secondary-container/50 mb-6 flex items-center justify-center text-on-secondary-container shadow-inner">
                            <MdAssignment className="text-4xl" />
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2 capitalize">Development</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">Task Type</p>
                        <div className="px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            In Progress
                        </div>
                    </div>

                    {/* Bento Grid Middle Section */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Assignment Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Assignment Details</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBusiness className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Client / Brand</p>
                                        <Link to="/details/client/1" className="font-body text-primary font-medium hover:underline">Acme Corp</Link>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdPerson className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Assigned Employee</p>
                                        <Link to="/details/employee/1" className="font-body text-primary font-medium hover:underline">Emily Chen</Link>
                                    </div>
                                </div>
                                {/* assign date */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCalendarToday className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Assigned Date</p>
                                        <p className="font-body text-primary font-medium">2022-01-01</p>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Financial Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Financial Overview</h3>
                            <div className="mb-6 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">Expected Price</p>
                                <p className="font-headline text-4xl font-extrabold text-emerald-600">$4,500</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Estimated Cost</p>
                                    <p className="font-body text-error font-medium">$500</p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Gross Profit</p>
                                    <p className="font-body text-primary font-medium border-b border-primary/30 inline-block">$4,000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                <MdStickyNote2 className="text-[18px]" />
                                Task Notes & Requirements
                            </h3>
                        </div>
                        <div className="bg-surface rounded-lg p-6 ghost-border min-h-[120px]">
                            <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                The client requested a complete overhaul of the landing page. Must emphasize mobile responsiveness and fast load times. We need to integrate the new API endpoints before the final review. Emily will handle the frontend implementation while David works on the mockups.
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
            <div className={`${showDeleteModal ? 'fixed' : 'hidden'} inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50`}>
                <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md">
                    <h3 className="font-label text-xl font-bold text-on-surface mb-4">Delete Task</h3>
                    <p className="font-body text-on-surface-variant mb-6">Are you sure you want to delete this Task?</p>
                    <div className="flex gap-4">
                        <button onClick={() => { setShowDeleteModal(false) }} className="primary-btn flex-1">Cancel</button>
                        <button onClick={() => { handleDelete() }} className="error-btn flex-1 ">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;