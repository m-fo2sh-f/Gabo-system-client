import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MdChevronLeft, MdDelete, MdEdit, MdCall,
    MdLocationOn, MdStickyNote2, MdClose, MdLink
} from "react-icons/md";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdArrowDownward, MdArrowUpward, } from "react-icons/md";
import DeleteModel from '../../components/common/DeleteModel';



import { useNavigate, useParams } from 'react-router-dom';
import { useClient, useDeleteClient } from '../../hooks/api/useClients';
import { BsFacebook, BsInstagram, BsTiktok, BsLinkedin, BsSnapchat } from 'react-icons/bs';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';

import { FaSearchDollar } from "react-icons/fa";
import { getStatusStyle, getStatusDot } from '../../utils/getStatusStyleIcon';
import { formatCategory, formatPaymentMethod, getTypeStyle } from '../../utils/formatters';

const platformIcons = {
    facebook: <BsFacebook />,
    snapchat: <BsSnapchat />,
    instagram: <BsInstagram />,
    linkedin: <BsLinkedin />,
    tiktok: <BsTiktok />,
    website: <MdLink />,
};

const ClientDetails = () => {
    const { id } = useParams();
    const [page, setPage] = useState(1);
    const { t, i18n } = useTranslation();


    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);




    const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();

    const filters = { page };
    const { data, isLoading, isError, error } = useClient(id, filters);
    const transactions = data?.data?.transactions ?? [];
    const meta = data?.data?.meta ?? {};
    const client = data?.data?.client




    const handleDelete = async () => {
        try {
            await deleteClient(id);
            navigate('/clients');
        } catch {
            setShowDeleteModal(false);
        }
    };


    const renderSkeletonRows = () => <TableSkeleton rows={4} cols={5} />


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
                <p className="text-lg font-medium">{t('common.failure')}</p>
                <p className="text-sm text-error">{error?.response?.data?.message ?? error?.message}</p>
                <button onClick={() => navigate('/clients')} className="primary-btn mt-2">
                    <MdChevronLeft className={i18n.language === 'ar' ? 'rotate-180' : ''} /> {t('forms.client.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back */}
                <div>
                    <button onClick={() => navigate(-1)} className="primary-btn w-full md:w-40 ltr:md:float-right rtl:md:float-left mt-5">
                        <MdChevronLeft className={`text-[18px] md:text-[20px] ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                        <span>{t('forms.client.back')}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Profile Card */}
                    <div className={`${client.is_late ? 'bg-error/10!' : 'bg-surface-container-low!'} md:col-span-4 rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center`}>
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 flex items-center justify-center text-3xl font-headline font-bold text-secondary ghost-border">
                            {client?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">{client?.name}</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-2">{client?.brand_name ?? t('common.no_data')}</p>
                        <div className={`px-4 py-1.5 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mt-4 ${getStatusStyle(client?.status)}`}>
                            <span className={`w-2 h-2 rounded-full ${getStatusDot(client?.status)}`} />
                            {t(`options.status.${client?.status}`) ?? client?.status}
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Contact Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">{t('forms.client.contact_info')}</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCall className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.phone')}</p>
                                        <p className="font-body text-on-surface font-medium" dir="ltr">{client?.phone ?? '—'}</p>
                                    </div>
                                </div>
                                {client?.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                            <MdLocationOn className="text-primary text-[20px]" />
                                        </div>
                                        <div>
                                            <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.address')}</p>
                                            <p className="font-body text-on-surface font-medium">{client.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contract Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-4 relative z-10">{t('forms.client.contract_details')}</h3>
                            <div className="mb-4 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.contract_value')}</p>
                                <p className="font-headline text-4xl font-extrabold text-primary">
                                    {i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(client?.contract_value ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}
                                </p>
                            </div>
                            {client?.is_late && client?.late_amount > 0 && (
                                <div className="mb-4 relative z-10">
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.late_amount')}</p>
                                    <p className="font-headline text-4xl font-extrabold text-error">
                                        {i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(client?.late_amount ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.contract_start')}</p>
                                    <p className="font-body text-on-surface font-medium text-sm">
                                        {client?.contract_start_date
                                            ? new Date(client.contract_start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.client.payment_cycle')}</p>
                                    <p className="font-body text-on-surface font-medium capitalize text-sm">
                                        {t(`options.payment_cycle.${client?.payment_cycle}`) ?? client?.payment_cycle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    {client?.social_links?.length > 0 && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 ghost-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <span className="font-label text-sm text-on-surface-variant uppercase tracking-wider">{t('forms.client.digital_presence')}</span>
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
                                    {t('forms.client.internal_notes')}
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
                        <span>{t('forms.client.delete_client')}</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/client/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.client.edit_client')}</span>
                    </button>
                </div>

                {/* Table */}
                <div className="mt-5 w-full overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2 text-left">{t('forms.client.transaction_details')}</th>
                                <th className="pb-4 font-medium text-left">{t('common.type')}</th>
                                <th className="pb-4 font-medium hidden md:table-cell text-left">{t('forms.transaction.payment_method')}</th>
                                <th className="pb-4 font-medium hidden sm:table-cell text-left">{t('forms.transaction.date')}</th>
                                <th className="pb-4 font-medium text-center">{t('common.actions')}</th>
                                <th className="pb-4 font-medium text-right pr-2">{t('common.amount')}</th>
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

                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${getTypeStyle(trx.type)}`}>
                                            <span className="ltr:mr-1 rtl:ml-1 flex items-center">
                                                {trx.type === 'income' ? <MdArrowDownward className="text-[12px]" /> : <MdArrowUpward className="text-[12px]" />}
                                            </span>
                                            {t(`options.transaction_type.${trx.type}`)}
                                        </span>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 capitalize hidden md:table-cell text-left">
                                        {t(`options.payment_method.${trx.payment_method}`) ?? formatPaymentMethod(trx.payment_method)}
                                    </td>
                                    <td className="py-4 text-on-surface border-b border-surface-container-high/50 hidden sm:table-cell text-left">
                                        {trx.transaction_date
                                            ? new Date(trx.transaction_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/edit/transaction/${trx.id}`);
                                            }}
                                            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                            title="Edit Transaction"
                                        >
                                            <MdEdit className="text-[18px]" />
                                        </button>
                                    </td>
                                    <td className={`py-4 text-right pr-2 font-medium font-headline text-base border-b border-surface-container-high/50 ${trx.type === 'income' ? 'text-emerald-600' : 'text-error'}`}>
                                        {trx.type === 'income' ? '+' : '-'}{parseFloat(trx.amount ?? 0).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')} {i18n.language === 'ar' ? 'ج.م' : '$'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-on-surface-variant">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-[40px] text-outline"> <FaSearchDollar />  </span>
                                            <p>{t('dashboard.no_transactions')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!isLoading && !isError && (
                    <Pagination meta={meta} setPage={setPage} />
                )}

            </div>


            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModel
                    setShowDeleteModal={setShowDeleteModal}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={client?.name}
                />
            )}
        </div>
    );
};

export default ClientDetails;
