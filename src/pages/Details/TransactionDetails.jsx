import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MdChevronLeft, MdDelete, MdClose, MdEdit,
    MdAttachMoney, MdCalendarToday, MdPerson, MdBusiness, MdStickyNote2,
    MdArrowDownward, MdArrowUpward, MdTask
} from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';
import DeleteModel from '../../components/common/DeleteModel';
import { useTransaction, useDeleteTransaction } from '../../hooks/api/useTransactions';
import { formatCategory, formatPaymentMethod, getTypeStyle } from '../../utils/formatters';

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { t, i18n } = useTranslation();

    const { data, isLoading, isError, error } = useTransaction(id);
    const trx = data?.data ?? data;
    const isIncome = trx?.type === 'income';
    const { mutateAsync: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

    const handleDelete = async () => {
        try {
            await deleteTransaction(id);
            navigate('/transactions');

        } catch {
            setShowDeleteModal(false);
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
                <button onClick={() => navigate('/transactions')} className="primary-btn mt-2">
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
                    {/* Summary Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center relative overflow-hidden">
                        <div className={`absolute inset-0 ${isIncome ? 'bg-emerald-500/5' : 'bg-error/5'} pointer-events-none`} />
                        <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-4xl relative z-10 ${isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-error/10 text-error'}`}>
                            {isIncome ? <MdArrowDownward /> : <MdArrowUpward />}
                        </div>
                        <p className={`font-headline text-4xl font-extrabold mb-2 relative z-10 ${isIncome ? 'text-emerald-600' : 'text-error'}`}>
                            {i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(trx?.amount ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}
                        </p>
                        <p className="font-body text-on-surface-variant text-sm mb-6 capitalize relative z-10">
                            {t(`options.income_category.${trx?.category}`) || t(`options.expense_category.${trx?.category}`) || formatCategory(trx?.category)}
                        </p>
                        <div className={`px-5 py-2 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 relative z-10 ${getTypeStyle(trx?.type)}`}>
                            <span className={`w-2 h-2 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-error'}`} />
                            {t(`options.transaction_type.${trx?.type}`) ?? trx?.type}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Payment Info */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col gap-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">{t('forms.transaction.payment_info')}</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdAttachMoney className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.transaction.payment_method')}</p>
                                    <p className="font-body text-on-surface font-medium capitalize">{t(`options.payment_method.${trx?.payment_method}`) ?? formatPaymentMethod(trx?.payment_method)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                    <MdCalendarToday className="text-primary text-[20px]" />
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.transaction.date')}</p>
                                    <p className="font-body text-on-surface font-medium">
                                        {trx?.transaction_date
                                            ? new Date(trx.transaction_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Relations */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col gap-6">
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">{t('forms.transaction.related_to')}</h3>
                            {trx?.client && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBusiness className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.transaction.client')}</p>
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
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.transaction.employee')}</p>
                                        <Link to={`/details/employee/${trx.employee.id}`} className="font-body text-primary font-medium hover:underline">
                                            {trx.employee.name}
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {trx?.task && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdTask className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.transaction.task')}</p>
                                        <Link to={`/details/task/${trx.task.id}`} className="font-body text-primary font-medium hover:underline">
                                            {trx.task.name}
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {!trx?.client && !trx?.employee && !trx?.task && (
                                <p className="font-body text-on-surface-variant text-sm">{t('forms.transaction.no_related_entities')}</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    {trx?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex items-center gap-2 mb-6">
                                <MdStickyNote2 className="text-[18px] text-on-surface-variant" />
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider">{t('common.notes')}</h3>
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
                        <span>{t('forms.transaction.delete_transaction')}</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/transaction/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.transaction.edit_transaction')}</span>
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModel
                    setShowDeleteModal={setShowDeleteModal}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={`${t('options.transaction_type.' + trx?.type)} ${i18n.language === 'ar' ? '' : '$'}${parseFloat(trx?.amount ?? 0).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')} ${i18n.language === 'ar' ? 'ج.م' : ''}`}
                />
            )}
        </div>
    );
};

export default TransactionDetails;