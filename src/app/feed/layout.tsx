interface LayoutProps{
    children: React.ReactNode;
}

const Layout = ({children}:LayoutProps)=>{
    return <div>
         <div className="p-7 bg-red-500">
            hi there  
        </div>
        {children}
    </div>
} 
export default Layout;