import HorizontalBar from "./horizontalBar"

const Right = () => {
    const data = [{ name: 'Linda Lohan', description: 'hello all', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/3/1741292742-bpthumb.png' }, { name: 'Cha Hae In', description: 'Yo wai mo', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/6/5e2cccd55f95b-bpthumb.jpg' }, { name: 'Sasha', description: 'ola ', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/1/6005b5c352343-bpthumb.png' }, { name: 'Megan Fox', description: 'Transform baby', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/16/5e2d07dbca09a-bpthumb.jpg' }, { name: 'Rosse', description: 'blah blah', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/6/5e2cccd55f95b-bpthumb.jpg' }, { name: 'Sakura', description: 'dattebayo', img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/3/1741292742-bpthumb.png' }]
    return (
        <>
            <div className="w-[30%] border-l-1 border-l-gray-300 overflow-y-auto flex flex-col gap-4 p-8" >
                <div className="bg-gradient-to-tl from-purple-50 via-white to-purple-50 rounded-xl p-8 flex flex-col gap-4">
                    <h1 className="text-lg font-bold text-gray-600">Members</h1>
                    <div className="border-purple-600 border-2 w-[50px]"></div>
                    {data.map((item) => { return <HorizontalBar data={item} key={item.name}></HorizontalBar> })}
                </div>
                <div className="bg-gradient-to-tl from-purple-50 via-white to-purple-50 rounded-xl p-6 flex flex-col gap-4">
                    <h1 className="text-lg font-bold text-gray-600">Hashtags</h1>
                    <div className="border-purple-600 border-2 w-12"></div>
                    <div className="grid grid-cols-2 gap-2">
                        {data.map((item) => (
                            <span
                                key={item.name}
                                className="rounded-3xl px-3 py-2 bg-purple-100 text-gray-700 font-medium text-sm text-center truncate"
                                style={{
                                    gridColumn: item.name.length > 10 ? "span 2" : "auto",
                                }}
                            >
                                #{item.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-4 text-sm text-gray-300 cursor-pointer">
                    <span className="hover:text-gray-400 transition duration-300">FAQs</span>
                    <span className="hover:text-gray-400 transition duration-300">About Us</span>
                    <span className="hover:text-gray-400 transition duration-300">Blog</span>
                    <span className="hover:text-gray-400 transition duration-300">Contact Us</span>
                </div>
            </div>
        </>
    )
}
export default Right