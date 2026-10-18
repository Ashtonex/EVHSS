import { Variants } from "framer-motion";

// Tactile spring physics tailored for pet warmth
export const transitionSpring = {
  type: "spring",
  stiffness: 320,
  damping: 26,
};

export const petPlayfulSpring = {
  type: "spring",
  stiffness: 380,
  damping: 22,
};

export const transitionSnappy = {
  duration: 0.2,
  ease: [0.25, 1, 0.5, 1],
};

export const transitionSmooth = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

// Orchestrated Hero Stagger
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Subtle Scroll Reveal for Full-Width Sections
export const fadeInScrollVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Tactile Tap / Hover Physics (Reassuring on click, playful on hover)
export const buttonHoverPhysics = {
  whileHover: { scale: 1.02, y: -1, transition: { duration: 0.15 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const cardInteractiveVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.015, y: -3, transition: transitionSpring },
};

// 2.5D Spatial Directional Reveals (Side-Ins with 3D Y-Axis Tilt Settling)
export const spatialSideInLeft: Variants = {
  hidden: { opacity: 0, x: -50, rotateY: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const spatialSideInRight: Variants = {
  hidden: { opacity: 0, x: 50, rotateY: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Spatial Pop & Settle (For Badges & Interactive Highlights)
export const spatialPopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: petPlayfulSpring,
  },
};

// Department Room Transition (3D Space Switch)
export const roomSwitchVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.94,
    x: direction > 0 ? 40 : -40,
    rotateY: direction > 0 ? 6 : -6,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.94,
    x: direction > 0 ? -40 : 40,
    rotateY: direction > 0 ? -6 : 6,
    transition: {
      duration: 0.35,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

