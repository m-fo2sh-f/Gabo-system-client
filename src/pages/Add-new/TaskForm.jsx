import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { taskStatusOptions } from '../../constants/FormConstants.jsx';
import { useCreateTask, useUpdateTask, useTask } from '../../hooks/api/useTasks';
import { useClients } from '../../hooks/api/useClients';
import { useEmployees } from '../../hooks/api/useEmployees';

import { useTaskTypes } from '../../hooks/api/useTaskType';
import { MdSave } from "react-icons/md";

import SearchableSelect from '../../components/common/SearchableSelect';

const TaskForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cost: 0,
            status: 'pending',
        }
    });

    const { mutateAsync: createTask, isPending: isCreating, error: createError } = useCreateTask();
    const { mutateAsync: updateTask, isPending: isUpdating, error: updateError } = useUpdateTask();
    const { data: taskData, isLoading: isLoadingInitial } = useTask(id, {},{ enabled: isEdit });
    const { data: taskTypesData, isLoading: taskTypesLoading } = useTaskTypes();






    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;


    const { data: clientsData, isLoading: clientsLoading } = useClients({ per_page: 'all' });
    const { data: employeesData, isLoading: employeesLoading } = useEmployees({ per_page: 'all' });

    const taskTypeOptions = useMemo(() =>
        (taskTypesData?.data ?? []).map(t => ({ value: String(t.id), label: t.name })),
        [taskTypesData]);

    const clientOptions = useMemo(() =>
        (clientsData?.data?.data ?? []).map(c => ({ value: String(c.id), label: c.name })),
        [clientsData]);

    const employeeOptions = useMemo(() =>
        (employeesData?.data?.data ?? []).map(e => ({ value: String(e.id), label: e.name })),
        [employeesData]);


    useEffect(() => {
        if (isEdit && taskData?.data) {
            const data = taskData.data;
            reset({
                name: data.name ?? '',
                client_id: data.client_id ?? '',
                employee_id: data.employee_id ?? '',
                task_type_id: data.task_type_id ?? '',
                status: data.status ?? 'pending',
                start_date: data.start_date ? data.start_date.split('T')[0] : '',
                end_date: data.end_date ? data.end_date.split('T')[0] : '',
                price: data.price ?? '',
                cost: data.cost ?? 0,
                notes: data.notes ?? '',
            });
        }
    }, [isEdit, taskData, reset]);

    const onSubmit = async (data) => {

        try {

            const payload = {
                name: data.name,
                client_id: parseInt(data.client_id) || null,
                employee_id: parseInt(data.employee_id) || null,
                task_type_id: parseInt(data.task_type_id) || null,
                price: parseFloat(data.price) || 0,
                cost: parseFloat(data.cost) || 0,
                status: data.status || 'pending',
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                notes: data.notes || null,
            };

            if (isEdit) {
                await updateTask({ id, ...payload });
                toast.success(t('forms.task.update_success'));
                navigate(`/details/task/${id}`);
            } else {
                await createTask(payload);
                toast.success(t('forms.task.create_success'));
                navigate('/tasks');
            }
        } catch {
            // captured in apiError
        }
    };

    if (isEdit && isLoadingInitial) {
        return (
            <div className="flex flex-col h-full bg-surface text-on-surface animate-pulse p-6">
                <div className="h-4 w-32 bg-surface-container-high rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client */}
                <Input
                    label={t('forms.task.name')}
                    type="text"
                    placeholder={t('forms.task.task_name')}
                    {...register('name', { required: t('forms.validation.required') })}
                    error={errors.name?.message}
                />

                <SearchableSelect
                    name="client_id"
                    control={control}
                    label={t('forms.task.client')}
                    options={clientOptions}
                    isLoading={clientsLoading}
                    placeholder={clientsLoading ? t('forms.task.loading_clients') : t('forms.task.select_client')}
                    rules={{ required: t('forms.validation.required') }}
                    error={errors.client_id?.message}
                />
                <SearchableSelect
                    name="employee_id"
                    control={control}
                    label={t('forms.task.employee')}
                    options={employeeOptions}
                    isLoading={employeesLoading}
                    placeholder={employeesLoading ? t('forms.task.loading_employees') : t('forms.task.select_employee')}
                    rules={{ required: t('forms.validation.required') }}
                    error={errors.employee_id?.message}
                />

                <Select
                    label={t('forms.task.type')}
                    options={taskTypeOptions}
                    placeholder={taskTypesLoading ? t('forms.task.loading_task_types') : t('forms.task.select_task_type')}
                    {...register('task_type_id', { required: t('forms.validation.required') })} // التعديل هنا
                    error={errors.task_type_id?.message} // التعديل هنا
                />

                <Select
                    label={t('forms.task.status')}
                    options={taskStatusOptions.map(opt => ({ ...opt, label: t(`options.status.${opt.value}`) }))}
                    placeholder={t('common.status')}
                    {...register('status', { required: t('forms.validation.required') })}
                    error={errors.status?.message}
                />

                <Input
                    label={t('forms.task.start_date')}
                    type="date"
                    {...register('start_date')}
                    error={errors.start_date?.message}
                />

                <Input
                    label={t('forms.task.end_date')}
                    type="date"
                    {...register('end_date')}
                    error={errors.end_date?.message}
                />

                <Input
                    label={t('forms.task.price')}
                    type="text"
                    inputMode="numeric"
                    placeholder="5000 EGP"
                    {...register('price', {
                        required: t('forms.validation.required'),
                        min: { value: 0, message: t('forms.validation.min_zero') },
                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                    })}
                    error={errors.price?.message}
                />

                <Input
                    label={t('forms.task.cost')}
                    type="text"
                    inputMode="numeric"
                    placeholder="5000 EGP"
                    {...register('cost', {
                        required: t('forms.validation.required'),
                        min: { value: 0, message: t('forms.validation.min_zero') },
                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                    })}
                    error={errors.cost?.message}
                />
            </div>

            <Input
                label={t('common.notes')}
                type="textarea"
                placeholder={t('forms.client.notes_placeholder')}
                rows={4}
                {...register('notes')}
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
                    className="primary-btn min-w-[120px] flex items-center gap-2 justify-center"
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
                            {isEdit ? t('forms.task.update_btn') : t('forms.task.save_btn')}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;