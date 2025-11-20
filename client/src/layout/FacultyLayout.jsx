import Navbar from '@/components/common/navbar'
import Sidebar from '@/components/common/sidebar'
import React from 'react'
import { Outlet } from 'react-router'

const FacultyLayout = () => {
  return <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar title = {"Faculty Dashboard"} />
            <Outlet/>
        </div>
    </div>
}

export default FacultyLayout