import { BsFillGrid1X2Fill, BsType } from "react-icons/bs";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import { FaTasks, FaBriefcase } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";


export const menuItems = [
    { path: '/', icon: <BsFillGrid1X2Fill className="size-4" />, label: 'common.dashboard' },
    { path: '/clients', icon: <MdOutlinePeopleAlt className="size-5" />, label: 'common.clients' },
    { path: '/employees', icon: <HiOutlineIdentification className="size-5" />, label: 'common.employees' },
    { path: '/tasks', icon: <FaTasks className="size-5" />, label: 'common.tasks' },
    { path: '/transactions', icon: <FaMoneyBillTrendUp className="size-5" />, label: 'common.transactions' },
];


export const addNewItems = [
    { path: '/add-new/client', icon: <MdOutlinePeopleAlt className="size-5" />, label: 'sidebar.new_client' },
    { path: '/add-new/employee', icon: <HiOutlineIdentification className="size-5" />, label: 'sidebar.new_employee' },
    { path: '/add-new/task', icon: <FaTasks className="size-5" />, label: 'sidebar.new_task' },
    { path: '/add-new/transaction', icon: <FaMoneyBillTrendUp className="size-5" />, label: 'sidebar.new_transaction' },
    { path: '/add-new/taskType', icon: <BsType className="size-5" />, label: 'sidebar.new_task_type' },
    { path: '/add-new/jobTitle', icon: <FaBriefcase className="size-5" />, label: 'sidebar.new_job_title' },

];

export const routeConfigs = {
    '/': { title: 'dashboard.overview', subtitle: "dashboard.dashboard_subtitle" },
    '/clients': { title: 'common.clients', subtitle: 'dashboard.clients_subtitle' },
    '/transactions': { title: 'common.transactions', subtitle: 'dashboard.transactions_subtitle' },
    '/employees': { title: 'common.employees', subtitle: 'dashboard.employees_subtitle' },
    '/tasks': { title: 'common.tasks', subtitle: 'dashboard.tasks_subtitle' },
    '/add-new/client': { title: 'forms.client.add_title', subtitle: 'dashboard.add_new_subtitle' },
    '/add-new/employee': { title: 'forms.employee.add_title', subtitle: 'dashboard.add_new_subtitle' },
    '/add-new/jobTitle': { title: 'sidebar.new_job_title', subtitle: 'dashboard.add_new_subtitle' },
    '/add-new/task': { title: 'forms.task.add_title', subtitle: 'dashboard.add_new_subtitle' },
    '/add-new/transaction': { title: 'forms.transaction.add_title', subtitle: 'dashboard.add_new_subtitle' },
    '/add-new/taskType': { title: 'sidebar.new_task_type', subtitle: 'dashboard.add_new_subtitle' },
    // صفحات الـ Details (باستخدام regex أو التحقق من البداية)
};
