import { Outlet } from 'react-router-dom'
import MainSidebar from '../specific/MainSidebar'
import Header from '../specific/Header'
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language;
    return (
        <div className="min-h-screen bg-background md:flex">
            <MainSidebar lang={lang} />
            <main className={`flex-1 ${lang === 'ar' ? 'md:mr-64' : 'md:ml-64'} p-8 flex flex-col gap-8`}>
                <Header />
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout