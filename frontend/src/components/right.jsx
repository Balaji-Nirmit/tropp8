import { useState, lazy, useEffect } from "react";
import { FaFire, FaBell } from "react-icons/fa"; // Importing React Icons
import { motion } from "framer-motion";
// import { FaBell } from "react-icons/fa6";


const Recommends = lazy(() => import("./right-tabs/recommends"));
const Notifications = lazy(() => import("./right-tabs/notifications"));

const Right = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [loadedTabs, setLoadedTabs] = useState({});
  const [isNewNotification, setIsNewNotification] = useState()
  const [markNotificationAsRead, setMarkNotificationAsRead] = useState(null);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setLoadedTabs((prev) => ({ ...prev, [tab]: true })); // Mark tab as loaded
  };


  // websocket code for realtime notification system
  useEffect(() => {
    // Update the URL based on your deployment. If you're on HTTPS, use wss://
    const socket = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://localhost:8000/ws/notifications/`
    );

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      try {
        // Parse the JSON message received from the server
        const data = JSON.parse(event.data);
        console.log('Notification received:', data);
        setIsNewNotification(data.message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    const markAsRead=(notificationId)=> {
      socket.send(JSON.stringify({
        action: "mark_as_read",
        notification_id: notificationId
      }));
      console.log(notificationId+"sent")
    }
    setMarkNotificationAsRead(() => markAsRead);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  

  return (
    <div className="border-l-1 border-l-gray-300 overflow-y-auto flex flex-col gap-4  p-4 shadow-lg">
      {/* Tabs Header */}
      <div className="flex justify-center space-x-2 bg-white p-2 rounded-lg shadow-md">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-lg
          ${activeTab === "tab1" ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => handleTabClick("tab1")}
        >
          <FaFire className="text-md" /> Members
        </button>
        <button
          className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-lg
          ${activeTab === "tab2" ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => handleTabClick("tab2")}
        >
          <FaBell className="text-md" /> Notifications
          {isNewNotification && (
            <motion.div
              className="absolute top-1 right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0, y: -5 }}
              animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1], y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              !
            </motion.div>
          )}

        </button>
      </div>

      {/* Tab Content (Loads only once when opened) */}
      <div className="p-4 bg-white text-gray-800 mt-3 rounded-lg shadow-md">
        {activeTab === "tab1" && <Recommends />}
        {activeTab === "tab2" && loadedTabs["tab2"] && <Notifications markNotificationAsRead={markNotificationAsRead} />}
      </div>
    </div>
  );
};

export default Right;
