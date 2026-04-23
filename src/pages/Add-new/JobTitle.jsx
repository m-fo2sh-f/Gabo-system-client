import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../components/common/input'
import useJobTitles, { useCreateJobTitle, useDeleteJobTitle } from '../../hooks/api/useJobTitles'
import toast from 'react-hot-toast'
import DeleteModel from "../../components/common/DeleteModel";
import { MdDelete, MdPersonSearch } from 'react-icons/md'

const JobTitle = () => {
    const [deletingItem, setDeletingItem] = useState(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const { mutateAsync: createJobTitle, isPending: isCreating, error: createError, } = useCreateJobTitle();
    const { mutateAsync: deleteJobTitle, isPending: isDeleting } = useDeleteJobTitle();
    const { data: jobTitlesData, isLoading: isListLoading, refetch: listRefetch } = useJobTitles();

    const jobTitleList = jobTitlesData?.data ?? [];
    const isPending = isCreating;
    const apiError = createError;

    useEffect(() => {
        reset({ name: '' });
    }, [reset]);

    const onSubmit = async (data) => {
        try {
            await createJobTitle(data);
            toast.success('Job title created successfully!');
            listRefetch();
            reset(); // Clear form after addition
        } catch {
            // Error is handled in UI
        }
    }

    const handleDelete = async () => {
        try {
            await deleteJobTitle(deletingItem.id);
            toast.success('Job title deleted successfully!');
            setDeletingItem(null);
            listRefetch();
        } catch {
            // Captured in apiError
        }
    }

    const renderSkeletonRows = () =>
        Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                    <div className="h-3 w-32 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden sm:table-cell">
                    <div className="h-3 w-28 bg-surface-container-high rounded" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                    <div className="h-5 w-16 bg-surface-container-high rounded-full" />
                </td>
                <td className="py-4 border-b border-surface-container-high/50 hidden lg:table-cell">
                    <div className="h-3 w-20 bg-surface-container-high rounded ml-auto" />
                </td>
            </tr>
        ));

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Job Title"
                    placeholder="Enter Job Title"
                    disabled={isPending}
                    {...register('name', { required: 'Job title is required' })}
                    error={errors.name?.message}
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
                        className="primary-btn w-full md:w-auto min-w-[120px] flex items-center gap-2 justify-center"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Save Job Title
                            </>
                        )}
                    </button>
                </div>
            </form>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                            <th className="pb-4 font-medium pl-2">ID</th>
                            <th className="pb-4 font-medium pl-2">Job Title</th>
                            <th className="pb-4 font-medium text-center pr-2 w-10">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="font-body text-sm text-on-surface">
                        {isListLoading ? renderSkeletonRows() : jobTitleList.length > 0 ? jobTitleList.map((jobTitle) => (
                            <tr key={jobTitle.id} className="hover:bg-surface-container-high/30 transition-colors group">
                                <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                    <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                        {jobTitle.id}
                                    </span>
                                </td>
                                <td className="py-4 text-secondary border-b border-surface-container-high/50 sm:table-cell">
                                    {jobTitle.name}
                                </td>
                                <td className="py-4 border-b border-surface-container-high/50 text-center pr-2">
                                    <button
                                        onClick={() => setDeletingItem(jobTitle)}
                                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                                        title="Delete Job Title"
                                    >
                                        <MdDelete className="text-[18px]" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="py-12 text-center text-on-surface-variant">
                                    <div className="flex flex-col items-center gap-2">
                                        <MdPersonSearch className="text-[40px] text-outline" />
                                        <p>No job titles found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Delete Confirmation Modal */}
            {deletingItem && (
                <DeleteModel
                    setShowDeleteModal={() => setDeletingItem(null)}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    name={deletingItem.name}
                />
            )}
        </>
    )
}

export default JobTitle