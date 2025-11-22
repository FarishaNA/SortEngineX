import React from 'react';

const ArrayBars = ({ array, comparing, swapping, sorted, current, pivot }) => {
  const maxValue = Math.max(...array);
  
  return (
    <div className="flex items-end justify-center gap-1 h-96 p-8">
      {array.map((value, idx) => {
        let bgColor = 'bg-blue-500';
        
        if (sorted.includes(idx)) bgColor = 'bg-green-500';
        else if (pivot === idx) bgColor = 'bg-purple-500';
        else if (comparing.includes(idx)) bgColor = 'bg-yellow-500';
        else if (swapping.includes(idx)) bgColor = 'bg-red-500';
        else if (current === idx) bgColor = 'bg-orange-500';
        
        const height = (value / maxValue) * 100;
        
        return (
          <div
            key={idx}
            className={`${bgColor} transition-all duration-200 flex-1 max-w-16 rounded-t`}
            style={{ height: `${height}%` }}
          >
            <div className="text-xs text-white text-center pt-1">{value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ArrayBars;