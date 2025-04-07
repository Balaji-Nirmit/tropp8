import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";  
import { get_user_post, getPosts } from "../api/endpoints";
import Loader from "../components/loader";
import PostCard from "../components/postCard";

const MidHome = ({specificUserProfile}) => {
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [nextPageId, setNextPageId] = useState(''); 
    const [fetching, setFetching] = useState(false); // Prevent duplicate API calls
    const { ref, inView } = useInView({ threshold: 0.8}); // Observe the last post
    // threshold means if 80% of ref is visible then only inView is true

   
    const fetchData = async () => {
        if (nextPageId == null || fetching) return; // Stop if there's no next page or already fetching
        setFetching(true); // Prevent multiple API calls
        setLoading(true);

        try {
            let data;
            if (specificUserProfile){
                data = await get_user_post(specificUserProfile, nextPageId);
            }
            else{
                data = await getPosts(nextPageId); 
            }
            setPosts(prevPosts => [...prevPosts, ...data.results]); 
            setNextPageId(data.next ? `?${data.next.split('?')[1]}` : null); 
        } catch (error) {
            console.error("Error fetching posts", error);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    // Fetch posts when the last post is in view
    useEffect(() => {
        if (inView) {
            fetchData();
        }
    }, [inView]);

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-purple-600">All Members</h3>
            <div className="border-[0.5px] border-gray-300 relative">
                <div className="border-purple-600 border-1 w-[100px] absolute top-0 left-0"></div>
            </div>
            <div className="flex flex-col gap-0">
                {posts.map((item, index) => (
                    <PostCard prop={item} key={item.id} />
                ))}
                
                {loading && <Loader />}
                
                {/* Invisible div that triggers fetch when in view --- when this div enters the screen it triggers fetchData */}
                <div ref={ref} style={{ height: "20px"}}></div>
            </div>
        </div>
    );
};

export default MidHome;
