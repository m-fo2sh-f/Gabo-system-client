import React, { useState } from 'react';
import Input from '../../components/common/input';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const mockClients = [
    {
        id: 1,
        brand_name: "Acme Corp",
        name: "Sarah Jenkins",
        payment_cycle: "monthly",
        contract_start_date: "Oct 15, 2023",
        status: "active",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPPsqq7HcPgd0LQ6YMYl6wZcNYi9hOGR4HaCguxDf1-uwYXjBIU4KfyhhDF7jby3pTMRsadvfk38_yIIBrd-4B4GqlY7wmgwVLUj62ihwtDDrAOrCmn_7Z9KJ4GghABDh90ErF-k2M_FEExw2dhAAMXKB5dHgM_SoKDf1eTmetb2Rvn58O1ncDLv8qV4iwKjDTzPMwJ6c7tjySXhvW0isHOjlJKYljXGfPbnPIShx1Z5vij_qXXbMdGUjSLfYxLkkdVIzzPLvoIXc"
    },
    {
        id: 2,
        brand_name: "Globex Innovations",
        name: "Michael Chang",
        payment_cycle: "weakly",
        contract_start_date: "Oct 06, 2023",
        status: "paused",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVf_2UaHCNy3FxY1egZDf5eUkiEap0B7tNjNDj1OxvGr0-07UvHmn9q4YUgyzFwLed3p_bbnOJueQw8Y73G4cy24nMM5sdUEO-gd6KCiTAuCiUzUjL1aQIxULZrCkcvAEypaDt1ryJq3kuAPbFO1E8WxqMWIBu0nOoINPoKOr610UD0qvzGtq9EJCCYF1RVKUOwMExT110omLMq9vidfpcLFacWZpU-h196H4R6-icq7fhdoUf5hpojf8tAEQXnSpeYQkOfN7ZJfQ"
    },
    {
        id: 3,
        brand_name: "Initech Solutions",
        name: "David R.",
        payment_cycle: "once",
        contract_start_date: "Oct 02, 2023",
        status: "stopped",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCO535mSScJQ2GrRa3oedmoVZFbFRACN1GRf5oaH-ydLEE0-vS7foBn17RYtIwjt9OQ1GICWnGd5d2lcAMtvg7O5WP_8oenpDoxYsLo5GQJWlIpAs05aKKjgKufxNfz_tRyAGoqHiBKHO04KBu0UwnQ7pk_3qVhYXJa3ncut0WLjpzBhGgLeMFcIzu8lODAtL_kDV0zP1su4f-r2IJuehuCSgFVGGUZbxrV6H3Qqz91dWs3XKRgjNraaT8WMDkUZMNyEt3erBCiQ"
    },
    {
        id: 5,
        brand_name: "Initech Solutions",
        name: "David R.",
        payment_cycle: "once",
        contract_start_date: "Oct 02, 2023",
        status: "stopped",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCO535mSScJQ2GrRa3oedmoVZFbFRACN1GRf5oaH-ydLEE0-vS7foBn17RYtIwjt9OQ1GICWnGd5d2lcAMtvg7O5WP_8oenpDoxYsLo5GQJWlIpAs05aKKjgKufxNfz_tRyAGoqHiBKHO04KBu0UwnQ7pk_3qVhYXJa3ncut0WLjpzBhGgLeMFcIzu8lODAtL_kDV0zP1su4f-r2IJuehuCSgFVGGUZbxrV6H3Qqz91dWs3XKRgjNraaT8WMDkUZMNyEt3erBCiQ"
    },
    {
        id: 6,
        brand_name: "Initech Solutions",
        name: "David R.",
        payment_cycle: "once",
        contract_start_date: "Oct 02, 2023",
        status: "stopped",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoCO535mSScJQ2GrRa3oedmoVZFbFRACN1GRf5oaH-ydLEE0-vS7foBn17RYtIwjt9OQ1GICWnGd5d2lcAMtvg7O5WP_8oenpDoxYsLo5GQJWlIpAs05aKKjgKufxNfz_tRyAGoqHiBKHO04KBu0UwnQ7pk_3qVhYXJa3ncut0WLjpzBhGgLeMFcIzu8lODAtL_kDV0zP1su4f-r2IJuehuCSgFVGGUZbxrV6H3Qqz91dWs3XKRgjNraaT8WMDkUZMNyEt3erBCiQ"
    }
];

const Clients = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter Logic
    const filteredClients = mockClients.filter(client => {
        const matchesSearch = client.brand_name.toLowerCase().includes(search.toLowerCase()) ||
            client.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getPaymentCycleStyle = (cycle) => {
        switch (cycle) {
            case 'monthly': return 'bg-secondary-container text-on-secondary-container';
            case 'weakly': return 'bg-surface-container-highest text-primary'; // Note: weakly typo matches FormConstants
            case 'once': return 'bg-tertiary-container/20 text-tertiary';
            default: return 'bg-surface-container-high text-on-surface-variant';
        }
    };

    return (
        <div className="space-y-6">
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_20px_40px_rgba(19,27,46,0.02)] border border-outline-variant/20">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h3 className="font-headline text-2xl font-bold text-on-surface">Clients Database</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Manage and track your client relationships.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <select
                            className="w-full sm:w-auto bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 px-4 text-sm font-body text-on-surface focus:outline-none transition-all duration-200 cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="stopped">Stopped</option>
                        </select>

                        <div className="relative w-full sm:w-auto">
                            <Input
                                type="text"
                                prefix={<IoSearchSharp />}
                                className="w-full bg-surface-container-low focus:bg-surface-container-lowest border border-transparent focus:border-primary/40 rounded-lg py-2 pl-9 pr-4 text-sm font-body text-on-surface placeholder:text-outline focus:outline-none transition-all duration-200"
                                placeholder="Search clients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-label uppercase tracking-wider text-secondary border-b border-surface-container-highest">
                                <th className="pb-4 font-medium pl-2">Client Name</th>
                                <th className="pb-4 font-medium hidden sm:table-cell">Brand Name</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium hidden md:table-cell">Payment Cycle</th>
                                <th className="pb-4 font-medium text-right pr-2 hidden lg:table-cell">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className="font-body text-sm text-on-surface">
                            {filteredClients.length > 0 ? filteredClients.map((client) => (
                                <tr key={client.id} onClick={() => navigate(`/details/client/${client.id}`)} className="hover:bg-surface-container-high/30 transition-colors group cursor-pointer" title="Click to view details">
                                    <td className="py-4 pl-2 border-b border-surface-container-high/50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                                                    {client.name}
                                                </span>
                                                {/* يظهر في الموبايل فقط للتوفير في المساحة */}
                                                <span className="text-xs text-on-surface-variant sm:hidden mt-0.5">
                                                    {client.name}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-secondary border-b border-surface-container-high/50 hidden sm:table-cell">
                                        {client.brand_name}
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${client.status === 'active' ? 'bg-primary' : client.status === 'paused' ? 'bg-tertiary' : 'bg-error'}`}></div>
                                            <span className="capitalize">{client.status}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-surface-container-high/50 hidden md:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentCycleStyle(client.payment_cycle)}`}>
                                            {client.payment_cycle === 'weakly' ? 'weekly' : client.payment_cycle}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right pr-2 font-medium border-b border-surface-container-high/50 hidden lg:table-cell">
                                        {client.contract_start_date}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-on-surface-variant">No clients found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-6 mt-2">
                    <span className="text-sm text-on-surface-variant">Showing <span className="font-medium text-on-surface">1</span> to <span className="font-medium text-on-surface">{filteredClients.length}</span> of <span className="font-medium text-on-surface">{mockClients.length}</span> clients</span>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowLeft /></span>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-on-primary text-sm font-medium flex items-center justify-center">1</button>
                        <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container-high text-sm font-medium flex items-center justify-center transition-colors">2</button>
                        <button className="p-2 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[20px]"><MdKeyboardArrowRight /></span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Clients;