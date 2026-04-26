import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    MdChevronLeft, MdDelete, MdEdit, MdCall,
    MdBadge, MdWorkHistory, MdClose,

} from "react-icons/md";
import { MdContentPasteSearch } from "react-icons/md";

import DeleteModel from "../../components/common/DeleteModel";

import toast from 'react-hot-toast';

import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee, useDeleteEmployee } from '../../hooks/api/useEmployees';

import Pagination from '../../components/common/Pagination';

import { getStatusStyle, getStatusDot } from '../../utils/getStatusStyleIcon';


const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [page, setPage] = useState(1);
    const { t, i18n } = useTranslation();
    const filters = { page };

    const { data, isLoading, isError, error } = useEmployee(id, filters);
    const employee = data?.data?.employee ?? {};
    const tasks = data?.data?.tasks ?? [];
    const meta = data?.data?.meta ?? null;
    const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

    const handleDelete = async () => {
        try {
            await deleteEmployee(id);
            toast.success(t('forms.employee.delete_success') || 'Employee deleted successfully');
            navigate('/employees');
        } catch (error) {
            setShowDeleteModal(false);
            toast.error(error?.response?.data?.message ?? t('common.failure'));
        }
    };



    const initials = employee?.name
        ? employee.name
            .trim()
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : '??';


    const renderSkeletonRows = () => (
        <TableSkeleton rows={4} cols={5} />
    );
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
                <button onClick={() => navigate('/employees')} className="primary-btn mt-2">
                    <MdChevronLeft className={i18n.language === 'ar' ? 'rotate-180' : ''} /> {t('forms.client.back')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back button */}
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="primary-btn w-full md:w-40 ltr:md:float-right rtl:md:float-left mt-5"
                    >
                        <MdChevronLeft className={`text-[18px] md:text-[20px] ${i18n.language === 'ar' ? 'rotate-180' : ''}`} />
                        <span>{t('forms.client.back')}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Profile Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 overflow-hidden ghost-border shadow-[0_10px_20px_rgba(19,27,46,0.03)] flex items-center justify-center text-3xl font-headline font-bold text-secondary">
                            {initials}
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">{employee?.name}</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">
                            {employee?.job_title?.name ?? t('common.no_data')}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <div className={`px-4 py-1.5 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(employee?.status)}`}>
                                <span className={`w-2 h-2 rounded-full ${getStatusDot(employee?.status)}`} />
                                {t(`options.status.${employee?.status}`) ?? employee?.status}
                            </div>
                            <div className="px-4 py-1.5 bg-secondary-container/40 text-on-secondary-container border border-secondary-container rounded-full font-label text-xs font-semibold uppercase tracking-wider">
                                {employee?.employment_type ?? employee?.employment_type}
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Personal Info */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">{t('forms.employee.personal_info')}</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCall className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.employee.phone')}</p>
                                        <p className="font-body text-on-surface font-medium" dir="ltr">{employee?.phone ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBadge className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.employee.job_title')}</p>
                                        <p className="font-body text-on-surface font-medium">
                                            {employee?.job_title?.name ?? employee?.job_title ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-4 relative z-10">
                                {t('forms.employee.employment_details')}
                            </h3>
                            <div className="mb-4 relative z-10">
                                {employee?.employment_type === 'freelance' ? (
                                    <>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.employee.commission_rate')}</p>
                                        <p className="font-headline text-4xl font-extrabold text-primary">
                                            {employee?.commission_rate ?? 0}%
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">{t('forms.employee.monthly_salary')}</p>
                                        <p className="font-headline text-4xl font-extrabold text-primary">
                                            {i18n.language === 'ar' ? '' : '$'}{parseFloat(employee?.base_salary ?? 0).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')} {i18n.language === 'ar' ? 'ج.م' : ''}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {employee?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                    <MdWorkHistory className="text-[18px]" />
                                    {t('common.notes')}
                                </h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                    {employee.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="md:flex md:justify-between gap-5 mt-5">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="error-btn w-full mt-0 flex items-center justify-center gap-2"
                    >
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.employee.delete_employee')}</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/employee/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>{t('forms.employee.edit_employee')}</span>
                    </button>
                </div>
            </div>

            <div className="mt-5 w-full overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                            <th className="pb-4 font-medium pl-2">Task</th>
                            <th className="pb-4 font-medium hidden sm:table-cell">Assigned To</th>
                            <th className="pb-4 font-medium hidden md:table-cell">Task Type</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium text-right">Price</th>
                            <th className="pb-4 font-medium text-right pr-2 hidden lg:table-cell">Cost</th>
                            <th className="pb-4 font-medium text-center pr-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="font-body text-sm text-on-surface">
                        {isLoading ? renderSkeletonRows() : tasks.length > 0 ? tasks.map((task) => (
                            <tr key={task.id} onClick={() => navigate(`/details/task/${task.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view task details">
                                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                            {task.name.length > 30 ? task.name.substring(0, 30) + '...' : task.name}
                                        </span>
                                        <span className="text-xs text-on-surface-variant flex items-center gap-2 mt-0.5">
                                            {task.start_date ? new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                            <span className="md:hidden inline-block px-1.5 py-0.5 bg-surface-container-low rounded text-[10px] uppercase tracking-wider ml-1">
                                                {task.task_type?.name ?? task.task_type ?? ''}
                                            </span>
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">
                                    {employee.name ?? '—'}
                                </td>
                                <td className="py-4 border-b border-surface-container-high/50 text-on-surface capitalize hidden md:table-cell">
                                    {task.task_type?.name ?? task.task_type ?? '—'}
                                </td>
                                <td className="py-4 border-b border-surface-container-high/50">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${getStatusStyle(task.status)}`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right font-medium font-headline border-b border-surface-container-high/50">
                                    ${parseFloat(task.price ?? 0).toLocaleString()}
                                </td>
                                <td className="py-4 text-right pr-2 font-medium font-headline text-secondary border-b border-surface-container-high/50 hidden lg:table-cell">
                                    ${parseFloat(task.cost ?? 0).toLocaleString()}
                                </td>
                                <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit/task/${task.id}`);
                                        }}
                                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Edit Task"
                                    >
                                        <MdEdit className="text-[18px]" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="py-12 text-center text-on-surface-variant">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-[40px] text-outline"> <MdContentPasteSearch /> </span>
                                        <p>No tasks found matching your filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!isLoading && meta && !isError && (
                <Pagination meta={meta} setPage={setPage} />
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteModel
                    setShowDeleteModal={setShowDeleteModal}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={employee?.name}
                />
            )}

        </div>
    );
};

export default EmployeeDetails;
