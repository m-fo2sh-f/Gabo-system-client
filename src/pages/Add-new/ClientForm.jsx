import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { MdSave } from "react-icons/md";
import { paymentCycleOptions, clientStatusOptions, socialMediaOptions } from '../../constants/FormConstants.jsx';
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useCreateClient, useUpdateClient, useClient } from '../../hooks/api/useClients';

const ClientForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const [oldClient, setOldClient] = useState(false)
    const navigate = useNavigate();
    const { t } = useTranslation();



    const { mutateAsync: createClient, isPending: isCreating, error: createError } = useCreateClient();
    const { mutateAsync: updateClient, isPending: isUpdating, error: updateError } = useUpdateClient();
    const { data: clientData, isLoading: isLoadingInitial } = useClient(id, {}, { enabled: isEdit });


    const isPending = isCreating || isUpdating;
    const apiError = createError || updateError;

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            status: 'active',
            social_links: [],
            is_late: false,
        }
    });
    const isLate = watch('is_late');

    useEffect(() => {
        if (isEdit && clientData?.data) {

            const data = clientData.data.client;
            reset({
                name: data.name ?? '',
                brand_name: data.brand_name ?? '',
                address: data.address ?? '',
                phone: data.phone ?? '',
                contract_start_date: data.contract_start_date ? data.contract_start_date.split('T')[0] : '', // format date if needed
                contract_value: data.contract_value ?? '',
                payment_cycle: data.payment_cycle ?? '',
                next_payment_date: data.next_payment_date ? data.next_payment_date.split('T')[0] : '', // format date if needed
                late_amount: data.late_amount ?? '',
                is_late: data.is_late ?? false,
                status: data.status ?? 'active',
                notes: data.notes ?? '',
                social_links: data.social_links ?? [],
            });
            if (data.next_payment_date !== null) {
                setOldClient(true);
            }
        }
    }, [isEdit, clientData, reset]);

    const { fields, append, remove } = useFieldArray({ control, name: 'social_links' });

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                phone: data.phone,
                brand_name: data.brand_name || null,
                address: data.address || null,
                contract_start_date: data.contract_start_date || null,
                contract_value: data.contract_value ? parseFloat(data.contract_value) : null,
                payment_cycle: data.payment_cycle || null,
                status: data.status || 'active',
                notes: data.notes || null,
                social_links: (data.social_links ?? []).filter(l => l.platform && l.url),
                ...(oldClient ? {
                    next_payment_date: data.next_payment_date || null,
                    is_late: data.is_late || false,
                    late_amount: data.is_late ? (parseFloat(data.late_amount) || 0) : 0,
                } : {})
            };

            if (isEdit) {
                await updateClient({ id, ...payload });
                toast.success(t('forms.client.update_success'));
                navigate(`/details/client/${id}`);

            } else {
                // await createClient(payload);
                // toast.success(t('forms.client.create_success'));
                // navigate('/clients');
                console.log(payload)

            }
        } catch {
            // error captured in apiError
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
            {/* Main Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label={t('forms.client.name')}
                    type="text"

                    placeholder={t('forms.client.name')}
                    {...register('name', { required: t('forms.validation.required') })}
                    error={errors.name?.message}
                />
                <Input
                    label={t('forms.client.brand')}
                    type="text"
                    placeholder={t('forms.client.brand')}
                    {...register('brand_name')}
                    error={errors.brand_name?.message}
                />
                <Input
                    label={t('forms.client.address')}
                    type="text"
                    placeholder={t('forms.client.address')}
                    {...register('address')}
                    error={errors.address?.message}
                />
                <Input
                    label={t('forms.client.phone')}
                    type="text"
                    placeholder="+20 10 ..."
                    {...register('phone', { required: t('forms.validation.required') })}
                    error={errors.phone?.message}
                />
                <Input
                    label={t('forms.client.contract_start')}
                    type="date"
                    {...register('contract_start_date', { required: t('forms.validation.required') })}
                    error={errors.contract_start_date?.message}
                />
                <Input
                    label={t('forms.client.contract_value')}
                    type="text"
                    inputMode="numeric"
                    placeholder="5000 EGP"
                    {...register('contract_value', {
                        required: t('forms.validation.required'),
                        min: { value: 0, message: t('forms.validation.min_zero') },
                        pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                    })}
                    error={errors.contract_value?.message}
                />
                <Select
                    label={t('forms.client.payment_cycle')}
                    options={paymentCycleOptions.map(opt => ({ ...opt, label: t(`options.payment_cycle.${opt.label}`) }))}
                    placeholder={t('forms.client.payment_cycle')}
                    {...register('payment_cycle', { required: t('forms.validation.required') })}
                    error={errors.payment_cycle?.message}
                />
                <Select
                    label={t('common.status')}
                    placeholder={t('common.status')}
                    options={clientStatusOptions.map(opt => ({ ...opt, label: t(`options.status.${opt.value}`) }))}
                    {...register('status', { required: t('forms.validation.required') })}
                    error={errors.status?.message}
                />
                <div className="col-span-1 md:col-span-2 mt-2" dir="ltr">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider" style={{ direction: 'inherit' }}>
                        {t('forms.client.client_type')}
                    </label>
                    <div className="relative flex p-1 bg-surface-container-low rounded-xl w-full md:w-1/2" dir="ltr">
                        <div
                            className={`absolute left-1 top-1 bottom-1 w-[calc(50%-0.25rem)] bg-surface-container-highest rounded-lg shadow-sm border border-outline-variant/10 z-0 transition-transform duration-300 ease-in-out ${oldClient ? 'translate-x-[calc(100%+0.125rem)]' : 'translate-x-0'}`}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setOldClient(false)

                            }}
                            className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${!oldClient ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                        >
                            {t('forms.client.new_client')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOldClient(true)

                            }}
                            className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${oldClient ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                        >
                            {t('forms.client.old_client')}
                        </button>
                    </div>
                </div>

                {oldClient && (
                    <>
                        <Input
                            label={t('forms.client.next_payment')}
                            type="date"
                            {...register('next_payment_date', { required: t('forms.validation.required') })}
                            error={errors.next_payment_date?.message}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isLate}
                                id="is_late"
                                className="mt-7 w-6 h-6 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                {...register('is_late')}
                            />
                            <label htmlFor="is_late" className="mt-7 text-sm font-medium text-on-surface-variant">
                                {t('forms.client.is_late')}
                            </label>
                        </div>
                    </>
                )}


                {oldClient && isLate && (
                    <Input
                        label={t('forms.client.late_amount')}
                        type="text"
                        inputMode="numeric"
                        placeholder="0 EGP"
                        {...register('late_amount', {
                            required: t('forms.validation.required'),
                            min: { value: 0, message: t('forms.validation.min_zero') },
                            pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: t('forms.validation.invalid_number') }
                        })}
                        error={errors.late_amount?.message}
                    />
                )}
            </div>

            {/* Social Links */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        {t('forms.client.social_links')}
                    </label>
                    <button
                        type="button"
                        onClick={() => append({ platform: '', url: '' })}
                        className="text-sm text-primary font-semibold hover:text-primary-container transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <span className="text-[18px]"><IoMdAddCircleOutline /></span>
                        {t('forms.client.add_link')}
                    </button>
                </div>
                <div className="space-y-3">
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-3 items-center">
                            <div className="w-1/3">
                                <Select
                                    options={socialMediaOptions}
                                    placeholder={t('forms.client.platform')}
                                    {...register(`social_links.${index}.platform`)}
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="https://..."
                                    {...register(`social_links.${index}.url`)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-error/60 hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors cursor-pointer shrink-0"
                                title="Remove link"
                            >
                                <MdDelete className="text-[20px]" />
                            </button>
                        </div>
                    ))}
                </div>
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
                            {isEdit ? t('forms.client.update_btn') : t('forms.client.save_btn')}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ClientForm;
