import Navbar from "@/components/common/navbar"
import Sidebar from "@/components/common/sidebar"
import { Outlet } from "react-router"

const AdminLayout = () => {
    return <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar title = {"Admin Dashboard"} />
            <Outlet/>
        </div>
    </div>

}
export default AdminLayout