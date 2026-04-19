import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from '../specific/MainSidebar';

const DetailsLayout = () => {
    return (
        <div className="min-h-screen bg-background md:flex">
            <MainSidebar />
            <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-y-auto relative">
                <Outlet />
            </main>
        </div>
    );
};

export default DetailsLayout;