import React, { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;

  if (!isOpen) return null;

  const moveSlide = (dir: number) => {
    setCurrentSlide((prev) => (prev + dir + totalSlides) % totalSlides);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-on-background/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative border border-outline-variant/50">
        <button 
          className="absolute top-4 right-4 text-on-surface hover:rotate-90 transition-transform z-10" 
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="relative h-[450px] overflow-y-auto overflow-x-hidden">
          {/* Slide 1: Luật chơi */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center transition-opacity ${currentSlide !== 0 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-tertiary text-7xl">gavel</span>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Luật chơi</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Đong lượng nước yêu cầu bằng các bình không có vạch chia. Bạn chỉ có thể đổ <b>ĐẦY</b> bình hoặc <b>LÀM TRỐNG</b> bình. Đừng để nước tràn ra ngoài nhé!
            </p>
          </div>

          {/* Slide 2: Bơm nước */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 1 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-32 glass-jug rounded-b-xl border-t-0 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full bg-cube-blue/40 water-surface"></div>
                </div>
                <div className="p-4 rounded-full bg-cube-blue text-white shadow-lg">
                  <span className="material-symbols-outlined text-4xl">format_color_fill</span>
                </div>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Bơm nước</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Chọn một bình và nhấn biểu tượng <b>vòi nước</b> để lấy nước từ nguồn vô tận vào bình.
            </p>
          </div>

          {/* Slide 3: Rót chuyển */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 2 ? 'hidden' : ''}`}>
            <div className="w-full max-w-sm mb-6 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
              <img alt="Minh họa rót nước" className="w-full h-auto object-cover max-h-[160px]" src="https://lh3.googleusercontent.com/aida/AP1WRLtCUCUEyDN99RiCM9Czk2s89ObXUJQ9c-aPtRRcfLrY_NgEgusEW5zAHYSvgFYnp8BalR30dP4Lr5m4XMbewbAtkqxnev1y6Eh3B3PdlS2egh2Q6WXaMovOn1xSEoQSqjPNW2jElgZyZvQntCrkJeMR4rPAlo-4O1hr7TpQ1aLYydYan2kYNsZaXg4ilyiwHtX4bjFclXmPKcT59RO5YkBky-39CsWqHa62oy635ZaTpqPfWTUlWdRuaK9X"/>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Rót chuyển</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Chọn bình đang có nước, sau đó chọn bình khác để rót qua. Nước sẽ chảy cho đến khi bình nhận <b>đầy</b> hoặc bình rót <b>hết</b>.
            </p>
          </div>

          {/* Slide 4: Huỷ nước */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 3 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-32 glass-jug rounded-b-xl border-t-0 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-cube-blue/40"></div>
                </div>
                <div className="p-4 rounded-full bg-lava-orange text-white shadow-lg">
                  <span className="material-symbols-outlined text-4xl">delete_forever</span>
                </div>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Huỷ nước</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Nếu cần làm trống bình, hãy chọn bình đó và nhấn biểu tượng <b>thùng rác</b>.
            </p>
          </div>

          {/* Slide 5: Hoàn tác & Reset */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 4 ? 'hidden' : ''}`}>
            <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-sm">
              <div className="flex flex-col items-center gap-2 p-4 bg-surface-container-high rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-4xl">undo</span>
                <span className="font-bold text-xs">Hoàn tác</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-error-container rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-error text-4xl">restart_alt</span>
                <span className="font-bold text-xs">Chơi lại</span>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Hỗ trợ</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Sử dụng <b>Hoàn tác</b> để quay lại bước trước hoặc <b>Chơi lại</b> để bắt đầu lại từ đầu nếu bạn bị kẹt.
            </p>
          </div>

          {/* Slide 6: Thắng như thế nào */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 5 ? 'hidden' : ''}`}>
            <div className="w-full max-w-sm mb-6 overflow-hidden rounded-xl bg-slate-100 shadow-inner">
              <img alt="Mục tiêu thắng lợi" className="w-full h-auto object-cover max-h-[160px]" src="https://lh3.googleusercontent.com/aida/AP1WRLutJWi1tP0eAHn0CHqwUsxvzj7EkxOGaN4nV93ZG6oXypZIQvq9X4y6-X4svjW1wDZs8DicpXhPXvCQO6UQwfk_CpL3aVgnzI3fCiQ8LeUb6PiRzgz7_pCYxq9CNLx69ooc1hamxWObM5oqXHzjwCJFz8jIZ7_6NK7BuuzM5OedZJ8oW_R1hKcJewmHkJdLzpEyXwBiCR2cvqfft-dcqqS3BhDPXZirMMyJXDvSMJSpTXtkjs29yfzG9JPm"/>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Thắng như thế nào</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Bạn thắng khi có ít nhất <b>MỘT BÌNH</b> chứa đúng lượng nước yêu cầu (ví dụ: 4 Lít).
            </p>
          </div>

          {/* Slide 7: Bắt đầu chơi thôi */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 6 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-8 overflow-hidden rounded-xl flex items-center justify-center h-[160px]">
              <span className="material-symbols-outlined text-tertiary text-9xl animate-bounce">rocket_launch</span>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Bắt đầu chơi thôi!</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Thử thách đang chờ đợi bạn. Chúc bạn có những giây phút giải đố thật thú vị!
            </p>
            <button 
              className="bg-tertiary text-on-tertiary px-12 py-3 rounded-full font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all" 
              onClick={onClose}
            >
              BẮT ĐẦU NGAY
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center px-8 pb-8">
          <button 
            className="p-2 text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-1 font-bold" 
            onClick={() => moveSlide(-1)}
            style={{ visibility: currentSlide === 0 ? 'hidden' : 'visible' }}
          >
            <span className="material-symbols-outlined">chevron_left</span> Quay lại
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all ${i === currentSlide ? 'bg-tertiary w-6' : 'bg-outline-variant/30 w-2'}`}
              ></div>
            ))}
          </div>
          
          <button 
            className="p-2 text-on-surface-variant hover:text-tertiary transition-colors flex items-center gap-1 font-bold" 
            onClick={() => moveSlide(1)}
            style={{ visibility: currentSlide === totalSlides - 1 ? 'hidden' : 'visible' }}
          >
            Tiếp tục <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
