import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Clients from '../pages/Dashboard/Clients';
import Transactions from '../pages/Dashboard/Transactions';
import Tasks from '../pages/Dashboard/Tasks';
import Employees from '../pages/Dashboard/Employees';

// Add New imports
import AddNewLayout from '../components/layout/AddNewLayout';
import ClientForm from '../pages/Add-new/ClientForm';
import EmployeeForm from '../pages/Add-new/EmployeeForm';
import TaskForm from '../pages/Add-new/TaskForm';
import TransactionForm from '../pages/Add-new/TransactionForm';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'clients', element: <Clients /> },
            { path: 'transactions', element: <Transactions /> },
            { path: 'employees', element: <Employees /> },
            { path: 'tasks', element: <Tasks /> },
        ],
    },
    {
        path: '/add-new',
        element: <AddNewLayout />,
        children: [
            { index: true, element: <Navigate to="/add-new/client" /> },
            { path: 'client', element: <ClientForm /> },
            { path: 'employee', element: <EmployeeForm /> },
            { path: 'task', element: <TaskForm /> },
            { path: 'transaction', element: <TransactionForm /> },
        ],
    },
]);

export default router;
