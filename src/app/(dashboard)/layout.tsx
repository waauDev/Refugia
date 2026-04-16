import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashBoardSideBar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
    children:React.ReactNode;
}

const Layout = ({children}:Props) =>{

    return (
    <SidebarProvider>
        <DashBoardSideBar/>
        <main className="flex flex-col h-screen w-screen bg-muted">
            <DashboardNavar/>

        {children}
        </main>
    </SidebarProvider>
    );
}

export default Layout;