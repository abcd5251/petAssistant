import React, { useState } from 'react';


interface LatestNewsProps {
  isOpen: boolean;
  onClose: () => void;
  setShowNews: (show: boolean) => void;
}

export default function NewsPopup({ isOpen, onClose, setShowNews }: LatestNewsProps ) {
  
  

  if (!isOpen) return null;

  return (
<>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className='bg-gray-900/80 absolute t-0 left-0 w-full h-full z-0'></div>
        <div className="bg-[#1E90FF] text-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[600px] max-h-[600px] flex flex-col z-10 relative">
          {/* Header */}
            <div className="w-full flex items-center justify-between p-4">
                <img 
                    src="/News/topic.svg" 
                    className="h-10 absolute right-55 top-2"
                />
                <img 
                    src="/morpho/cancel.svg" 
                    className="h-10 absolute -right-2 top-2 cursor-pointer"
                    onClick={onClose}
                />
            </div>

            <img 
                src="/News/information.svg" 
                className="h-180"
                onClick={onClose}
            />

            
            </div>
          </div>
    </>
  );
}