import { useState } from "react";
import { toggleLike } from "../api/endpoints";
import HorizontalBar from "./horizontalBar";
import { constants } from "../constants/constants";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import OverlayModal from "./overlayModal";
import LikeAnimation from "./component-assets/likeAnimation";
import LikeButtonAnimation from "./component-assets/likeButtonAnimation";


const PostCard = ({ prop }) => {
    const [likeCount, setLikeCount] = useState(prop.like_count)
    const [likedByMe, setLikedByMe] = useState(prop.liked_by_me)
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [isOpenLiked, setOpenLiked] = useState(false);
    const [showHeart, setShowHeart] = useState(false)


    const handleToggleLike = async () => {
        const data = await toggleLike(prop.id)
        if (data.liked) {
            setLikeCount(likeCount + 1)
            setLikedByMe(true)
            setShowHeart(true)
            setTimeout(() =>
                setShowHeart(false), 800
            )
        }
        else {
            setLikeCount(likeCount - 1)
            setLikedByMe(false)
        }
    }
    const openCloseLiked = () => {
        setOpenLiked(!isOpenLiked)
    }
    return (
        <>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="border-l-2 border-l-gray-300 relative  py-12 flex flex-col items-start gap-4"
            >
                <div className="absolute -left-5 -top-2">
                    <HorizontalBar data={{ name: prop.username, img: 'https://mythemestore.com/beehive-preview/wp-content/uploads/avatars/3/1741292742-bpthumb.png', description: prop.formatted_date }}></HorizontalBar>
                </div>
                <p className="text-sm text-gray-600 font-sm ml-9">{prop.description}</p>

                <div className="w-[500px] flex flex-col gap-2 ml-4">
                    <Swiper
                        style={{
                            '--swiper-navigation-color': '#000',
                            '--swiper-pagination-color': '#000',
                        }}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="w-[460px] h-[360px] shadow-md rounded-2xl"
                        onDoubleTap={handleToggleLike}

                    >
                        {prop.images.map((item) => (
                            <SwiperSlide
                                key={item.id}
                                className="w-[460px] h-[360px] overflow-hidden rounded-2xl bg-cover bg-center"
                            >
                                <img
                                    src={`${item.image_url}`}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={3}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="w-[460px] h-[150px] py-4 rounded-2xl"

                    >
                        {prop.images.map((item) => (
                            <SwiperSlide
                                key={item.id}
                                className="w-[460px] h-[360px] overflow-hidden shadow-md rounded-2xl bg-cover bg-center"
                            >
                                <img
                                    src={`${item.image_url}`}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className="w-[460px] text-gray-800 ml-9">
                    <div className="mt-3 flex items-center gap-3">
                        {likeCount ? <span className="text-gray-600 text-sm cursor-pointer hover:underline" onClick={openCloseLiked}>{likeCount} Likes</span>
                            : <span className="text-gray-600 text-sm">{likeCount} Likes</span>
                        }
                        <LikeButtonAnimation handleToggleLike={handleToggleLike} likedByMe={likedByMe}/>
                        {showHeart && <LikeAnimation/>}
                    </div>
                </div>
            </motion.div>

            {/* overlay */}
            {isOpenLiked && <OverlayModal prop={prop.id} openCloseMethod={openCloseLiked} title={'Likes'} />}
        </>
    )
}
export default PostCard;