import React, { useEffect, useMemo } from 'react';
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

    // 1. Core Form Setup
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            type: 'income',
            category: '',
            amount: '',
            payment_method: 'cash'
        }
    });
    // Watchers
    const transactionType = watch('type');
    const category = watch('category');
    const selectedTaskId = watch('task_id');
    const selectedEmployeeId = watch('employee_id');

    // Transaction Queries
    const { mutateAsync: createTransaction, isPending: isCreating, error: createError } = useCreateTransaction();
    const { mutateAsync: updateTransaction, isPending: isUpdating, error: updateError } = useUpdateTransaction();
    const { data: transactionData, isLoading: isLoadingInitial } = useTransaction(id, { enabled: isEdit });

    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;

    // 2. Logic to Determine Which Dropdowns to Load (Strategy Pattern)
    const needsClients = category === 'manual_collection' || category === 'ads';
    const needsEmployees = category === 'manual_collection' || category === 'salary';
    const needsTasks = category === 'task_payment';

    // 3. Related Data Fetching
    const { data: clientsData } = useClients({}, { enabled: needsClients });
    const { data: employeesData } = useEmployees({}, { enabled: needsEmployees });
    const { data: tasksData } = useTasks({ status: 'pending' }, { enabled: needsTasks });
    console.log('clientsData', clientsData);
    console.log('employeesData', employeesData);
    console.log('tasksData', tasksData);

    // 4. Dropdown Option Mappings
    const clientOptions = useMemo(() =>
        (clientsData?.data?.data ?? []).map(c => ({ value: String(c.id), label: c.name })),
        [clientsData]);

    const employeeOptions = useMemo(() =>
        (employeesData?.data?.data ?? []).map(e => ({ value: String(e.id), label: e.name })),
        [employeesData]);

    const taskOptions = useMemo(() => {
        const rawData = tasksData?.data?.data || tasksData?.data || [];
        const safeArray = Array.isArray(rawData) ? rawData : [];
        return safeArray.map(t => ({
            value: String(t.id),
            label: `${t.client?.name ?? 'Task'} #${t.id}`
        }));
    }, [tasksData])

    //task
    useEffect(() => {
        if (category === 'task_payment' && selectedTaskId && tasksData) {
            // بنجيب الـ Array بتاعة التاسكات زي ما أنت عامل فوق بالظبط
            const rawTasks = tasksData?.data?.data || tasksData?.data || [];
            const safeTasks = Array.isArray(rawTasks) ? rawTasks : [];

            // بندور على التاسك اللي اليوزر اختارها
            const selectedTask = safeTasks.find(t => String(t.id) === String(selectedTaskId));

            // لو لقيناها وليها سعر، بنعمله set في الـ amount
            // ملحوظة: اتأكد إن اسم الحقل في الداتابيز عندك price ولا total_price
            if (selectedTask && selectedTask.price) {
                setValue('amount', selectedTask.price, { shouldValidate: true });
            }
        }
    }, [category, selectedTaskId, tasksData, setValue]);
    // salary
    useEffect(() => {
        if (category === 'salary' && selectedEmployeeId && employeesData) {
            const rawEmployees = employeesData?.data?.data || [];
            const safeEmployees = Array.isArray(rawEmployees) ? rawEmployees : [];

            const selectedEmployee = safeEmployees.find(e => String(e.id) === String(selectedEmployeeId));

            // لو الموظف موجود وليه راتب متسجل
            if (selectedEmployee && selectedEmployee.base_salary) {
                setValue('amount', selectedEmployee.base_salary, { shouldValidate: true });
            }
        }
    }, [category, selectedEmployeeId, employeesData, setValue]);
    // 5. Reset Fields When Category Changes (To Avoid "Orphan" Data)
    useEffect(() => {
        if (!isEdit) {
            setValue('client_id', '');
            setValue('amount', '');
            setValue('employee_id', '');
            setValue('collector_id', '');
            setValue('task_id', '');
        }
    }, [category, setValue, isEdit]);
    useEffect(() => {
        if (!isEdit) {
            setValue('category', '');

        }
    }, [transactionType, setValue, isEdit]);

    // 6. Populate Form for Edit Mode
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

    // 7. Submit Handler
    const onSubmit = async (data) => {
        try {
            const payload = {
                type: data.type,
                category: data.category,
                amount: parseFloat(data.amount),
                payment_method: data.payment_method,
                transaction_date: data.transaction_date,
                notes: data.notes,
            };
            if (data.type === 'income') {
                if (data.category === 'task_payment') {
                    payload.task_id = parseInt(data.task_id);
                } else if (data.category === 'manual_collection') {
                    payload.collector_id = parseInt(data.collector_id);
                    payload.client_id = parseInt(data.client_id);
                }
            } else if (data.type === 'expense') {
                if (data.category === 'salary') {
                    payload.employee_id = parseInt(data.employee_id);
                } else if (data.category === 'ads') {
                    payload.client_id = parseInt(data.client_id);
                }
            }
            if (isEdit) {
                await updateTransaction({ id, ...payload });
                toast.success('Transaction updated successfully!');
                navigate(`/details/transaction/${id}`);
            } else {
                await createTransaction(payload);
                toast.success('Transaction created successfully!');
                navigate('/transactions');
            }
            reset();
        } catch {
        }
    };

    // 8. Loading/Error State
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
                        min: { value: 0.01, message: 'Must be > 0' },
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
                    {...register('transaction_date', { required: 'Transaction date is required' })}
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