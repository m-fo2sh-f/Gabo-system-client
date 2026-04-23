
import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

const Pagination = ({ meta, setPage }) => {
    return (
        <div className="flex items-center justify-between pt-6 mt-2">
            <span className="text-sm text-on-surface-variant">
                Showing <span className="font-medium text-on-surface">{meta?.length}</span> of <span className="font-medium text-on-surface">{meta?.total}</span> items
            </span>

            <div className="flex items-center gap-1">
                {/* زرار السابق */}
                <button
                    onClick={() => setPage(old => Math.max(old - 1, 1))}
                    disabled={meta.current_page === 1}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MdKeyboardArrowLeft className="text-[20px]" />
                </button>

                {/* رقم الصفحة الحالية */}
                <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center justify-center">
                    {meta.current_page}
                </button>

                {/* زرار التالي */}
                <button
                    onClick={() => setPage(old => (!meta.last_page || old === meta.last_page ? old : old + 1))}
                    disabled={meta.current_page === meta.last_page || !meta.last_page}
                    className="p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MdKeyboardArrowRight className="text-[20px]" />
                </button>
            </div>
        </div >

    )
}
export default Pagination