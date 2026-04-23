import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { EmployeeeState, workType } from '../../constants/FormConstants.jsx';
import { useCreateEmployee, useUpdateEmployee, useEmployee } from '../../hooks/api/useEmployees';

import useJobTitles from '../../hooks/api/useJobTitles';

const EmployeeForm = () => {
    const { id } = useParams();
    const isEdit = !!id;

    const navigate = useNavigate();
    const { data: jobTitlesData } = useJobTitles();
    const jobTitles = jobTitlesData?.data ?? jobTitlesData;

    const { mutateAsync: createEmployee, isPending: isCreating, error: createError } = useCreateEmployee();
    const { mutateAsync: updateEmployee, isPending: isUpdating, error: updateError } = useUpdateEmployee();
    const { data: employeeData, isLoading: isLoadingInitial } = useEmployee(id);


    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            employee_status: 'active',
        }
    });
    const employmentType = watch('employment_type');
    const isFreelance = employmentType === 'freelance';



    useEffect(() => {
        if (isEdit && employeeData?.data) {
            const data = employeeData.data;
            reset({
                name: data.name ?? '',
                phone: data.phone ?? '',
                employment_type: data.employment_type ?? 'full_time',
                job_title: data.job_title?.id ?? data.job_title_id ?? '',
                base_salary: data.base_salary ?? '',
                commission_rate: data.commission_rate ?? '',
                status: data.status ?? 'active',
                notes: data.notes ?? '',
            });

        }
    }, [isEdit, employeeData, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                phone: data.phone,
                employment_type: data.employment_type,
                status: data.status,
                notes: data.notes,
                job_title_id: parseInt(data.job_title),
                ...(isFreelance
                    ? { commission_rate: parseFloat(data.commission_rate) || 0 }
                    : { base_salary: parseFloat(data.base_salary) || 0 }),
            };
            if (isEdit) {
                await updateEmployee({ id, ...payload });
                toast.success('Employee updated successfully!');
                navigate(`/details/employee/${id}`);

            } else {
                await createEmployee(payload);
                toast.success('Employee created successfully!');
                navigate('/employees');
            }
        } catch {
            console.log(apiError);
            // error is captured in apiError
        }
    };

    if (isEdit && isLoadingInitial) {
        return (
            <div className="flex flex-col h-full bg-surface text-on-surface animate-pulse p-6">
                <div className="h-4 w-32 bg-surface-container-high rounded mb-4" />
                <div className="h-12 bg-surface-container-low rounded-xl mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                    <div className="h-14 bg-surface-container-low rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Employment Type Toggle */}
            <div className="col-span-1 md:col-span-2 mt-2">
                <label className="block text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
                    Employment Type
                </label>
                <div className="relative flex p-1 bg-surface-container-low rounded-xl w-full md:w-1/2">
                    <div
                        className={`absolute left-1 top-1 bottom-1 w-[calc(50%-0.25rem)] bg-surface-container-highest rounded-lg shadow-sm border border-outline-variant/10 z-0 transition-transform duration-300 ease-in-out ${isFreelance ? 'translate-x-[calc(100%+0.125rem)]' : 'translate-x-0'}`}
                    />
                    <button
                        type="button"
                        onClick={() => setValue('employment_type', 'full_time')}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${!isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        Fixed Salary
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('employment_type', 'freelance')}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        Freelance
                    </button>
                </div>
                <input type="hidden" {...register('employment_type')} />
            </div>

            {/* Main fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Employee Name"
                    type="text"
                    placeholder="Full name"
                    {...register('name', { required: 'Employee name is required' })}
                    error={errors.name?.message}
                />

                <Input
                    label="Phone"
                    type="text"
                    placeholder="+20 10 ..."
                    {...register('phone')}
                    error={errors.phone?.message}
                />

                <Select
                    label="Job Title"
                    type="text"
                    options={jobTitles ? jobTitles.map((jobTitle) => ({
                        value: jobTitle.id,
                        label: jobTitle.name,
                    })) : []}
                    placeholder="e.g. Media Buyer"
                    {...register('job_title')}
                    error={errors.job_title?.message}
                />

                {isFreelance ? (
                    <div className="w-full">
                        <Input
                            label="Commission Rate (%)"
                            type="number"
                            placeholder="e.g. 10"
                            {...register('commission_rate', {
                                required: isFreelance ? 'Commission rate is required' : false,
                                min: { value: 0, message: 'Must be ≥ 0' },
                                max: { value: 100, message: 'Must be ≤ 100' },
                            })}
                            error={errors.commission_rate?.message}
                        />
                        <p className="text-xs text-outline mt-2 font-medium">
                            This percentage is deducted from task revenue for the company.
                        </p>
                    </div>
                ) : (
                    <>
                        <Input
                            label="Base Salary"
                            type="number"
                            placeholder="e.g. 6000"
                            {...register('base_salary', {
                                required: !isFreelance ? 'Base salary is required' : false,
                                min: { value: 0, message: 'Must be ≥ 0' },
                            })}
                            error={errors.base_salary?.message}
                        />
                        <Select
                            label="Work Type"
                            options={workType}
                            placeholder="Select Work Type"
                            {...register('employment_type', {
                                required: !isFreelance ? 'Work type is required' : false,
                            })}
                            error={errors.employment_type?.message}
                        />
                    </>


                )}
            </div>

            <Select
                label="Employee Status"
                options={EmployeeeState}
                placeholder="Select Employee Status"
                {...register('status')}
                error={errors.status?.message}
            />

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

                            {isEdit ? 'Update Employee' : 'Save Employee'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;