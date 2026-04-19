import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { MdOutlineAccountBalanceWallet, MdTrendingUp, MdTrendingDown, MdAssignment, MdPeopleAlt, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
const monthlyData = [
    { name: 'Jan', income: 4000, expense: 2400 },
    { name: 'Feb', income: 4500, expense: 2800 },
    { name: 'Mar', income: 3800, expense: 2100 },
    { name: 'Apr', income: 5200, expense: 2900 },
    { name: 'May', income: 6100, expense: 3100 },
    { name: 'Jun', income: 5900, expense: 2800 },
    { name: 'Jul', income: 7200, expense: 3200 },
];

const expenseData = [
    { name: 'Salary', value: 5000, color: 'var(--primary)' },
    { name: 'Ads', value: 3000, color: 'var(--secondary)' },
    { name: 'Rent', value: 2000, color: 'var(--tertiary)' },
    { name: 'Other', value: 1000, color: 'var(--error)' },
];

const recentTransactions = [
    { id: 1, type: "income", category: "task_payment", amount: 1200, date: "Oct 15, 2023", related_to: "Acme Corp" },
    { id: 2, type: "expense", category: "salary", amount: 3000, date: "Oct 16, 2023", related_to: "Emily Chen" },
    { id: 3, type: "expense", category: "ads", amount: 500, date: "Oct 18, 2023", related_to: "Facebook Ads" },
    { id: 4, type: "income", category: "manual_collection", amount: 800, date: "Oct 20, 2023", related_to: "Globex" },
    { id: 5, type: "income", category: "task_payment", amount: 2100, date: "Oct 21, 2023", related_to: "Initech Solutions" },
];

const profitableServicesData = [
    { name: 'web Development', revenue: 15400 },
    { name: 'Ads & Marketing', revenue: 12200 },
    { name: 'Graphic Design', revenue: 8500 },
];

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">


            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Income</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <MdTrendingUp size={18} />
                        </div>
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-on-surface">$45,200</h4>
                    <span className="text-xs text-emerald-600 font-medium mt-1">+12.5% from last month</span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Expenses</span>
                        <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error">
                            <MdTrendingDown size={18} />
                        </div>
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-on-surface">$12,500</h4>
                    <span className="text-xs text-error font-medium mt-1">+2.1% from last month</span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Net Profit</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MdOutlineAccountBalanceWallet size={18} />
                        </div>
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-on-surface">$32,700</h4>
                    <span className="text-xs text-emerald-600 font-medium mt-1">+15.2% from last month</span>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Active Tasks</span>
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                            <MdAssignment size={18} />
                        </div>
                    </div>
                    <h4 className="font-headline text-2xl font-bold text-on-surface">14</h4>
                    <span className="text-xs text-on-surface-variant font-medium mt-1">4 pending completion</span>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 ">
                {/* Area Chart: Income vs Expense */}
                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20 lg:col-span-2">
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-4 sm:mb-6">Income vs Expenses</h3>
                    <div className="w-full h-fit">
                        <ResponsiveContainer width="100%" height="300">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--error)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--error)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--surface-container)', borderColor: 'var(--outline-variant)', borderRadius: '8px', color: 'var(--on-surface)' }}
                                    itemStyle={{ color: 'var(--on-surface)' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="var(--error)" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart: Expenses Breakdown */}
                <div className="bg-surface-container-lowest rounded-xl h-fit p-4 sm:p-6 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20 flex flex-col">
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Expenses by Category</h3>
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="280">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--surface-container)', borderColor: 'var(--outline-variant)', borderRadius: '8px', color: 'var(--on-surface)' }}
                                    itemStyle={{ color: 'var(--on-surface)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-y-3 mt-4">
                        {expenseData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs text-on-surface-variant font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Clients & Profitable Services Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="flex flex-col md:flex-col  gap-4">
                    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Clients</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <MdPeopleAlt size={18} />
                            </div>
                        </div>
                        <h4 className="font-headline text-2xl font-bold text-on-surface">150 Clients</h4>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col justify-center flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Outstanding Balance</span>
                            <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error">
                                <MdTrendingDown size={18} />
                            </div>
                        </div>
                        <h4 className="font-headline text-2xl font-bold text-on-surface">- $12,500</h4>
                        <span className="text-xs text-error font-medium mt-1">from 20 Client</span>
                    </div>
                    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-[0px_10px_20px_rgba(19,27,46,0.02)] border border-outline-variant/10 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Top Performers</span>
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MdStar size={18} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-surface-container text-[10px] font-bold text-on-surface-variant">1</span>
                                    <span className="text-sm font-medium text-on-surface capitalize">mohamed</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">+$150</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-surface-container text-[10px] font-bold text-on-surface-variant">2</span>
                                    <span className="text-sm font-medium text-on-surface capitalize">ahmed</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">+$100</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded flex items-center justify-center bg-surface-container text-[10px] font-bold text-on-surface-variant">3</span>
                                    <span className="text-sm font-medium text-on-surface capitalize">ali</span>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">+$50</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20 lg:col-span-2 flex flex-col">
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Most Profitable Services</h3>
                    <div className="w-full flex-1 h-fit">
                        <ResponsiveContainer width="100%" height="280">
                            <BarChart data={profitableServicesData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" strokeOpacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'inherit' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12 }} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                                <RechartsTooltip
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                    contentStyle={{ backgroundColor: 'var(--surface-container)', borderColor: 'var(--outline-variant)', borderRadius: '8px', color: 'var(--on-surface)' }}
                                    itemStyle={{ color: 'var(--on-surface)' }}
                                    cursor={{ fill: 'var(--surface-container-highest)', opacity: 0.4 }}
                                />
                                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            {/* Recent Transactions Table */}
            <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20 overflow-hidden">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="font-headline text-lg font-bold text-on-surface">Recent Transactions</h3>
                    <button className="text-xs font-semibold text-primary hover:text-primary-container transition-colors">View All</button>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Transaction Details</th>
                                <th className="pb-4 font-medium">Type</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Date</th>
                                <th className="pb-4 font-medium text-right pr-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {recentTransactions.map((trx) => (
                                <tr key={trx.id} onClick={() => navigate(`/details/transaction/${trx.id}`)} className="hover:bg-surface-container-high/30 transition-colors group">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-on-surface capitalize">
                                                {trx.category.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-on-surface-variant mt-0.5 sm:whitespace-nowrap flex flex-wrap items-center gap-x-1">
                                                <span>{trx.related_to}</span>
                                                <span className="sm:hidden text-outline-variant/50">|</span>
                                                <span className="sm:hidden">{trx.date.substring(0, 6)}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${trx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-error/10 text-error'}`}>
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-on-surface border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {trx.date}
                                    </td>
                                    <td className={`py-4 text-right pr-2 font-medium font-headline text-base border-b border-surface-container-high/50 ${trx.type === 'income' ? 'text-emerald-600' : 'text-error'}`}>
                                        {trx.type === 'income' ? '+' : '-'}${trx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
