import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '',
  decimals = 0,
  duration = 1,
  className = ''
}) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => {
    if (typeof value === 'number') {
      return `${prefix}${current.toFixed(decimals)}${suffix}`;
    }
    return value;
  });
  
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    if (typeof value === 'number') {
      spring.set(value);
    }
  }, [value, spring]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setDisplayValue(latest);
    });
  }, [display]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
}