const FollowRequest = ({ data,markNotificationAsRead }) => {
    const handleAcceptReject=(notification_id)=>{
        markNotificationAsRead(notification_id)
    }
    return (
        <>
            <div className="flex flex-col p-3 w-full max-w-sm rounded-lg shadow-sm">
                {/* Profile Image + Content */}
                <div className="flex items-center justify-between gap-3">
                    <img src={data.profile_image} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-gray-300" />
                    <p className={`text-sm ${data.is_read ? "text-gray-500" : "text-gray-800 font-medium"}`}>{data.message}</p>
                    {/* Unread Glow Effect */}
                    {!data.is_read && <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>}
                </div>
                <span className="text-sm text-gray-400">{data.created_date}</span>
                <div className="flex gap-2">
                    <button onClick={()=>handleAcceptReject(data.id)} className="cursor-pointer px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full shadow hover:bg-green-600 transition">
                        Accept
                    </button>
                    <button onClick={()=>handleAcceptReject(data.id)} className="cursor-pointer px-3 py-1 text-sm font-medium text-red-500 border border-red-500 rounded-full shadow hover:bg-red-100 transition">
                        Reject
                    </button>
                </div>

            </div>
            {/* Action Buttons */}

        </>
    )
}
export default FollowRequest;