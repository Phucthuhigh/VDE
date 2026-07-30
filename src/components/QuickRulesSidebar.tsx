import React from 'react';

interface QuickRulesSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const QuickRulesSidebar: React.FC<QuickRulesSidebarProps> = ({ isExpanded, onToggle }) => {
  return (
    <aside 
      className={`relative transition-all duration-500 ease-in-out flex flex-col ${
        isExpanded ? 'w-full lg:w-72' : 'w-full lg:w-12'
      }`}
    >
      {/* Toggle Button for Desktop */}
      <button 
        onClick={onToggle}
        className="hidden lg:flex absolute top-1/2 -left-6 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg border border-outline-variant/30 text-primary hover:scale-110 transition-transform z-20"
      >
        <span className="material-symbols-outlined">
          {isExpanded ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* Toggle Button for Mobile */}
      <button 
        onClick={onToggle}
        className="lg:hidden w-full bg-white/50 backdrop-blur-sm py-2 text-center text-primary font-bold shadow-sm mb-4 rounded-xl border border-white flex justify-center items-center gap-2"
      >
        <span>{isExpanded ? 'Ẩn luật chơi' : 'Hiện luật chơi'}</span>
        <span className="material-symbols-outlined">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-500 flex-1 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        <div className={`glass-panel p-6 rounded-2xl flex-1 flex flex-col gap-6 w-full lg:w-72 h-full ${!isExpanded ? 'lg:opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-2xl">menu_book</span>
            <h3 className="font-headline-h2 text-xl whitespace-nowrap">Luật chơi nhanh</h3>
          </div>

          <ul className="space-y-4 text-on-surface-variant font-body-md text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-cube-blue mt-1">water_drop</span>
              <div className="min-w-[150px]">
                <strong className="text-on-surface block">Mục tiêu</strong>
                <p>Đong đúng số lít nước yêu cầu.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-cube-blue mt-1">format_color_fill</span>
              <div className="min-w-[150px]">
                <strong className="text-on-surface block">Bơm đầy</strong>
                <p>Lấy nước từ nguồn để làm đầy 100% bình.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-lava-orange mt-1">delete_forever</span>
              <div className="min-w-[150px]">
                <strong className="text-on-surface block">Đổ đi</strong>
                <p>Đổ sạch nước trong bình ra ngoài.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary mt-1">transform</span>
              <div className="min-w-[150px]">
                <strong className="text-on-surface block">Rót chuyển</strong>
                <p>Chọn bình có nước, chọn tiếp bình khác để rót sang.</p>
              </div>
            </li>
          </ul>

          <div className="mt-auto pt-6 border-t border-white/20">
            <p className="text-xs text-on-surface-variant italic min-w-[150px]">
              Mẹo: Nước sẽ ngừng chảy khi bình rót hết, hoặc bình nhận đầy.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
