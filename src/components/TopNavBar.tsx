import React from 'react';

interface TopNavBarProps {
  onToggleTutorial: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ onToggleTutorial }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white border-b border-outline-variant shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-max-width mx-auto">
        <h1 className="font-headline-h1 text-headline-h1 text-primary tracking-tight">Cốc Nước Giải Đố</h1>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-tertiary font-bold border-b-2 border-tertiary pb-1 font-label-sm text-label-sm" href="#">Trang chủ</a>
          <a className="text-on-surface-variant font-medium hover:text-tertiary transition-colors duration-200 font-label-sm text-label-sm" href="#">Thử thách</a>
          <a className="text-on-surface-variant font-medium hover:text-tertiary transition-colors duration-200 font-label-sm text-label-sm" href="#">Xếp hạng</a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="bg-tertiary text-on-tertiary px-4 py-2 rounded-lg font-bold hover:scale-[1.03] transition-transform active:translate-y-0.5" 
            onClick={onToggleTutorial}
          >
            Hướng dẫn
          </button>
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-tertiary">settings</span>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-tertiary">account_circle</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
