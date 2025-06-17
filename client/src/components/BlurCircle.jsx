import React from 'react';

const BlurCircle = ({
  top = 'auto',
  left = 'auto',
  right = 'auto',
  bottom = 'auto',
  color = 'bg-primary-dull',
}) => {
  return (
    <div
      className={`absolute ${color} blur-3xl rounded-full -z-5`}
      style={{
        top,
        left,
        right,
        bottom,
        width: '200px',
        height: '200px',
      }}
    />
  );
};

export default BlurCircle;
