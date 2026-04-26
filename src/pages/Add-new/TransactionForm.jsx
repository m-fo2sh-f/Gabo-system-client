import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { incomeCategoryOptions, expenseCategoryOptions, paymentMethodOptions } from '../../constants/FormConstants.jsx';
import { useCreateTransaction, useUpdateTransaction, useTransaction } from '../../hooks/api/useTransactions';
import { useClients } from '../../hooks/api/useClients';
import { useEmployees } from '../../hooks/api/useEmployees';
import { useTasks } from '../../hooks/api/useTasks';
import { MdSave } from "react-icons/md";
import SearchableSelect from '../../components/common/SearchableSelect';

const TransactionForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { t } = useTranslation();

    // 1. Core Form Setup
    const { register, handleSubmit, watch, setValue, reset, control, formState: { errors } } = useForm({
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
    const { data: transactionData, isLoading: isLoadingInitial } = useTransaction(id, {}, { enabled: isEdit });

    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;

    // 2. Logic to Determine Which Dropdowns to Load (Strategy Pattern)
    const needsClients = category === 'manual_collection' || category === 'ads';
    const needsEmployees = category === 'manual_collection' || category === 'salary';
    const needsTasks = category === 'task_payment';

    // 3. Related Data Fetching
    const { data: clientsData } = useClients({ per_page: 'all' }, { enabled: needsClients });
    const { data: employeesData } = useEmployees({ per_page: 'all' }, { enabled: needsEmployees });
    const { data: tasksData } = useTasks({ status: 'pending', per_page: 'all' }, { enabled: needsTasks })


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
            label: `${t.name} - $${transactionType === 'income' ? t.price : t.cost}`
        }));
    }, [tasksData, transactionType])



    //task
    useEffect(() => {
        if (category === 'task_payment' && transactionType === 'income' && selectedTaskId && tasksData) {

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
            setValue('employee_id', '');
            setValue('task_id', '');
        }
    }, [category, setValue, isEdit]);
    useEffect(() => {
        if (!isEdit) {
            setValue('category', '');

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
                employee_id: data.employee_id ?? data.employee_id ?? '',
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
                notes: data.notes || null

            };
            if (data.type === 'income') {
                if (data.category === 'task_payment') {
                    // حماية من الـ NaN
                    payload.task_id = parseInt(data.task_id) || null;
                } else if (data.category === 'manual_collection') {
                    payload.employee_id = parseInt(data.employee_id) || null;
                    payload.client_id = parseInt(data.client_id) || null;
                }
            } else if (data.type === 'expense') {
                if (data.category === 'salary') {
                    payload.employee_id = parseInt(data.employee_id) || null;
                } else if (data.category === 'task_payment') {
                    payload.task_id = parseInt(data.task_id) || null;
                } else if (data.category === 'ads') {
                    payload.client_id = parseInt(data.client_id) || null;
                }
            }
            if (isEdit) {
                await updateTransaction({ id, ...payload });
                toast.success(t('forms.transaction.update_success'));
                navigate(`/details/transaction/${id}`);


            } else {
                await createTransaction(payload);
                toast.success(t('forms.transaction.create_success'));
                navigate('/transactions');
            }

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
                    label={t('forms.transaction.type')}
                    disabled={isEdit}
                    options={[
                        { value: 'income', label: t('options.transaction_type.income') },
                        { value: 'expense', label: t('options.transaction_type.expense') }
                    ]}
                    {...register('type', { required: t('forms.validation.required') })}
                    error={errors.type?.message}
                />

                {/* Category (dynamic) */}
                <Select
                    label={t('common.category')}
                    disabled={isEdit}

                    options={transactionType === 'income'
                        ? incomeCategoryOptions.map(opt => ({ ...opt, label: t(`options.income_category.${opt.value}`) }))
                        : expenseCategoryOptions.map(opt => ({ ...opt, label: t(`options.expense_category.${opt.value}`) }))}
                    placeholder={t('common.category')}
                    {...register('category', { required: t('forms.validation.required') })}
                    error={errors.category?.message}
                />

                {/* Conditional fields */}
                {category === 'task_payment' && (
                    <SearchableSelect
                        name="task_id"
                        control={control}
                        label={t('forms.transaction.task')}
                        options={taskOptions}
                        placeholder={t('forms.transaction.select_task')}
                        rules={{ required: t('forms.validation.required') }}
                        error={errors.task_id?.message}
                        disabled={isEdit}
                    />
                )}

                {category === 'manual_collection' && (
                    <>
                        <SearchableSelect
                            name="employee_id"
                            control={control}
                            label={t('forms.transaction.collector')}
                            options={employeeOptions}
                            placeholder={t('forms.transaction.select_collector')}
                            rules={{ required: t('forms.validation.required') }}
                            error={errors.employee_id?.message}
                            disabled={isEdit}
                        />
                        <SearchableSelect
                            name="client_id"
                            control={control}
                            label={t('forms.transaction.client')}
                            options={clientOptions}
                            placeholder={t('forms.task.select_client')}
                            rules={{ required: t('forms.validation.required') }}
                            error={errors.client_id?.message}
                            disabled={isEdit}
                        />
                    </>
                )}

                {category === 'salary' && (
                    <SearchableSelect
                        name="employee_id"
                        control={control}
                        label={t('forms.transaction.employee')}
                        options={employeeOptions}
                        placeholder={t('forms.task.select_employee')}
                        rules={{ required: t('forms.validation.required') }}
                        error={errors.employee_id?.message}
                        disabled={isEdit}
                    />
                )}

                {category === 'ads' && (
                    <SearchableSelect
                        name="client_id"
                        control={control}
                        label={t('forms.transaction.client')}
                        options={clientOptions}
                        placeholder={t('forms.task.select_client')}
                        rules={{ required: t('forms.validation.required') }}
                        error={errors.client_id?.message}
                        disabled={isEdit}
                    />
                )}

                <Input
                    label="Amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="5000 EGP"
                    disabled={isEdit}
                    {...register('amount', {
                        required: 'Amount is required',
                        min: { value: 0.01, message: 'Must be > 0' },
                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter a valid number' }
                    })}
                    error={errors.amount?.message}
                />


                {/* Payment Method */}
                <Select
                    label={t('forms.transaction.payment_method')}
                    options={paymentMethodOptions.map(opt => ({ ...opt, label: t(`options.payment_method.${opt.value}`) }))}
                    {...register('payment_method')}
                    error={errors.payment_method?.message}
                />

                {/* Date */}
                <Input
                    label={t('forms.transaction.date')}
                    type="date"
                    {...register('transaction_date', { required: t('forms.validation.required') })}
                    error={errors.transaction_date?.message}
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
                            {isEdit ? t('forms.transaction.update_btn') : t('forms.transaction.save_btn')}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
