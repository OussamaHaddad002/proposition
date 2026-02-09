import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
}

interface TourGuideProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function TourGuide({ steps, isActive, onComplete, onSkip }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    const updateTargetPosition = () => {
      if (step?.target) {
        // Wait a bit for the page to render
        setTimeout(() => {
          const targetElement = document.querySelector(step.target);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setTargetRect(rect);
            setIsVisible(true);
            // Scroll target into view smoothly
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [currentStep, step, isActive]);

  if (!isActive || !isVisible || !targetRect || !step) return null;

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };

  // Calculate modal position based on target and placement
  const getModalPosition = () => {
    const modalWidth = 400;
    const modalHeight = modalRef.current?.offsetHeight || 200;
    const padding = step.highlightPadding || 8;
    const offset = 20;

    let top = 0;
    let left = 0;

    switch (step.placement) {
      case 'top':
        top = targetRect.top - modalHeight - offset;
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - modalHeight / 2;
        left = targetRect.left - modalWidth - offset;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - modalHeight / 2;
        left = targetRect.right + offset;
        break;
      default:
        // Auto placement - try bottom first
        if (targetRect.bottom + modalHeight + offset < window.innerHeight) {
          top = targetRect.bottom + offset;
        } else {
          top = targetRect.top - modalHeight - offset;
        }
        left = targetRect.left + targetRect.width / 2 - modalWidth / 2;
    }

    // Keep modal within viewport
    if (left < 20) left = 20;
    if (left + modalWidth > window.innerWidth - 20) left = window.innerWidth - modalWidth - 20;
    if (top < 20) top = 20;
    if (top + modalHeight > window.innerHeight - 20) top = window.innerHeight - modalHeight - 20;

    return { top, left };
  };

  const modalPosition = getModalPosition();
  const padding = step.highlightPadding || 8;

  return (
    <>
      {/* Dark Overlay with hole */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="highlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={targetRect.left - padding}
                y={targetRect.top - padding}
                width={targetRect.width + padding * 2}
                height={targetRect.height + padding * 2}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#highlight-mask)"
          />
        </svg>
      </div>

      {/* Highlight border */}
      <div
        className="fixed z-[9999] rounded-xl pointer-events-none"
        style={{
          top: targetRect.top - padding,
          left: targetRect.left - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
          boxShadow: '0 0 0 3px rgba(253, 121, 88, 0.8), 0 0 20px 10px rgba(253, 121, 88, 0.3)',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />

      {/* Tour Modal */}
      <div
        ref={modalRef}
        className="fixed z-[10000] animate-fade-in"
        style={{
          top: modalPosition.top,
          left: modalPosition.left,
          width: '400px',
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-accent/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-accent-dark px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={20} />
              <span className="font-semibold">Visite guidée</span>
              <span className="text-white/70 text-sm">• {currentStep + 1}/{steps.length}</span>
            </div>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.content}</p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >
              <ArrowLeft size={16} />
              <span>Précédent</span>
            </button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-accent'
                      : index < currentStep
                      ? 'w-1.5 bg-green-400'
                      : 'w-1.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors group text-sm"
            >
              <span>{isLastStep ? 'Terminer' : 'Suivant'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Arrow pointing to target */}
        <div
          className="absolute w-4 h-4 bg-white transform rotate-45 border-accent/20"
          style={{
            top: step.placement === 'bottom' ? '-8px' : step.placement === 'top' ? 'auto' : '50%',
            bottom: step.placement === 'top' ? '-8px' : 'auto',
            left: step.placement === 'left' || step.placement === 'right' ? (step.placement === 'right' ? '-8px' : 'auto') : '50%',
            right: step.placement === 'left' ? '-8px' : 'auto',
            transform: step.placement === 'left' || step.placement === 'right' ? 'translateY(-50%) rotate(45deg)' : 'translateX(-50%) rotate(45deg)',
            borderTop: step.placement === 'bottom' ? '2px solid rgba(253, 121, 88, 0.2)' : 'none',
            borderLeft: step.placement === 'bottom' || step.placement === 'right' ? '2px solid rgba(253, 121, 88, 0.2)' : 'none',
            zIndex: -1,
          }}
        />
      </div>

      {/* Tour skip button - floating */}
      <div className="fixed bottom-6 right-6 z-[10000]">
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-lg text-sm hover:bg-white shadow-lg border border-gray-200 transition-colors"
        >
          Passer le tutoriel
        </button>
      </div>
    </>
  );
}
