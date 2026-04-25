export const formatCategory = (category) => (category ?? '').replace(/_/g, ' ');

export const formatPaymentMethod = (method) => (method ?? '').replace(/_/g, ' ');

export const getTypeStyle = (type) => {
    return type === 'income'
        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
        : 'bg-error/10 text-error border border-error/20';
};