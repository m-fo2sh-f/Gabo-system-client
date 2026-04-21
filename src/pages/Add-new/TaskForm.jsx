import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { taskTypeOptions, taskStatusOptions } from '../../constants/FormConstants.jsx';
import { useCreateTask } from '../../hooks/api/useTasks';
import { useClients } from '../../hooks/api/useClients';
import { useEmployees } from '../../hooks/api/useEmployees';

const TaskForm = () => {
    const navigate = useNavigate();
    const { mutateAsync: createTask, isPending, error: apiError } = useCreateTask();

    const { data: clientsData, isLoading: clientsLoading } = useClients();
    const { data: employeesData, isLoading: employeesLoading } = useEmployees();

    const clientOptions = (clientsData?.data ?? []).map(c => ({ value: String(c.id), label: c.name }));
    const employeeOptions = (employeesData?.data ?? []).map(e => ({ value: String(e.id), label: e.name }));

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cost: 0,
            status: 'pending',
        }
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                client_id: parseInt(data.client_id),
                price: parseFloat(data.price),
                ...(data.employee_id && { employee_id: parseInt(data.employee_id) }),
                ...(data.task_type && { task_type: data.task_type }),
                ...(data.status && { status: data.status }),
                ...(data.cost !== undefined && { cost: parseFloat(data.cost) }),
                ...(data.start_date && { start_date: data.start_date }),
                ...(data.end_date && { end_date: data.end_date }),
                ...(data.notes && { notes: data.notes }),
            };
            await createTask(payload);
            navigate('/tasks');
        } catch {
            // captured in apiError
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client */}
                <div>
                    <Select
                        label="Client"
                        options={clientOptions}
                        placeholder={clientsLoading ? 'Loading clients...' : 'Select Client'}
                        {...register('client_id', { required: 'Client is required' })}
                        error={errors.client_id?.message}
                    />
                </div>

                {/* Employee */}
                <Select
                    label="Assigned Employee"
                    options={employeeOptions}
                    placeholder={employeesLoading ? 'Loading employees...' : 'Select Employee'}
                    {...register('employee_id')}
                    error={errors.employee_id?.message}
                />

                <Select
                    label="Task Type"
                    options={taskTypeOptions.filter(Boolean)}
                    placeholder="Select Task Type"
                    {...register('task_type')}
                    error={errors.task_type?.message}
                />

                <Select
                    label="Task Status"
                    options={taskStatusOptions}
                    placeholder="Select Status"
                    {...register('status')}
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
                            Save Task
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;