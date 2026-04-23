import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { paymentCycleOptions, clientStatusOptions, socialMediaOptions } from '../../constants/FormConstants.jsx';
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useCreateClient, useUpdateClient, useClient } from '../../hooks/api/useClients';

const ClientForm = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const [oldClient, setOldClient] = useState(false)


    const { mutateAsync: createClient, isPending: isCreating, error: createError } = useCreateClient();
    const { mutateAsync: updateClient, isPending: isUpdating, error: updateError } = useUpdateClient();
    const { data: clientData, isLoading: isLoadingInitial } = useClient(id);

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
            const data = clientData.data;
            reset({
                name: data.name ?? '',
                brand_name: data.brand_name ?? '',
                address: data.address ?? '',
                phone: data.phone ?? '',
                contract_start_date: data.contract_start_date ? data.contract_start_date.split('T')[0] : '', // format date if needed
                contract_value: data.contract_value ?? '',
                payment_cycle: data.payment_cycle ?? '',
                status: data.status ?? 'active',
                notes: data.notes ?? '',
                social_links: data.social_links ?? [],
            });
        }
    }, [isEdit, clientData, reset]);

    const { fields, append, remove } = useFieldArray({ control, name: 'social_links' });

    const onSubmit = async (data) => {
        try {
            const payload = {
                name: data.name,
                phone: data.phone,
                ...(data.brand_name && { brand_name: data.brand_name }),
                ...(data.address && { address: data.address }),
                ...(data.contract_start_date && { contract_start_date: data.contract_start_date }),
                ...(data.contract_value && { contract_value: parseFloat(data.contract_value) }),
                ...(data.payment_cycle && { payment_cycle: data.payment_cycle }),
                ...(data.status && { status: data.status }),
                ...(data.notes && { notes: data.notes }),
                social_links: (data.social_links ?? []).filter(l => l.platform && l.url),
                ...(oldClient ? {
                    next_payment_date: data.next_payment_date || null,
                    is_late: data.is_late || false,
                    late_amount: data.is_late ? (parseFloat(data.late_amount) || 0) : 0,
                } : {})
            };

            if (isEdit) {
                await updateClient({ id, ...payload });
                toast.success('Client updated successfully!');
                navigate(`/details/client/${id}`);
            } else {
                await createClient(payload);
                toast.success('Client created successfully!');
                navigate('/clients');
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
                    label="Client Name"
                    type="text"

                    placeholder="Client Name"
                    {...register('name', { required: 'Client Name is required' })}
                    error={errors.name?.message}
                />
                <Input
                    label="Brand Name"
                    type="text"
                    placeholder="Brand Name"
                    {...register('brand_name')}
                    error={errors.brand_name?.message}
                />
                <Input
                    label="Address"
                    type="text"
                    placeholder="Address"
                    {...register('address')}
                    error={errors.address?.message}
                />
                <Input
                    label="Phone"
                    type="text"
                    placeholder="+20 10 ..."
                    {...register('phone', { required: 'Phone is required' })}
                    error={errors.phone?.message}
                />
                <Input
                    label="Contract Start Date"
                    type="date"
                    {...register('contract_start_date', { required: 'Contract Start Date is required' })}
                    error={errors.contract_start_date?.message}
                />
                <Input
                    label="Contract Value"
                    type="number"
                    placeholder="0.00"
                    {...register('contract_value', { required: 'Contract Value is required', min: { value: 0, message: 'Must be ≥ 0' } })}
                    error={errors.contract_value?.message}
                />
                <Select
                    label="Payment Cycle"
                    options={paymentCycleOptions}
                    placeholder="Select Payment Cycle"
                    {...register('payment_cycle', { required: 'Payment Cycle is required' })}
                    error={errors.payment_cycle?.message}
                />
                <Select
                    label="Client Status"
                    placeholder="Select Client Status"
                    options={clientStatusOptions}
                    {...register('status', { required: 'Client Status is required' })}
                    error={errors.status?.message}
                />
                <div className="col-span-1 md:col-span-2 mt-2">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
                        Client Type
                    </label>
                    <div className="relative flex p-1 bg-surface-container-low rounded-xl w-full md:w-1/2">
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
                            New Client
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOldClient(true)

                            }}
                            className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${oldClient ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Old Client
                        </button>
                    </div>
                </div>

                {oldClient && (
                    <>
                        <Input
                            label="Next Payment Date"
                            type="date"
                            {...register('next_payment_date', { required: 'Next Payment Date is required' })}
                            error={errors.next_payment_date?.message}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_late"
                                className="mt-7 w-6 h-6 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                                {...register('is_late')}
                            />
                            <label htmlFor="is_late" className="mt-7 text-sm font-medium text-on-surface-variant">
                                Is Late
                            </label>
                        </div>
                    </>
                )}


                {oldClient && isLate && (
                    <Input
                        label="Late Amount"
                        type="number"
                        placeholder="Late Amount"
                        {...register('late_amount', { required: 'Late Amount is required' })}
                        error={errors.late_amount?.message}
                    />
                )}
            </div>

            {/* Social Links */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Social Media Links
                    </label>
                    <button
                        type="button"
                        onClick={() => append({ platform: '', url: '' })}
                        className="text-sm text-primary font-semibold hover:text-primary-container transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        <span className="text-[18px]"><IoMdAddCircleOutline /></span>
                        Add Link
                    </button>
                </div>
                <div className="space-y-3">
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-3 items-center">
                            <div className="w-1/3">
                                <Select
                                    options={socialMediaOptions}
                                    placeholder="Platform"
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
                            {isEdit ? 'Update Client' : 'Save Client'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ClientForm;