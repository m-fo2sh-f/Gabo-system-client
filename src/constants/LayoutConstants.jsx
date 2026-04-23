import { BsFillGrid1X2Fill, BsType } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import { FaTasks, FaBriefcase } from "react-icons/fa";
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
    { path: '/add-new/taskType', icon: <BsType className="size-5" />, label: 'New Task Type' },
    { path: '/add-new/jobTitle', icon: <FaBriefcase className="size-5" />, label: 'New Job Title' },

];

export const routeConfigs = {
    '/': { title: 'Dashboard Overview', subtitle: "Here's what's happening today." },
    '/clients': { title: 'Clients Management', subtitle: 'Manage your client base and their details.' },
    '/transactions': { title: 'Transactions History', subtitle: 'Monitor your cash flow and records.' },
    '/employees': { title: 'Employees List', subtitle: 'View and manage your team members.' },
    '/tasks': { title: 'Task Manager', subtitle: 'Track progress and assignments.' },
    // صفحات الـ Add New
    '/add-new/client': { title: 'Add New Client', subtitle: 'Fill in the details to register a new client.' },
    '/add-new/employee': { title: 'Add New Employee', subtitle: 'Register a new staff member.' },
    '/add-new/jobTitle': { title: 'Add New Job Title', subtitle: 'Define a new job role in the system.' },
    // صفحات الـ Details (باستخدام regex أو التحقق من البداية)
};
