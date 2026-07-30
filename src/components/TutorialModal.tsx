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
              Làm sao để lấy được đúng số lít nước yêu cầu? Bạn chỉ có thể bơm <b>ĐẦY</b> bình hoặc làm <b>TRỐNG</b> bình thôi nha. Cẩn thận đừng làm tràn nước ra ngoài!
            </p>
          </div>

          {/* Slide 2: Bơm nước */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 1 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-32 glass-jug rounded-b-xl border-t-0 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-full bg-cube-blue/40">
                    <div className="water-surface-layer"></div>
                    <div className="water-surface-layer"></div>
                  </div>
                </div>
                <div className="p-4 rounded-full bg-cube-blue text-white shadow-lg">
                  <span className="material-symbols-outlined text-4xl">format_color_fill</span>
                </div>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Bơm nước</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Hãy chọn một bình và bấm nút <b>Bơm đầy</b> để lấy nước nhé.
            </p>
          </div>

          {/* Slide 3: Rót chuyển */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 2 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-6">
              <div className="flex items-center gap-6 relative">
                <div className="w-20 h-28 glass-jug rounded-b-xl border-t-0 relative overflow-hidden flex flex-col justify-end">
                  <div className="w-full h-3/4 bg-cube-blue/60 relative">
                    <div className="water-surface-layer"></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-tertiary text-4xl animate-pulse">transform</span>
                  <span className="text-xs font-bold text-tertiary mt-1">Rót sang</span>
                </div>
                <div className="w-16 h-24 glass-jug rounded-b-xl border-t-0 relative overflow-hidden flex flex-col justify-end">
                  <div className="w-full h-1/3 bg-cube-blue/60 relative">
                    <div className="water-surface-layer"></div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Rót chuyển</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Chọn bình đang có nước, rồi chọn một bình khác để rót sang nhé.
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
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Đổ nước đi</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Muốn làm trống bình? Hãy chọn bình và ấn nút <b>Đổ đi</b> nha.
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
              Dùng <b>Hoàn tác</b> để đi lại bước trước, hoặc <b>Chơi lại</b> từ đầu nếu bạn bị kẹt nhé.
            </p>
          </div>

          {/* Slide 6: Thắng như thế nào */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 5 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-6 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center p-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-32 glass-jug rounded-b-xl border-t-0 border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] relative overflow-hidden flex flex-col justify-end">
                    <div className="w-full h-1/2 bg-cube-blue/80 relative">
                      <div className="water-surface-layer"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-blue-950 bg-white/80 px-3 py-1 rounded-full shadow-sm">4L</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-yellow-500 text-5xl absolute -top-4 -right-4 drop-shadow-md animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                    emoji_events
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Chiến thắng</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Bạn sẽ chiến thắng khi có <b>MỘT BÌNH</b> chứa đúng số lít nước yêu cầu nhé!
            </p>
          </div>

          {/* Slide 7: Bắt đầu chơi thôi */}
          <div className={`tutorial-slide p-8 flex flex-col items-center justify-center h-full text-center ${currentSlide !== 6 ? 'hidden' : ''}`}>
            <div className="w-full max-w-xs mb-8 overflow-hidden rounded-xl flex items-center justify-center h-[160px]">
              <span className="material-symbols-outlined text-tertiary text-9xl animate-bounce">rocket_launch</span>
            </div>
            <h2 className="text-on-surface font-headline-h1 text-2xl md:text-3xl mb-4">Cùng bắt đầu chơi nào!</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Thử thách đang chờ đợi bạn phía trước. Chúc bạn giải đố thật vui nhé!
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
