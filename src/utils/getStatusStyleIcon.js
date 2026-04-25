const getStatusStyle = (status) => {
    switch (status) {
        case "pending":
        case "paused": return 'bg-amber-400/10 text-amber-600 border-amber-400/20';
        case "completed":
        case "active": return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
        case 'cancelled':
        case "stopped": return 'bg-error/10 text-error border-error/20';
        default: return 'bg-surface-container-high text-on-surface-variant border-outline-variant/20';
    }
};

const getStatusDot = (status) => {
    switch (status) {
        case "completed":
        case "active": return 'bg-emerald-500';
        case "pending":
        case "paused": return 'bg-amber-400';
        case 'cancelled':
        case "stopped": return 'bg-error';
        default: return 'bg-outline';
    }
};

export { getStatusStyle, getStatusDot };