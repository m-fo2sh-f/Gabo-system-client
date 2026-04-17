import { Outlet } from 'react-router-dom'
import MainSidebar from '../specific/MainSidebar'
import Header from '../specific/Header'

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background md:flex">
            <MainSidebar />
            <main className="flex-1 md:ml-64 p-8 flex flex-col gap-8">
                <Header  />
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout