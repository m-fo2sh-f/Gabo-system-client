import { useState } from 'react';
import {
    MdChevronLeft, MdDelete, MdEdit, MdCall,
    MdLocationOn, MdStickyNote2, MdClose, MdLink
} from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { useClient, useDeleteClient } from '../../hooks/api/useClients';

const platformIcons = {
    facebook: '📘',
    snapchat: '👻',
    instagram: '📸',
    linkedin: '💼',
    tiktok: '🎵',
    website: '🌐',
};

const ClientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, isLoading, isError, error } = useClient(id);
    const client = data?.data ?? data;

    const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();

    const handleDelete = async () => {
        try {
            await deleteClient(id);
            navigate('/clients');
        } catch {
            setShowDeleteModal(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'paused': return 'bg-amber-400/10 text-amber-600 border-amber-400/20';
            case 'stopped': return 'bg-error/10 text-error border-error/20';
            default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant/20';
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
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl h-24" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[60px] text-error/50">error</span>
                <p className="text-lg font-medium">Failed to load client</p>
                <p className="text-sm text-error">{error?.response?.data?.message ?? error?.message}</p>
                <button onClick={() => navigate('/clients')} className="primary-btn mt-2">
                    <MdChevronLeft /> Back to Clients
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
                    {/* Profile Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 flex items-center justify-center text-3xl font-headline font-bold text-secondary ghost-border">
                            {client?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">{client?.name}</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-2">{client?.brand_name ?? 'No brand name'}</p>
                        <div className={`px-4 py-1.5 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-4 ${getStatusStyle(client?.status)}`}>
                            <span className={`w-2 h-2 rounded-full ${getStatusDot(client?.status)}`} />
                            {client?.status ?? 'Unknown'}
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
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
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Phone</p>
                                        <p className="font-body text-on-surface font-medium">{client?.phone ?? '—'}</p>
                                    </div>
                                </div>
                                {client?.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                            <MdLocationOn className="text-primary text-[20px]" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant mb-1">Address</p>
                                            <p className="font-body text-on-surface font-medium">{client.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contract Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-4 relative z-10">Contract Details</h3>
                            <div className="mb-4 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">Contract Value</p>
                                <p className="font-headline text-4xl font-extrabold text-primary">
                                    ${parseFloat(client?.contract_value ?? 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Start Date</p>
                                    <p className="font-body text-on-surface font-medium text-sm">
                                        {client?.contract_start_date
                                            ? new Date(client.contract_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Payment Cycle</p>
                                    <p className="font-body text-on-surface font-medium capitalize text-sm">
                                        {client?.payment_cycle === 'weakly' ? 'Weekly' : (client?.payment_cycle ?? '—')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {client?.social_links?.length > 0 && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 ghost-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <span className="font-label text-sm text-on-surface-variant uppercase tracking-wider">Digital Presence</span>
                            <div className="flex flex-wrap gap-3">
                                {client.social_links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.platform}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface hover:bg-surface-container-highest transition-colors flex items-center justify-center text-on-surface ghost-border text-lg"
                                    >
                                        {platformIcons[link.platform] ?? <MdLink />}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {client?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                    <MdStickyNote2 className="text-[18px]" />
                                    Internal Notes
                                </h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                    {client.notes}
                                </p>
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
                        <span>Delete Client</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/client/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>Edit Client</span>
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`${showDeleteModal ? 'fixed' : 'hidden'} inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
                <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md shadow-xl">
                    <h3 className="font-label text-xl font-bold text-on-surface mb-2">Delete Client</h3>
                    <p className="font-body text-on-surface-variant mb-2">
                        Are you sure you want to delete <span className="font-semibold text-on-surface">{client?.name}</span>?
                    </p>
                    <p className="text-xs text-error/70 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setShowDeleteModal(false)} className="primary-btn flex-1" disabled={isDeleting}>
                            <MdClose /> Cancel
                        </button>
                        <button onClick={handleDelete} className="error-btn flex-1 flex items-center justify-center gap-2" disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Deleting...
                                </>
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

export default ClientDetails;