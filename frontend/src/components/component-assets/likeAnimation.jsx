import { motion } from "framer-motion";
import { AiFillHeart} from "react-icons/ai";

const LikeAnimation = () => {
    return (
        <>
            <motion.div
                className="absolute text-red-500"
                style={{ zIndex: 9999 }} // Ensures it's on top
                initial={{ opacity: 1, y: 0, scale: 0.8 }}
                animate={{
                    y: [0, -100, -200, -300, -400, -500, -600, -700, -800], // Moves extremely high
                    x: [0, -25, 25, -25, 25, -25, 25, -25, 0], // Wider zig-zag motion
                    opacity: [1, 1, 1, 0.9, 0.8, 0.6, 0.4, 0.2, 0], // Smooth fade-out
                    scale: [8, 7, 6, 5, 4, 3, 2, 1, 0], // **Starts HUGE, then shrinks**
                }}
                transition={{ duration: 2.5, ease: "easeOut" }} // Longer duration for smooth effect
            >
                <AiFillHeart size={40} /> {/* Larger initial size */}
            </motion.div>
        </>
    )
}
export default LikeAnimation;