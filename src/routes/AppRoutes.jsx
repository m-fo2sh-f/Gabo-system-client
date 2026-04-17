import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Clients from '../pages/Dashboard/Clients';
import Transactions from '../pages/Dashboard/Transactions';
// Add New imports
import AddNewLayout from '../components/layout/AddNewLayout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'clients', element: <Clients /> },
            { path: 'transactions', element: <Transactions /> },
            { path: 'employees', element: <div>Employees Content Coming Soon...</div> },
            { path: 'tasks', element: <div>Tasks Content Coming Soon...</div> },
        ],
    },
    {
        path: '/add-new',
        element: <AddNewLayout />,
        children: [
            { index: true, element: <Navigate to="/add-new/client" /> },
            { path: 'client', element: <div>Client Content Coming Soon...</div> },
            { path: 'employee', element: <div>Employee Content Coming Soon...</div> },
            { path: 'task', element: <div>Task Content Coming Soon...</div> },
            { path: 'transaction', element: <div>Transaction Content Coming Soon...</div> },
        ],
    },
]);

export default router;
