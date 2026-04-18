import React from 'react'
import { useForm } from 'react-hook-form';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { useState, useEffect } from 'react';
import { EmployeeeState } from '../../constants/FormConstants';
const EmployeeForm = () => {
    const [isFreelance, setIsFreelance] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            social_links: [{ platform: 'facebook', url: '' }]
        }
    });

    useEffect(() => {
        setValue("is_freelance", isFreelance);
    }, [isFreelance]);

    const onSubmit = (data) => {
        console.log("Data ready for Laravel:", data);
        // axios.post('/api/clients', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Employment Type Toggle button */}
            <div className="col-span-1 md:col-span-2 mt-2">
                <label className="block text-xs font-semibold text-on-surface-variant mb-3 uppercase tracking-wider">
                    Employment Type
                </label>
                <div className="relative flex p-1 bg-surface-container-low rounded-xl w-full md:w-1/2">
                    {/* Sliding Background */}
                    <div
                        className={`absolute left-1 top-1 bottom-1 w-[calc(50%-0.25rem)] bg-surface-container-highest rounded-lg shadow-sm border border-outline-variant/10 z-0 transition-transform duration-300 ease-in-out ${isFreelance ? 'translate-x-[calc(100%+0.125rem)]' : 'translate-x-0'}`}
                    ></div>
                    <button
                        type="button"
                        onClick={() => setIsFreelance(false)}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${!isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        Fixed Salary
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsFreelance(true)}
                        className={`flex-1 py-2.5 text-sm z-10 relative transition-colors cursor-pointer ${isFreelance ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
                    >
                        Freelance
                    </button>
                </div>
                <input type="hidden" value={isFreelance} {...register("is_freelance")} />
            </div>

            {/* Inputs*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Employee Name"
                    type="text"
                    placeholder="Client Name"
                    {...register("name", { required: "Client Name is required" })}
                    error={errors.name?.message}
                />

                <Input
                    label="Phone"
                    type="text"
                    placeholder="Phone"
                    {...register("phone")}
                    error={errors.phone?.message}
                />

                <Input
                    label="Job Title"
                    type="text"
                    placeholder="Job Title"
                    {...register("job_title")}
                    error={errors.job_title?.message}
                />

                {isFreelance ? (
                    <div className="w-full">
                        <Input
                            label="Commission Rate (%)"
                            type="number"
                            placeholder="e.g."
                            {...register("commission_rate", {
                                required: isFreelance ? "Commission rate is required for freelancers" : false
                            })}
                            error={errors.commission_rate?.message}
                        />
                        <p className="text-xs text-outline mt-2 font-medium">This percentage is deducted from the task revenue for the company.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <Input
                            label="Base Salary"
                            type="number"
                            placeholder="e.g."

                            {...register("base_salary", {
                                required: !isFreelance ? "Base salary is required for fixed employees" : false
                            })}
                            error={errors.base_salary?.message}
                        />
                    </div>
                )}
            </div>

            <Select
                label="Employee Status"
                options={EmployeeeState}
                placeholder="Select Employee Status"
                {...register("employee_status")}
                error={errors.employee_status?.message}
            />

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


export default EmployeeForm