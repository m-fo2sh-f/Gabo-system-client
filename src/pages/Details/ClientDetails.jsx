import { useState } from 'react';
import { MdChevronLeft, MdDelete, MdEdit, MdCall, MdLocationOn, MdPublic, MdTag, MdAlternateEmail, MdLink, MdStickyNote2 } from "react-icons/md";
import { Link, useNavigate, useParams } from 'react-router-dom';

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { mutateAsync: useClients, data: client, isLoading, error } = useClients(id);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    const handleDelete = () => {
        setShowDeleteModal(false);
    }
    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">



            <div className="px-4 md:px-8 max-w-7xl mx-auto w-full  flex-1 flex flex-col ">
                {/* back button */}

                <div>
                    <button
                        onClick={() => navigate(-1)}

                        className="primary-btn w-full md:w-40 md:float-right mt-5">
                        <MdChevronLeft className="text-[18px] md:text-[20px]" />
                        <span className="hidden sm:inline">Back</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 0 mt-5">

                    {/* Profile Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 overflow-hidden ghost-border shadow-[0_10px_20px_rgba(19,27,46,0.03)] flex items-center justify-center">
                            <img alt="Acme Corp Company Logo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgLLioAIySJk40XeGsX5X2gjC76w3Hxp0eUi3m3fYDudt5OZ1526Q4BbJXrROnlEiOj8bibgv_zjYPv9M5GAbdlLu7NYisKqaoKCQpsG3VDA329cvjR_ZxyyN-rnvG27D7IsSJfD8gtUva7pfUfZRZ4PpUaZ4-l0CZjbHAii4Xw3pIf7mNKMq7Zw0vO2sxu0h6fKp34ORQ0WsXkJzjPDfRWCOaREr1GSyEiLWgCi7h6xMXGAx1VSIv6V2oxMDZgtH8TqzYIEKQ8sY" />
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">{client?.name}</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">{client?.email}</p>
                        <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Active
                        </div>
                    </div>

                    {/* Bento Grid Middle Section */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Contact Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Contact Info</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCall className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Primary Phone</p>
                                        <p className="font-body text-on-surface font-medium">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdLocationOn className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Address</p>
                                        <p className="font-body text-on-surface font-medium">100 Innovation Drive<br />San Francisco, CA 94105</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contract Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Contract Details</h3>
                            <div className="mb-6 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">Total Value</p>
                                <p className="font-headline text-4xl font-extrabold text-primary">$125,000</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Start Date</p>
                                    <p className="font-body text-on-surface font-medium">Jan 1, 2023</p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Payment Cycle</p>
                                    <p className="font-body text-on-surface font-medium">Monthly</p>
                                </div>
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
                            <button title="Email" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border">
                                <MdAlternateEmail className="text-[20px]" />
                            </button>
                            <button title="Website" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border">
                                <MdLink className="text-[20px]" />
                            </button>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                <MdStickyNote2 className="text-[18px]" />
                                Internal Notes
                            </h3>
                            <span className="text-xs text-on-surface-variant">Last updated: 2 days ago</span>
                        </div>
                        <div className="bg-surface rounded-lg p-6 ghost-border min-h-[120px]">
                            <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                Acme Corp is prioritizing Q3 expansion into the European market. Key focus areas include localized supply chain logistics and establishing a regional hub in Berlin. Ensure all quarterly reports highlight EU metrics moving forward. Next sync scheduled for early next month to review preliminary budget allocations.
                            </p>
                        </div>
                    </div>
                    {/* <button className="h-10 md:h-12 px-4 md:px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-label text-xs md:text-base uppercase tracking-[0.05em] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-[0_20px_40px_rgba(19,27,46,0.06)]"> */}


                </div>
                {/* edit button */}
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

export default ClientDetails;