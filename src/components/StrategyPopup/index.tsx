import React, { useState } from 'react';
import AIStrategy from '../AIStrategy';

interface StrategyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StrategyPopup({ isOpen, onClose }: StrategyPopupProps) {
  const [showAIStrategy, setShowAIStrategy] = useState(false);
  const handleAIStrategyClick = () => {
    setShowAIStrategy(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#1E90FF] text-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[600px]">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white pb-2">
            <h2 className="text-xl font-bold uppercase tracking-wide">
              Safe Harbor
            </h2>
            <button
              onClick={onClose}
              className="text-white text-xl font-bold hover:text-gray-300"
            >
              ✖
            </button>
          </div>

          {/* Body */}
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">
              Morpho Lending Strategy
            </h3>
            <p className="text-sm mb-4">
              Use Gauntlet WETH Prime Vault in Morpho to help you earn a steady
              return on your WETH. It provides you with a stable and low-risk
              income.
            </p>

            <div className="flex items-center gap-x-4 mb-4">
              <a
                href="https://app.morpho.org/vault/?vault=897a21a1-45"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:text-gray-300"
              >
                https://app.morpho.org/vault/?vault=897a21a1-45
              </a>
            </div>

            {/* APY Section */}
            <div className="flex items-center justify-between bg-black bg-opacity-20 px-4 py-2 rounded-md mb-4">
              <div className="flex items-center gap-x-2">
                <span className="text-lg">💙</span>
                <span className="font-bold text-lg">APY: 3.72%</span>
              </div>
              <span className="px-3 py-1 bg-green-500 text-sm font-bold rounded-md">
                Low Risk
              </span>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-center gap-y-2">
              <button 
                  onClick={handleAIStrategyClick}
                  className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 w-full"
                >
                Your AI Strategist
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-200 w-full font-bold">
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
      <AIStrategy 
        isOpen={showAIStrategy} 
        onClose={() => setShowAIStrategy(false)} 
      />
    </>
  );
}