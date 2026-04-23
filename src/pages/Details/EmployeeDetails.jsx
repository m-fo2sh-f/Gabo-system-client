import { useState } from 'react';
import {
    MdChevronLeft, MdDelete, MdEdit, MdCall,
    MdBadge, MdWorkHistory, MdClose,
} from "react-icons/md";

import DeleteModel from "../../components/common/DeleteModel";

import toast from 'react-hot-toast';

import { useNavigate, useParams } from 'react-router-dom';
import { useEmployee, useDeleteEmployee } from '../../hooks/api/useEmployees';

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, isLoading, isError, error } = useEmployee(id);
    const employee = data?.data ?? data;

    const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

    const handleDelete = async () => {
        try {
            await deleteEmployee(id);
            toast.success('Employee deleted successfully');
            navigate('/employees');
        } catch (error) {
            setShowDeleteModal(false);
            toast.error(error?.response?.data?.message ?? 'Failed to delete employee. It might be linked to other records.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'paused': return 'bg-amber-400/10 text-amber-600 border-amber-400/20';
            case 'stopped': return 'bg-error/10 text-error border-error/20';
            default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant/20';
        }
    };

    const getStatusDot = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-500';
            case 'paused': return 'bg-amber-400';
            case 'stopped': return 'bg-error';
            default: return 'bg-outline';
        }
    };

    const initials = employee?.name
        ? employee.name
            .trim()
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : '??';

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
                <p className="text-lg font-medium">Failed to load employee</p>
                <p className="text-sm text-error">{error?.response?.data?.message ?? error?.message}</p>
                <button onClick={() => navigate('/employees')} className="primary-btn mt-2">
                    <MdChevronLeft /> Back to Employees
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface text-on-surface">
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Back button */}
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="primary-btn w-full md:w-40 md:float-right mt-5"
                    >
                        <MdChevronLeft className="text-[18px] md:text-[20px]" />
                        <span>Back</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mt-5">
                    {/* Profile Card */}
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-surface-container-highest mb-6 overflow-hidden ghost-border shadow-[0_10px_20px_rgba(19,27,46,0.03)] flex items-center justify-center text-3xl font-headline font-bold text-secondary">
                            {initials}
                        </div>
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">{employee?.name}</h2>
                        <p className="font-body text-on-surface-variant text-sm mb-6">
                            {employee?.job_title?.name ?? employee?.job_title ?? 'No Job Title'}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <div className={`px-4 py-1.5 border rounded-full font-label text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyle(employee?.status)}`}>
                                <span className={`w-2 h-2 rounded-full ${getStatusDot(employee?.status)}`} />
                                {employee?.status ?? 'Unknown'}
                            </div>
                            <div className="px-4 py-1.5 bg-secondary-container/40 text-on-secondary-container border border-secondary-container rounded-full font-label text-xs font-semibold uppercase tracking-wider">
                                {employee?.employment_type}
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Middle */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        {/* Personal Info */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between">
                            <div>
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-6">Personal Info</h3>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdCall className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Phone Number</p>
                                        <p className="font-body text-on-surface font-medium">{employee?.phone ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center shrink-0">
                                        <MdBadge className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Job Title</p>
                                        <p className="font-body text-on-surface font-medium">
                                            {employee?.job_title?.name ?? employee?.job_title ?? '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider mb-4 relative z-10">
                                Employment Details
                            </h3>
                            <div className="mb-4 relative z-10">
                                {employee?.employment_type === 'freelance' ? (
                                    <>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Commission Rate</p>
                                        <p className="font-headline text-4xl font-extrabold text-primary">
                                            {employee?.commission_rate ?? 0}%
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-label text-xs text-on-surface-variant mb-1">Monthly Salary</p>
                                        <p className="font-headline text-4xl font-extrabold text-primary">
                                            ${parseFloat(employee?.base_salary ?? 0).toLocaleString()}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {employee?.notes && (
                        <div className="md:col-span-12 bg-surface-container-low rounded-xl p-6 md:p-8 ghost-border">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6">
                                <h3 className="font-label text-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                                    <MdWorkHistory className="text-[18px]" />
                                    Notes
                                </h3>
                            </div>
                            <div className="bg-surface rounded-lg p-6 ghost-border min-h-[100px]">
                                <p className="font-body text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                                    {employee.notes}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="md:flex md:justify-between gap-5 mt-5">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="error-btn w-full mt-0 flex items-center justify-center gap-2"
                    >
                        <MdDelete className="text-[18px] md:text-[20px]" />
                        <span>Delete Employee</span>
                    </button>
                    <button
                        onClick={() => navigate(`/edit/employee/${id}`)}
                        className="primary-btn w-full mt-5 md:mt-0 flex items-center justify-center gap-2"
                    >
                        <MdEdit className="text-[18px] md:text-[20px]" />
                        <span>Edit Employee</span>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteModel
                    setShowDeleteModal={setShowDeleteModal}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={employee?.name}
                />
            )}

        </div>
    );
};

export default EmployeeDetails;