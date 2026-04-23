import { useEffect, useMemo } from 'react';
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

const TaskForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cost: 0,
            status: 'pending',
        }
    });

    const { mutateAsync: createTask, isPending: isCreating, error: createError } = useCreateTask();
    const { mutateAsync: updateTask, isPending: isUpdating, error: updateError } = useUpdateTask();
    const { data: taskData, isLoading: isLoadingInitial } = useTask(id);
    const { data: taskTypesData, isLoading: taskTypesLoading } = useTaskTypes();






    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;


    const { data: clientsData, isLoading: clientsLoading } = useClients();
    const { data: employeesData, isLoading: employeesLoading } = useEmployees();

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
                name: data.task_name ?? '',
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
                ...(data.client_id && { client_id: parseInt(data.client_id) }),
                ...(data.employee_id && { employee_id: parseInt(data.employee_id) }),
                ...(data.task_type_id && { task_type_id: parseInt(data.task_type_id) }),
                ...(data.price && { price: parseFloat(data.price) }),
                ...(data.cost !== undefined && { cost: parseFloat(data.cost) }),
                ...(data.status && { status: data.status }),
                ...(data.start_date && { start_date: data.start_date }),
                ...(data.end_date && { end_date: data.end_date }),
                ...(data.notes && { notes: data.notes }),
            };

            if (isEdit) {
                await updateTask({ id, ...payload });
                toast.success('Task updated successfully!');
                navigate(`/details/task/${id}`);
            } else {
                await createTask(payload);
                toast.success('Task created successfully!');
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
                    label="Task Name"
                    type="text"
                    {...register('name', { required: 'Task name is required' })}
                    error={errors.task_name?.message}
                />

                <Select
                    label="Client"
                    options={clientOptions}
                    placeholder={clientsLoading ? 'Loading clients...' : 'Select Client'}
                    {...register('client_id', { required: 'Client is required' })}
                    error={errors.client_id?.message}
                />



                <Select
                    label="Assigned Employee"
                    options={employeeOptions}
                    placeholder={employeesLoading ? 'Loading employees...' : 'Select Employee'}
                    {...register('employee_id', { required: 'Employee is required' })}
                    error={errors.employee_id?.message}
                />

                <Select
                    label="Task Type"
                    options={taskTypeOptions}
                    placeholder={taskTypesLoading ? 'Loading task types...' : 'Select Task Type'}
                    {...register('task_type_id', { required: 'Task type is required' })} // التعديل هنا
                    error={errors.task_type_id?.message} // التعديل هنا
                />

                <Select
                    label="Task Status"
                    options={taskStatusOptions}
                    placeholder="Select Status"
                    {...register('status', { required: 'Task status is required' })}
                    error={errors.status?.message}
                />

                <Input
                    label="Start Date"
                    type="date"
                    {...register('start_date')}
                    error={errors.start_date?.message}
                />

                <Input
                    label="End Date"
                    type="date"
                    {...register('end_date')}
                    error={errors.end_date?.message}
                />

                <Input
                    label="Price"
                    type="number"
                    placeholder="0.00"
                    {...register('price', {
                        required: 'Price is required',
                        min: { value: 0, message: 'Must be ≥ 0' }
                    })}
                    error={errors.price?.message}
                />

                <Input
                    label="Cost"
                    type="number"
                    placeholder="0.00"
                    defaultValue={0}
                    {...register('cost', { min: { value: 0, message: 'Must be ≥ 0' } })}
                    error={errors.cost?.message}
                />
            </div>

            <Input
                label="Notes"
                type="textarea"
                placeholder="Enter any additional notes here..."
                rows={4}
                {...register('notes')}
            />

            {/* API Error */}
            {apiError && (
                <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3">
                    {apiError?.response?.data?.message ?? 'Something went wrong. Please try again.'}
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
                            Saving...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {isEdit ? 'Update Task' : 'Save Task'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;