import Right from "../components/right";

const HomeLayout = ({children}) => {

    return (
        <>
            <div className="flex w-full h-full">
                {/* Left Content Section */}
                <div className="flex flex-col w-[70%] p-8 overflow-y-scroll h-screen">
                    {children}
                </div>

                {/* Right Sidebar with Sticky Behavior */}
                <div className="w-[30%] relative">
                    <div className="sticky top-0 overflow-y-auto h-screen">
                        <div className="min-h-[100vh]">
                            <Right />
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}
export default HomeLayout;