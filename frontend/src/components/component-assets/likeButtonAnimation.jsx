import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const LikeButtonAnimation = ({handleToggleLike,likedByMe}) => {
    return (
        <>
            <motion.div
                onClick={handleToggleLike}
                className="cursor-pointer select-none relative flex items-center justify-center"
                whileTap={{ scale: 0.85 }} // Slight shrink effect on tap
            >
                {/* Heart Icon with Bounce Animation */}
                <motion.div
                    initial={false}
                    animate={
                        likedByMe
                            ? { scale: [1, 1.6, 0.8, 1.2, 1], rotate: [0, 8, -8, 4, -4, 0] }
                            : { scale: [1, 1.1, 1] }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative"
                >
                    {likedByMe ? (
                        <AiFillHeart size={34} className="text-red-500 drop-shadow-lg" />
                    ) : (
                        <AiOutlineHeart size={34} className="text-gray-700" />
                    )}

                    {/* 🔥 Burst Effect */}
                    {likedByMe &&
                        [...Array(12)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: `${Math.random() * 4 + 3}px`, // Random size (3px - 7px)
                                    height: `${Math.random() * 4 + 3}px`,
                                    backgroundColor: ["#ff4d4d", "#ff9800", "#ffeb3b", "#4caf50", "#03a9f4", "#9c27b0"][
                                        i % 6
                                    ], // 6 different colors
                                    top: "50%",
                                    left: "50%",
                                    transformOrigin: "center",
                                }}
                                animate={{
                                    x: [0, Math.cos((i / 12) * Math.PI * 2) * 20], // Spreads out in a circle
                                    y: [0, Math.sin((i / 12) * Math.PI * 2) * 20],
                                    scale: [1, 1.4, 0], // Expands slightly before fading
                                    opacity: [1, 1, 0], // Smooth fade-out
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        ))}

                    {/* ❤️ Floating Heart Animation */}
                    {likedByMe && (
                        <motion.div
                            className="absolute text-red-500"
                            initial={{ opacity: 1, y: 0, scale: 0.8 }}
                            animate={{
                                y: [-5, -15, -25, -40, -55], // Moves up in steps
                                x: [0, -10, 10, -10, 10, 0], // Zig-zag movement
                                opacity: [1, 1, 0.8, 0.5, 0], // Fades out
                                scale: [0.8, 1.1, 1.3, 1.5, 1.7], // Slight pop effect
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        >
                            <AiFillHeart size={20} />
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </>
    )
}
export default LikeButtonAnimation;