import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { incomeCategoryOptions, expenseCategoryOptions, paymentMethodOptions } from '../../constants/FormConstants.jsx';
import { useCreateTransaction, useUpdateTransaction, useTransaction } from '../../hooks/api/useTransactions';
import { useClients } from '../../hooks/api/useClients';
import { useEmployees } from '../../hooks/api/useEmployees';
import { useTasks } from '../../hooks/api/useTasks';

const TransactionForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    
    const { mutateAsync: createTransaction, isPending: isCreating, error: createError } = useCreateTransaction();
    const { mutateAsync: updateTransaction, isPending: isUpdating, error: updateError } = useUpdateTransaction();
    const { data: transactionData, isLoading: isLoadingInitial } = useTransaction(id);
    
    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;

    const { data: clientsData } = useClients();
    const { data: employeesData } = useEmployees();
    const { data: tasksData } = useTasks({ status: 'pending' });

    const clientOptions = (clientsData?.data ?? []).map(c => ({ value: String(c.id), label: c.name }));
    const employeeOptions = (employeesData?.data ?? []).map(e => ({ value: String(e.id), label: e.name }));
    const taskOptions = (tasksData?.data ?? []).map(t => ({
        value: String(t.id),
        label: `${t.client?.name ?? 'Task'} #${t.id}`
    }));

    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            type: 'income',
            category: '',
            payment_method: 'cash',
        }
    });

    const transactionType = watch('type');
    const category = watch('category');

    useEffect(() => {
        // Only clear if not editing, to avoid overwriting initial data on first render
        if (!isEdit) {
            setValue('category', '');
            setValue('client_id', '');
            setValue('employee_id', '');
            setValue('collector_id', '');
            setValue('task_id', '');
        }
    }, [transactionType, setValue, isEdit]);

    useEffect(() => {
        if (isEdit && transactionData?.data) {
            const data = transactionData.data;
            reset({
                type: data.type ?? 'income',
                category: data.category ?? '',
                amount: data.amount ?? '',
                payment_method: data.payment_method ?? 'cash',
                transaction_date: data.transaction_date ? data.transaction_date.split('T')[0] : '',
                notes: data.notes ?? '',
                client_id: data.client?.id ?? data.client_id ?? '',
                employee_id: data.employee?.id ?? data.employee_id ?? '',
                collector_id: data.collector?.id ?? data.collector_id ?? '',
                task_id: data.task?.id ?? data.task_id ?? '',
            });
        }
    }, [isEdit, transactionData, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                type: data.type,
                category: data.category,
                amount: parseFloat(data.amount),
                payment_method: data.payment_method,
                ...(data.transaction_date && { transaction_date: data.transaction_date }),
                ...(data.notes && { notes: data.notes }),
                ...(data.client_id && { client_id: parseInt(data.client_id) }),
                ...(data.employee_id && { employee_id: parseInt(data.employee_id) }),
                ...(data.collector_id && { collector_id: parseInt(data.collector_id) }),
                ...(data.task_id && { task_id: parseInt(data.task_id) }),
            };

            if (isEdit) {
                await updateTransaction({ id, ...payload });
                toast.success('Transaction updated successfully!');
                navigate(`/details/transaction/${id}`);
            } else {
                await createTransaction(payload);
                toast.success('Transaction created successfully!');
                navigate('/transactions');
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
                {/* Type */}
                <Select
                    label="Transaction Type"
                    options={[
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' }
                    ]}
                    {...register('type', { required: 'Transaction type is required' })}
                    error={errors.type?.message}
                />

                {/* Category (dynamic) */}
                <Select
                    label="Category"
                    options={transactionType === 'income' ? incomeCategoryOptions : expenseCategoryOptions}
                    placeholder="Select Category"
                    {...register('category', { required: 'Category is required' })}
                    error={errors.category?.message}
                />

                {/* Conditional fields */}
                {category === 'task_payment' && (
                    <Select
                        label="Task"
                        options={taskOptions}
                        placeholder="Select Task"
                        {...register('task_id', { required: 'Task is required' })}
                        error={errors.task_id?.message}
                    />
                )}

                {category === 'manual_collection' && (
                    <>
                        <Select
                            label="Collector (Employee)"
                            options={employeeOptions}
                            placeholder="Select Collector"
                            {...register('collector_id', { required: 'Collector is required' })}
                            error={errors.collector_id?.message}
                        />
                        <Select
                            label="Client"
                            options={clientOptions}
                            placeholder="Select Client"
                            {...register('client_id', { required: 'Client is required' })}
                            error={errors.client_id?.message}
                        />
                    </>
                )}

                {category === 'salary' && (
                    <Select
                        label="Employee"
                        options={employeeOptions}
                        placeholder="Select Employee"
                        {...register('employee_id', { required: 'Employee is required' })}
                        error={errors.employee_id?.message}
                    />
                )}

                {category === 'ads' && (
                    <Select
                        label="Client"
                        options={clientOptions}
                        placeholder="Select Client"
                        {...register('client_id', { required: 'Client is required for Ads expense' })}
                        error={errors.client_id?.message}
                    />
                )}

                {/* Amount */}
                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    {...register('amount', {
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Must be > 0' }
                    })}
                    error={errors.amount?.message}
                />

                {/* Payment Method */}
                <Select
                    label="Payment Method"
                    options={paymentMethodOptions}
                    {...register('payment_method')}
                    error={errors.payment_method?.message}
                />

                {/* Date */}
                <Input
                    label="Transaction Date"
                    type="date"
                    {...register('transaction_date')}
                    error={errors.transaction_date?.message}
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
                            {isEdit ? 'Update Transaction' : 'Save Transaction'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;