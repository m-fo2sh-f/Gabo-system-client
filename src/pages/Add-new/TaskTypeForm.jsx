import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import Input from '../../components/common/input'
import { useTaskTypes, useCreateTaskType, useDeleteTaskType } from '../../hooks/api/useTaskType'
import toast from 'react-hot-toast'
import DeleteModel from "../../components/common/DeleteModel";
import { MdDelete } from 'react-icons/md'
import { MdSave } from "react-icons/md";



const TaskTypeForm = () => {
    const [deletingItem, setDeletingItem] = useState(null);
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const { mutateAsync: createTaskType, isPending: isCreating, error: createError, } = useCreateTaskType();
    const { mutateAsync: deleteTaskType, isPending: isDeleting } = useDeleteTaskType();
    const { data: allTaskTypesData, isLoading: isListLoading, refetch: listRefetch } = useTaskTypes();

    const taskTypeList = allTaskTypesData?.data ?? [];
    const isPending = isCreating;
    const apiError = createError;



    useEffect(() => {
        reset({ name: '' });
    }, [reset]);

    const onSubmit = async (data) => {
        try {
            await createTaskType(data);
            toast.success(t('forms.task.create_success'));
            listRefetch();
            reset(); // فضي الفورم بعد الإضافة
        } catch {
            // Error is handled in UI
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteTaskType(deletingItem.id); // استخدم الـ ID المحفوظ
            toast.success(t('forms.task.delete_success'));
            setDeletingItem(null); // اقفل المودال ونظف الـ State
            listRefetch();
        } catch {
            // captured in apiError
        }
    }



    const renderSkeletonRows = () =>
        Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                    <div className="h-3 w-32 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden lg:table-cell">
                    <div className="h-3 w-20 bg-surface-container-high rounded ml-auto" />
                </td>
            </tr>
        ));

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label={t('forms.task.task_type')}
                    placeholder={t('forms.task.enter_task_type')}
                    disabled={isPending}
                    {...register('name', { required: t('forms.validation.required') })}
                    error={errors.name?.message}
                />
                {/* API Error */}
                {apiError && (
                    <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3">
                        {apiError?.response?.data?.message ?? t('common.failure')}
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="primary-btn w-full md:w-auto  min-w-[120px] flex items-center gap-2 justify-center"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                                {t('forms.client.saving')}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]"><MdSave /></span>
                                {t('forms.task.save_task_type')}
                            </>
                        )}
                    </button>
                </div>
            </form>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                            <th className="pb-4 font-medium pl-2 text-left">{t('common.id')}</th>
                            <th className="pb-4 font-medium pl-2 text-left">{t('forms.task.task_type')}</th>
                            <th className="pb-4 font-medium text-center pr-2 w-10">{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="font-body text-sm text-on-surface">
                        {isListLoading ? renderSkeletonRows() : taskTypeList.length > 0 ? taskTypeList.map((taskType) => (
                            <tr key={taskType.id} className="hover:bg-surface-container-high/30 transition-colors group">
                                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                    <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                        {taskType.id}
                                    </span>
                                </td>
                                <td className="py-4 text-secondary border-b border-surface-container-high/50 sm:table-cell">
                                    {taskType.name}
                                </td>
                                <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                    <button
                                        onClick={() => setDeletingItem(taskType)}
                                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                                        title="Delete Task Type"
                                    >
                                        <MdDelete className="text-[18px]" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-on-surface-variant">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>{t('common.no_data')}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Delete Confirmation Modal */}
            {deletingItem && (
                <DeleteModel
                    setShowDeleteModal={() => setDeletingItem(null)} // بتقفل المودال
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={deletingItem.name} // الاسم هيتعرض صح في رسالة التأكيد
                />
            )}

        </>

    )
}

export default TaskTypeForm