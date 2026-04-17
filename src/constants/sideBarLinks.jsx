import { BsFillGrid1X2Fill } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";


export const menuItems = [
    { path: '/', icon: <BsFillGrid1X2Fill className="size-4" />, label: 'Dashboard' },
    { path: '/clients', icon: <MdOutlinePeopleAlt className="size-5" />, label: 'Clients' },
    { path: '/employees', icon: <HiOutlineIdentification className="size-5" />, label: 'Employees' },
    { path: '/tasks', icon: <FaTasks className="size-5" />, label: 'Tasks' },
    { path: '/transactions', icon: <FaMoneyBillTrendUp className="size-5" />, label: 'Transactions' },
];


export const addNewItems = [
    { path: '/add-new/client', icon: <MdOutlinePeopleAlt className="size-5" />, label: 'New Client' },
    { path: '/add-new/employee', icon: <HiOutlineIdentification className="size-5" />, label: 'New Employee' },
    { path: '/add-new/task', icon: <FaTasks className="size-5" />, label: 'New Task' },
    { path: '/add-new/transaction', icon: <FaMoneyBillTrendUp className="size-5" />, label: 'New Transaction' },
];
