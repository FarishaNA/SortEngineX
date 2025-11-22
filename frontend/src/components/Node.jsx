import React from 'react';

const Node = ({ isStart, isEnd, isWall, isVisited, isPath }) => {
  let bgColor = 'bg-white';
  
  if (isStart) bgColor = 'bg-green-500';
  else if (isEnd) bgColor = 'bg-red-500';
  else if (isWall) bgColor = 'bg-gray-800';
  else if (isPath) bgColor = 'bg-yellow-400';
  else if (isVisited) bgColor = 'bg-blue-300';
  
  return (
    <div className={`${bgColor} border border-gray-300 transition-all duration-200`} />
  );
};

export default Node;