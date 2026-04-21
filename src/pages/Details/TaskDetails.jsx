import { useState } from 'react';
import {
    MdChevronLeft, MdDelete, MdCalendarToday, MdEdit,
    MdPerson, MdBusiness, MdAssignment, MdStickyNote2, MdClose
} from "react-icons/md";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTask, useDeleteTask } from '../../hooks/api/useTasks';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, isLoading, isError, error } = useTask(id);
    const task = data?.data ?? data;

    const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

    const handleDelete = async () => {
        try {
            await deleteTask(id);
            navigate('/tasks');
        } catch {
            setShowDeleteModal(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-primary/10 text-primary border-primary/20';
            case 'pending': return 'bg-secondary-container text-on-secondary-container border-secondary-container/50';
            case 'cancelled': return 'bg-error/10 text-error border-error/20';
            default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant/20';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'completed': return 'bg-primary';
            case 'pending': return 'bg-secondary animate-pulse';
            case 'cancelled': return 'bg-error';
            default: return 'bg-outline';
        }
    };

    const profit = parseFloat(task?.price ?? 0) - parseFloat(task?.cost ?? 0);

    if (isLoading) {
        return (
            <div className="flex flex-col h-full bg-surface text-on-surface animate-pulse">
                <div className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col mt-8 gap-6">
                    <div className="h-10 w-36 bg-surface-container-high rounded-xl ml-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 h-64" />
                        <div className="md:col-span-8 grid grid-cols-2 gap-6">
                            <div className="bg-surface-container-low rounded-xl h-48" />
                            <div className="bg-surface-container-low rounded-xl h-48" />
                        </div>
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl h-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[60px] text-error/50">error</span>
                <p className="text-lg font-medium">Failed to load task</p>
                <p className="text-sm text-error">{error?.response?.data?.message ?? error?.message}</p>
                <button onClick={() => navigate('/tasks')} className="primary-btn mt-2">
                    <MdChevronLeft /> Back to Tasks
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back */}
                <div>
                    <button onClick={() => navigate(-1)} className="primary-btn w-full md:w-40 md:float-right mt-5">
                        <MdChevronLeft className="text-[18px] md:text-[20px]" />
                        <span>Back</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Task Overview Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-secondary-container/50 mb-6 flex items-center justify-center text-on-secondary-container shadow-inner">
                            <MdAssignment className="text-4xl" />
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-2 capitalize">
                            {task?.task_type?.name ?? task?.task_type ?? 'Task'}
                        </h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">Task Type</p>
                        <div className={`px-5 py-2 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(task?.status)}`}>
                            <span className={`w-2 h-2 rounded-full ${getStatusDot(task?.status)}`} />
                            {task?.status ?? 'Unknown'}
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Assignment Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Assignment Details</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBusiness className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Client / Brand</p>
                                        {task?.client ? (
                                            <Link to={`/details/client/${task.client.id}`} className="font-body text-primary font-medium hover:underline">
                                                {task.client.name}
                                            </Link>
                                        ) : <p className="font-body text-on-surface font-medium">—</p>}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdPerson className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Assigned Employee</p>
                                        {task?.employee ? (
                                            <Link to={`/details/employee/${task.employee.id}`} className="font-body text-primary font-medium hover:underline">
                                                {task.employee.name}
                                            </Link>
                                        ) : <p className="font-body text-on-surface font-medium">Unassigned</p>}
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCalendarToday className="text-secondary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Start Date</p>
                                        <p className="font-body text-on-surface font-medium">
                                            {task?.start_date
                                                ? new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Card */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6 relative z-10">Financial Overview</h3>
                            <div className="mb-4 relative z-10">
                                <p className="font-label text-xs text-on-surface-variant mb-1">Price</p>
                                <p className="font-headline text-4xl font-extrabold text-emerald-600">
                                    ${parseFloat(task?.price ?? 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Cost</p>
                                    <p className="font-body text-error font-medium">${parseFloat(task?.cost ?? 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="font-label text-xs text-on-surface-variant mb-1">Gross Profit</p>
                                    <p className={`font-body font-medium ${profit >= 0 ? 'text-primary' : 'text-error'}`}>
                                        ${profit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {task?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                    <MdStickyNote2 className="text-[18px]" />
                                    Task Notes & Requirements
                                </h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{task.notes}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="md:flex md:justify-between gap-5 mt-5">
                    <button onClick={() => setShowDeleteModal(true)} className="error-btn w-full flex items-center justify-center gap-2">
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span>Delete Task</span>
                    </button>
                    <button onClick={() => navigate(`/edit/task/${id}`)} className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2">
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>Edit Task</span>
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`${showDeleteModal ? 'fixed' : 'hidden'} inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
                <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md shadow-xl">
                    <h3 className="font-label text-xl font-bold text-on-surface mb-2">Delete Task</h3>
                    <p className="font-body text-on-surface-variant mb-2">Are you sure you want to delete this task?</p>
                    <p className="text-xs text-error/70 mb-6">This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setShowDeleteModal(false)} className="primary-btn flex-1" disabled={isDeleting}>
                            <MdClose /> Cancel
                        </button>
                        <button onClick={handleDelete} className="error-btn flex-1 flex items-center justify-center gap-2" disabled={isDeleting}>
                            {isDeleting ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                            ) : (
                                <><MdDelete /> Delete</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;