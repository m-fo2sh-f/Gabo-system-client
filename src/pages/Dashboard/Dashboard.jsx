import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <header className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div>
                    <h2 className="font-headline text-3xl font-extrabold text-on-surface">Overview</h2>
                    <p className="text-on-surface-variant text-sm font-body">Welcome back! Here's what's happening today in Canvas Agency.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-sm font-bold border border-outline-variant/20 hover:bg-surface-container-highest transition-colors">
                        Download Report
                    </button>
                    <button className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Project
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Clients', value: '24', icon: 'groups', color: 'text-primary' },
                    { label: 'Monthly Revenue', value: 'EGP 45,200', icon: 'payments', color: 'text-success' },
                    { label: 'Pending Tasks', value: '12', icon: 'assignment', color: 'text-warning' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-on-surface-variant font-medium mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-on-surface">{stat.value}</h4>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center ${stat.color}`}>
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-6 min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-headline text-lg font-bold text-on-surface">Recent Projects</h4>
                        <button className="text-primary text-sm font-bold">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-outline-variant/5">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    P{i}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Project Alpha {i}</p>
                                    <p className="text-xs text-on-surface-variant">Client: TechCorp Inc.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-primary">In Progress</p>
                                    <div className="w-24 h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-primary w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-6 min-h-[300px]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-headline text-lg font-bold text-on-surface">Upcoming Deadlines</h4>
                        <button className="text-primary text-sm font-bold">Manage Tasks</button>
                    </div>
                    <div className="space-y-4 text-center py-12 opacity-40">
                        <span className="material-symbols-outlined text-4xl">event_upcoming</span>
                        <p className="text-sm font-medium">No urgent deadlines for today</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
