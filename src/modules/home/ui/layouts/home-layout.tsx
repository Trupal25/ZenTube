interface HomeLayoutProps{
    children:React.ReactNode;
}

export function HomeLayout( {children}:HomeLayoutProps ){

    return <div>
        <div className="p-6 bg-blue-600">
            hi there 
        </div>
        {children}

    </div>
} 