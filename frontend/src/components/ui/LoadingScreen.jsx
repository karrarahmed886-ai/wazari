import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 z-[100] bg-darkBg flex flex-col items-center justify-center"
  >
    <motion.div 
      animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} 
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="w-28 h-28 mb-8 rounded-full overflow-hidden border-4 border-primary/40 shadow-2xl shadow-primary/30"
    >
      <img src="/logo.png" alt="منصة وزاري" className="w-full h-full object-cover" />
    </motion.div>

    <div className="relative mb-8 flex items-center justify-center">
      <div className="spinner"></div>
    </div>
    
    <motion.h2
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-bold font-head text-white tracking-wide"
    >
      {message}
    </motion.h2>
  </motion.div>
);

export default LoadingScreen;