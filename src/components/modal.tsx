import React, { ReactNode } from "react";

interface ModalButton {
  label: string;
  onClick: () => void;
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  buttons?: ModalButton[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  buttons,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      ></div>
      <div
        className="relative bg-[var(--background)] rounded-lg shadow-2xl z-10
                   w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
                   p-4 sm:p-5 md:p-6 lg:p-8 text-[var(--color-text-1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        {buttons && buttons.length > 0 && (
          <div className="mt-6 flex justify-end gap-3">
            {buttons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className={`px-4 py-2 rounded-md font-semibold hover:opacity-90 transition ${
                  btn.className || "bg-blue-500 text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
