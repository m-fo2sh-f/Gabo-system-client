import { useState, } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/common/input';
import Select from '../../components/common/select';
import { taskTypeOptions, taskStatusOptions } from '../../constants/FormConstants';


const TaskForm = () => {


    // todo api
    // get clients
    // get employees

    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            cost: 0,
        }
    });

    const onSubmit = (data) => {
        console.log("Data ready for Laravel:", data);
        // axios.post('/api/clients', data);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Client Name"
                    options={clients}
                    placeholder="Client Name"
                    {...register("name", { required: "Client Name is required" })}
                    error={errors.name?.message}
                />

                <Select
                    label="Employee Name"
                    options={employees}
                    placeholder="Employee Name"
                    {...register("employee_name")}
                    error={errors.employee_name?.message}
                />

                <Select
                    label="Task Type"
                    options={taskTypeOptions}
                    placeholder="Task Type"
                    {...register("task_type")}
                    error={errors.task_type?.message}
                />

                <Select
                    label="Task Status"
                    options={taskStatusOptions}
                    {...register("status")}
                    error={errors.status?.message}
                />
                <Input
                    label="Price"
                    type="number"
                    placeholder="Price"
                    {...register("price", { required: "Price is required" })}
                    error={errors.price?.message}
                />

                <Input
                    label="Cost"
                    type="number"
                    placeholder="Cost Default  e.g 0"
                    defaultValue={0}
                    {...register("cost")}
                />
            </div>
            <Input
                label="Notes"
                type="textarea"
                placeholder="Enter any additional notes here..."
                rows={5}
                {...register("notes")}
            />
            {/* زرار الحفظ */}
            <div className="flex justify-end pt-4">
                <button type="submit" className="primary-btn" >
                    <span className="material-symbols-outlined text-[18px]">save</span>

                </button>
            </div>
        </form >
    );
};

export default TaskForm;