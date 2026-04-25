import React from 'react';

// بيستقبل عدد العواميد والصفوف اللي عايز ترسمهم
const TableSkeleton = ({ cols = 5, rows = 4 }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <td key={colIndex} className="py-4 px-2 border-b border-surface-container-high/50">
                            <div className="h-3 w-3/4 bg-surface-container-high rounded" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default TableSkeleton;