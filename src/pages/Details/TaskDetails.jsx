import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MdChevronLeft, MdDelete, MdCalendarToday, MdEdit,
    MdPerson, MdBusiness, MdAssignment, MdStickyNote2, MdClose
} from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';
import DeleteModel from '../../components/common/DeleteModel';
import { useTask, useDeleteTask } from '../../hooks/api/useTasks';
import { getStatusStyle, getStatusDot } from '../../utils/getStatusStyleIcon';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { t, i18n } = useTranslation();

    const { data, isLoading, isError, error } = useTask(id);
    const task = data?.data ?? data;

    const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();
    const handleDelete = async () => {
        try {
            await deleteTask(id);
            navigate('/tasks');
        } catch {
            setShowDeleteModal(false);
        }
    };



    const profit = parseFloat(task?.price ?? 0) - parseFloat(task?.cost ?? 0);

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
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl h-32" />
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
                <button onClick={() => navigate('/tasks')} className="primary-btn mt-2">
                    <MdChevronLeft className={i18n.language === 'ar' ? 'rotate-180' : ''} /> {t('forms.client.back')}
                </button>
            </div>
        );
    }


    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back */}
                <div>
                    <button onClick={() => navigate(-1)} className="primary-btn w-full md:w-40 ltr:md:float-right rtl:md:float-left mt-5">
                        <MdChevronLeft className={`text-[18px] md:text-[20px] ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                        <span>{t('forms.client.back')}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Task Overview Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-secondary-container/50 mb-6 flex items-center justify-center text-on-secondary-container shadow-inner">
                            <MdAssignment className="text-4xl" />
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2 capitalize">
                            {task?.task_type}
                        </h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">{t('forms.task.type')}</p>
                        <div className={`px-5 py-2 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(task?.status)}`}>
                            <span className={`w-2 h-2 rounded-full ${getStatusDot(task?.status)}`} />
                            {t(`options.status.${task?.status}`) ?? task?.status}
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Assignment Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">{t('forms.task.assignment_details')}</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBusiness className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.client')}</p>
                                        {task?.client ? (
                                            <Link to={`/details/client/${task.client_id}`} className="font-body text-primary font-medium hover:underline">
                                                {task.client}
                                            </Link>
                                        ) : <p className="font-body text-on-surface font-medium">—</p>}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdPerson className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.employee')}</p>
                                        {task?.employee ? (
                                            <Link to={`/details/employee/${task.employee_id}`} className="font-body text-primary font-medium hover:underline">
                                                {task.employee}
                                            </Link>
                                        ) : <p className="font-body text-on-surface font-medium">{t('common.unassigned')}</p>}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCalendarToday className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.start_date')}</p>
                                        <p className="font-body text-on-surface font-medium">
                                            {task?.start_date
                                                ? new Date(task.start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">{t('forms.task.financial_overview')}</h3>
                            <div className="mb-4 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.price')}</p>
                                <p className="font-headline text-4xl font-extrabold text-emerald-600">
                                    {i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(task?.price ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.cost')}</p>
                                    <p className="font-body text-error font-medium">{i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(task?.cost ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}</p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.task.profit')}</p>
                                    <p className={`font-body font-medium ${profit >= 0 ? 'text-primary' : 'text-error'}`}>
                                        {i18n.language === 'ar' ? '' : 'E.G '}{parseFloat(profit ?? 0)} {i18n.language === 'ar' ? 'E.G' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {task?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                    <MdStickyNote2 className="text-[18px]" />
                                    {t('forms.task.task_notes')}
                                </h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{task.notes}</p>
                            </div>
                        </div>
                    )}
                </div>


                <div className="md:flex md:justify-between gap-5 mt-5">
                    <button onClick={() => setShowDeleteModal(true)} className="error-btn w-full flex items-center justify-center gap-2">
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.task.delete_task')}</span>
                    </button>
                    <button onClick={() => navigate(`/edit/task/${id}`)} className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2">
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.task.edit_task')}</span>
                    </button>
                </div>

            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModel
                    setShowDeleteModal={setShowDeleteModal}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={`task ${task?.task_type}`}
                />
            )}
        </div>
    );
};

export default TaskDetails;
