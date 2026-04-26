import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { EmployeeeState, workType } from '../../constants/FormConstants.jsx';
import { useCreateEmployee, useUpdateEmployee, useEmployee } from '../../hooks/api/useEmployees';
import { MdSave } from "react-icons/md";
import useJobTitles from '../../hooks/api/useJobTitles';

const EmployeeForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const [isFreelance, setIsFreelance] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: jobTitlesData } = useJobTitles();
    const jobTitles = jobTitlesData?.data ?? jobTitlesData;


    const { mutateAsync: createEmployee, isPending: isCreating, error: createError } = useCreateEmployee();
    const { mutateAsync: updateEmployee, isPending: isUpdating, error: updateError } = useUpdateEmployee();
    const { data: employeeData, isLoading: isLoadingInitial } = useEmployee(id, {}, { enabled: isEdit });
    const employee = employeeData?.data?.employee ?? {};



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



    useEffect(() => {
        if (isEdit && employeeData?.data) {
            const data = employeeData.data;
            if (employee.employment_type === 'freelance') {
                setIsFreelance(true);
            } else {
                setIsFreelance(false);
            }
            reset({

                name: employee.name ?? '',
                phone: employee.phone ?? '',
                employment_type: employee.employment_type ?? 'full_time',
                job_title: employee.job_title?.id ?? data.job_title_id ?? '',
                base_salary: employee.base_salary ?? '',
                commission_rate: employee.commission_rate ?? '',
                status: employee.status ?? 'active',
                notes: employee.notes ?? '',
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
                toast.success(t('forms.employee.update_success'));
                navigate(`/details/employee/${id}`);

            } else {
                await createEmployee(payload);
                toast.success(t('forms.employee.create_success'));
                navigate('/employees');
            }
        } catch {
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
            <div className="col-span-1 md:col-span-2 mt-2" dir="ltr">
                <label className="block text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider" dir="rtl" style={{ direction: 'inherit' }}>
                    {t('forms.employee.employment_type')}
                </label>
                <div className="relative flex p-1 bg-surface-container-low rounded-xl w-full md:w-1/2" dir="ltr">
                    <div
                        className={`absolute left-1 top-1 bottom-1 w-[calc(50%-0.25rem)] bg-surface-container-highest rounded-lg shadow-sm border border-outline-variant/10 z-0 transition-transform duration-300 ease-in-out ${isFreelance ? 'translate-x-[calc(100%+0.125rem)]' : 'translate-x-0'}`}
                    />
                    <button
                        type="button"
                        onClick={() => {

                            setIsFreelance(false);
                            setValue('employment_type', '', { shouldValidate: true });

                        }}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${!isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        {t('forms.employee.fixed_salary')}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsFreelance(true);
                            // هنا بنجبر الفورم إن قيمة الحقل تكون freelance برمجياً بدون hidden input
                            setValue('employment_type', 'freelance', { shouldValidate: true });
                        }}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        {t('forms.employee.freelance')}
                    </button>
                </div>
                {/* <input type="hidden" {...register('employment_type')} /> */}
            </div>

            {/* Main fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t('forms.employee.name')}
                    type="text"
                    placeholder="Full name"
                    {...register('name', { required: t('forms.validation.required') })}
                    error={errors.name?.message}
                />

                <Input
                    label={t('forms.employee.phone')}
                    type="text"
                    placeholder="+20 10 ..."
                    {...register('phone')}
                    error={errors.phone?.message}
                />

                <Select
                    label={t('forms.employee.job_title')}
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
                            label={t('forms.employee.commission')}
                            type="text"
                            inputMode="numeric"
                            placeholder="10%"
                            {...register('commission_rate', {
                                required: isFreelance ? t('forms.validation.required') : false,
                                min: { value: 0, message: t('forms.validation.min_zero') },
                                max: { value: 100, message: 'Must be ≤ 100' },
                                pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                            })}
                            error={errors.commission_rate?.message}
                        />
                        <p className="text-xs text-outline mt-2 font-medium">
                            {t('forms.employee.commission_note')}
                        </p>
                    </div>
                ) : (
                    <>
                        <Input
                            label={t('forms.employee.base_salary')}
                            type="text"
                            inputMode="numeric"
                            placeholder="6000 EGP"
                            {...register('base_salary', {
                                required: !isFreelance ? t('forms.validation.required') : false,
                                min: { value: 0, message: t('forms.validation.min_zero') },
                                pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                            })}
                            error={errors.base_salary?.message}
                        />
                        <Select
                            label={t('forms.employee.work_type')}
                            options={workType.map(opt => ({ ...opt, label: t(`options.work_type.${opt.value}`) }))}
                            placeholder={t('forms.employee.work_type')}
                            {...register('employment_type', {

                                required: !isFreelance ? t('forms.validation.required') : false
                            })}
                            error={errors.employment_type?.message}
                        />
                    </>


                )}
            </div>

            <Select
                label={t('common.status')}
                options={EmployeeeState.map(opt => ({ ...opt, label: t(`options.status.${opt.value}`) }))}
                placeholder={t('common.status')}
                {...register('status')}
                error={errors.status?.message}
            />

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
                            {isEdit ? t('forms.employee.update_btn') : t('forms.employee.save_btn')}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;
