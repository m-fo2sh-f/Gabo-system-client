import { Outlet } from 'react-router-dom'
import AddNewSidebar from '../specific/AddNewSidebar'
import Header from '../specific/Header'

const AddNewLayout = () => {
    return (
        <div className="min-h-screen bg-background md:flex">
            <AddNewSidebar />
            <main className="flex-1 md:ml-64 p-8 flex flex-col gap-8">
                <Header />
                <Outlet />
            </main>
        </div>
    )
}

export default AddNewLayout