import { motion } from 'framer-motion'

// Animation variants for common patterns
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const slideInFromLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
}

// Modal/overlay variants
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

// Chat message animations
export const chatMessage = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

// Loading animations
export const loadingDots = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const loadingSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Card hover animations
export const cardHover = {
  whileHover: { 
    y: -4, 
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' } 
  },
  whileTap: { scale: 0.98 },
}

// Button animations
export const buttonTap = {
  whileTap: { scale: 0.95 },
  transition: { duration: 0.1 },
}

// Floating animations for decorative elements
export const float = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Navigation animations
export const navSlide = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { type: 'tween', duration: 0.3 },
}

// Typing indicator animation
export const typingIndicator = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Progress animations
export const progressBar = {
  initial: { width: 0 },
  animate: { width: '100%' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

// Notification animations
export const slideInFromTop = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.3, ease: 'easeOut' },
}

// Export motion components for easy use
export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionSection = motion.section
export const MotionArticle = motion.article
export const MotionSpan = motion.span
export const MotionP = motion.p
export const MotionH1 = motion.h1
export const MotionH2 = motion.h2
export const MotionH3 = motion.h3