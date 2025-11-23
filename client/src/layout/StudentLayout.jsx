import Navbar from '@/components/common/navbar';
import Sidebar from '@/components/common/sidebar';
import React from 'react'
import { Outlet } from 'react-router';

const StudentLayout = () => {
    return<div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title = {"scholar window"} />
                <Outlet/>
            </div>
        </div>
}

export default StudentLayout;