import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { get_notifications } from "../../api/endpoints";
import Loader from "../loader";
import FollowRequest from "../notifications/follow_request";

const Notifications = ({markNotificationAsRead}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [nextPageId, setNextPageId] = useState('');
    const { ref, inView } = useInView({ threshold: 0.8 });

    useEffect(() => {
        if (inView) {
            handleData()
        }
    }, [inView]);


    const handleData = async () => {
        if (nextPageId == null || fetching) return;
        setFetching(true);
        setLoading(true);
        try {
            let data = await get_notifications(nextPageId);
            setNotifications(prevNotifications => [...prevNotifications, ...data.results]);
            setNextPageId(data.next ? `?${data.next.split('?')[1]}` : null);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
            setFetching(false);
            console.log(notifications)
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className="flex flex-col w-full gap-2">
                {notifications.map((item, index) => (
                    <FollowRequest data={item} key={item.id} markNotificationAsRead={markNotificationAsRead}></FollowRequest>
                ))}
            </div>
            <div ref={ref} style={{ height: "20px" }}></div>
        </>
    );
};

export default Notifications;