import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { incomeCategoryOptions, expenseCategoryOptions, paymentMethodOptions } from '../../constants/FormConstants.jsx';
import { useCreateTransaction } from '../../hooks/api/useTransactions';
import { useClients } from '../../hooks/api/useClients';
import { useEmployees } from '../../hooks/api/useEmployees';
import { useTasks } from '../../hooks/api/useTasks';

const TransactionForm = () => {
    const navigate = useNavigate();
    const { mutateAsync: createTransaction, isPending, error: apiError } = useCreateTransaction();

    const { data: clientsData } = useClients();
    const { data: employeesData } = useEmployees();
    const { data: tasksData } = useTasks({ status: 'pending' });

    const clientOptions = (clientsData?.data ?? []).map(c => ({ value: String(c.id), label: c.name }));
    const employeeOptions = (employeesData?.data ?? []).map(e => ({ value: String(e.id), label: e.name }));
    const taskOptions = (tasksData?.data ?? []).map(t => ({
        value: String(t.id),
        label: `${t.client?.name ?? 'Task'} #${t.id}`
    }));

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'income',
            category: '',
            payment_method: 'cash',
        }
    });

    const transactionType = watch('type');
    const category = watch('category');

    useEffect(() => {
        setValue('category', '');
        setValue('client_id', '');
        setValue('employee_id', '');
        setValue('collector_id', '');
        setValue('task_id', '');
    }, [transactionType, setValue]);

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
            await createTransaction(payload);
            navigate('/transactions');
        } catch {
            // captured in apiError
        }
    };

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
                            Save Transaction
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;