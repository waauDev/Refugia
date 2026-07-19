interface Props{
    children: React.ReactNode;
}

const Layout = ({children}:Props)=>{

    return(

        <div className="min-h-svh bg-radial from-sidebar-accent to-sidebar">
            {children}
        </div>
    )
};

export default Layout;
