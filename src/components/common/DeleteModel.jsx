import { MdClose, MdDelete } from 'react-icons/md'

// 👇 ضفنا name هنا في الـ Destructuring
const DeleteModel = ({ setShowDeleteModal, handleDelete, isDeleting, name }) => {
    return (
        // 👇 ضفنا كلمة fixed في الأول هنا
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-xl p-6 md:p-8 ghost-border w-full max-w-md shadow-xl">
                <h3 className="font-label text-xl font-bold text-on-surface mb-2">Delete</h3>
                <p className="font-body text-on-surface-variant mb-2">
                    {/* 👇 عرضنا الـ name جوه الـ span */}
                    Are you sure you want to delete <span className="font-semibold text-on-surface">{name}</span>?
                </p>
                <p className="text-xs text-error/70 mb-6">This action cannot be undone.</p>
                
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="primary-btn flex-1"
                        disabled={isDeleting}
                    >
                        <MdClose /> Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="error-btn flex-1 flex items-center justify-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <><MdDelete /> Delete</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModel;