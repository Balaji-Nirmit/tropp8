import { useState } from "react";
import { toggleLike } from "../api/endpoints";
import HorizontalBar from "./horizontalBar";
import { constants } from "../constants/constants";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/pagination';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative, Mousewheel, Pagination } from 'swiper/modules';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PostCard = ({ prop }) => {
    const [likeCount, setLikeCount] = useState(prop.like_count)
    const [likedByMe, setLikedByMe] = useState(prop.liked)
    const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
    

    const handleToggleLike = async () => {
        const data = await toggleLike(prop.id)
        if (data.now_liked) {
            setLikeCount(likeCount + 1)
            setLikedByMe(true)
        }
        else {
            setLikeCount(likeCount - 1)
            setLikedByMe(false)
        }
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

                <div className="w-[500px] ml-4">
                    <Swiper
                        modules={[Pagination, Mousewheel, EffectCreative]}
                        effect={'creative'}
                        creativeEffect={{
                            prev: {
                              shadow: true,
                              translate: [0, 0, -400],
                            },
                            next: {
                              translate: ['100%', 0, 0],
                            },
                          }}
                        direction="horizontal"
                        mousewheel={true}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{
                            dynamicBullets: true,
                            clickable: true,
                        }}
                        onSlideChange={() => console.log("slide change")}
                        onSwiper={(swiper) => console.log(swiper)}
                        className="w-[460px] h-[360px] rounded-2xl cursor-pointer shadow-sm"
                    >
                        {prop.images.map((item) => (
                            <SwiperSlide
                                key={item.id}
                                className="w-[460px] h-[360px] overflow-hidden rounded-2xl bg-cover bg-center"
                            >
                                <img
                                    src={`${constants.SERVER_URL + item.image_url}`}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>



                <div className="w-[460px] text-gray-800 ml-9">
                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-gray-600 text-sm">{likeCount} Likes</span>
                        <button
                            onClick={handleToggleLike}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${likedByMe
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {likedByMe ? "Liked ❤️" : "Like 👍"}
                        </button>
                    </div>
                </div>

            </motion.div>
        </>
    )
}
export default PostCard;