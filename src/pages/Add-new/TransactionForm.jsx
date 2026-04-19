import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { useState, useEffect } from 'react';

import { incomeCategoryOptions, expenseCategoryOptions, paymentMethodOptions } from '../../constants/FormConstants';
const TransactionForm = () => {
    //todo apis
    // get tasks (pending and completed)
    // get clients
    // get employees
    // get collectors





    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'income',
            category: '',
            payment_method: 'cash'
        }
    })
    const transactionType = watch("type");
    const category = watch("category");

    useEffect(() => {
        setValue("category", "");
        setValue("client_id", "");
        setValue("employee_id", "");
        setValue("collector_id", "");
        setValue("task_id", "");
    }, [transactionType, setValue]);


    const onSubmit = (data) => {
        const payload = {
            type: data.type,
            category: data.category,
            amount: data.amount,
            payment_method: data.payment_method,
            transaction_date: data.transaction_date,
            notes: data.notes,
            // نبعت الـ IDs دي لو موجودة بس
            ...(data.client_id && { client_id: data.client_id }),
            ...(data.employee_id && { employee_id: data.employee_id }),
            ...(data.collector_id && { collector_id: data.collector_id }),
            ...(data.task_id && { task_id: data.task_id }),
        };

        console.log("Clean Transaction Payload:", payload);
        // axios.post('/api/transactions', payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* transaction type */}
                <Select
                    label="Transaction Type"
                    options={[
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' }
                    ]}
                    {...register("type", { required: "Transaction type is required" })}
                    error={errors.type?.message}
                />
                <Select
                    label="Category"
                    options={
                        transactionType === 'income'
                            ? incomeCategoryOptions
                            : expenseCategoryOptions
                    }
                    {...register("category", { required: "Category is required" })}
                    error={errors.category?.message}
                />

                {category === 'task_payment' && (
                    <Select
                        label="Task Name"
                        options={[]} // لستة التاسكات الـ Pending/Completed
                        {...register("task_id", { required: "Task name is required" })}
                    />
                )}
                {category === 'manual_collection' && (
                    <>
                        <Select
                            label="Collector Name"
                            options={[]}
                            {...register("collector_id", { required: "Collector name is required" })}
                        />
                        <Select
                            label="Client Name"
                            options={[]}
                            {...register("client_id", { required: "Client name is required" })}
                        />
                    </>
                )}
                {category === 'salary' && (
                    <Select
                        label="Employee Name"
                        options={[]}
                        {...register("employee_id", { required: "Employee name is required" })}
                    />
                )}
                {category === 'ads' && (
                    <Select
                        label="Client Name"
                        options={[]}
                        {...register("client_id", { required: "Client name is required" })}
                    />
                )}

                <Input
                    label="Amount"
                    type="number"
                    placeholder="Enter Amount"
                    {...register("amount", { required: "Amount is required" })}
                    error={errors.amount?.message}
                />
                <Select
                    label="Payment Method"
                    options={paymentMethodOptions}
                    {...register("payment_method")}
                    error={errors.payment_method?.message}
                />
                <Input
                    label="Payment Date"
                    type="date"
                    placeholder="Select Payment Date"
                    {...register("payment_date")}
                    error={errors.payment_date?.message}
                />
            </div>
            {/* ------------------------------------------------ */}



            <Input
                label="Notes"
                type="textarea"
                placeholder="Enter any additional notes here..."
                rows={5}
                {...register("notes")}
            />

            {/* زرار الحفظ */}
            <div className="flex justify-end pt-4">
                <button type="submit" className="primary-btn">
                    <span className="material-symbols-outlined text-[18px]">save</span>

                </button>
            </div>

        </form >

    )
}


export default TransactionForm