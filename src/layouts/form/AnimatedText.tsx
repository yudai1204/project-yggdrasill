import { motion } from "framer-motion";

type Props = {
  text: string;
  randomize?: boolean;
};

export const AnimatedText = (props: Props) => {
  const { text, randomize } = props;

  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => {
        const randomY = randomize ? Math.random() * 6 - 3 : 0; // -5から5の範囲でランダムにyを設定
        return (
          <motion.span
            variants={{
              ...child,
              visible: {
                ...child.visible,
                x: 0,
                y: randomY,
              },
            }}
            key={index}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
