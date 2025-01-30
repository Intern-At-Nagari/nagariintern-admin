import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@material-tailwind/react";

const AnimatedButton = ({ children, isLoading, disabled, onClick }) => {
  return (
    <Button
      variant="gradient"
      color="blue"
      className={`
        relative overflow-hidden
        transition-all duration-300
        flex items-center justify-center gap-2
        shadow-md hover:shadow-lg
        ${isLoading ? 'opacity-90' : ''}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
          <span>Loading...</span>
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17
          }}
          className="flex items-center gap-2"
        >
          {children}
        </motion.div>
      )}
    </Button>
  );
};

export default React.memo(AnimatedButton);