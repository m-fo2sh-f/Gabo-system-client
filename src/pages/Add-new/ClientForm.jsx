import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { paymentCycleOptions, clientStatusOptions, socialMediaOptions } from '../../constants/FormConstants';
import { IoMdAddCircleOutline } from "react-icons/io";

const ClientForm = () => {

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // 2. استخدام useFieldArray عشان السوشيال ميديا (Multiple Inputs)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "social_links"
    });

    const onSubmit = (data) => {
        console.log("Data ready for Laravel:", data);
        // axios.post('/api/clients', data);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* الحقول الأساسية مع الـ Validation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Client Name"
                    type="text"
                    placeholder="Client Name"
                    {...register("name", { required: "Client Name is required" })}
                    error={errors.name?.message}
                />

                <Input
                    label="Brand Name"
                    type="text"
                    placeholder="Brand Name"
                    {...register("brand_name")}
                    error={errors.brand_name?.message}
                />

                <Input
                    label="Address"
                    type="text"
                    placeholder="Address"
                    {...register("address")}
                    error={errors.address?.message}
                />

                <Input
                    label="Phone"
                    type="text"
                    placeholder="Phone"
                    {...register("phone", { required: "Phone is required" })}
                    error={errors.phone?.message}

                />

                <Input
                    label="Contract Start Date"
                    type="date"
                    {...register("contract_start_date")}
                    error={errors.contract_start_date?.message}
                />

                <Input
                    label="Contract Value"
                    type="number"
                    placeholder="0.00"
                    {...register("contract_value")}
                    error={errors.contract_value?.message}
                />

                <Select
                    label="Payment Cycle"
                    options={paymentCycleOptions}
                    placeholder="Select Payment Cycle"
                    {...register("payment_cycle")}
                    error={errors.payment_cycle?.message}
                />

                <Select
                    label="Client Status"
                    placeholder="Select Client Status"
                    options={clientStatusOptions}
                    {...register("status")}
                    error={errors.status?.message}
                />
            </div>

            <div className="flex items-center justify-between mb-4">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Social Media Links</label>
                <button
                    type="button"
                    onClick={() => append({ platform: '', url: '' })}
                    className="text-sm text-primary font-semibold hover:text-primary-container transition-colors flex items-center gap-1 cursor-pointer"
                >
                    <span className="text-[18px]"><IoMdAddCircleOutline /></span>
                    Add Link
                </button>
            </div>


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
                        className="text-error/60 hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors cursor-pointer"
                        title="Remove link"
                    >
                        <span className="material-symbols-outlined text-[20px]">Delete</span>
                    </button>

                </div>
            ))}


            <Input
                label="Notes"
                type="textarea"
                placeholder="Enter any additional notes here..."
                rows={5}
                {...register("notes")}
            />

            {/* Submit button*/}
            <div className="flex justify-end pt-4">
                <button type="submit" className="primary-btn" >
                    <span className="material-symbols-outlined text-[18px]">save</span>

                </button>
            </div>

        </form >
    );
};

export default ClientForm;