import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: string; 
  message: string;
  type?: ToastType;
  duration?: number; 
  onClose?: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), duration - 300);
    const removeTimer = setTimeout(() => onClose?.(id), duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [duration, id, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${bgColor} text-white px-4 py-2 rounded shadow flex justify-between items-center max-w-xs w-full transition-all duration-300 transform ${
        fadeOut ? "opacity-0 translate-x-20" : "opacity-100 translate-x-0"
      }`}
    >
      <span>{message}</span>
      <button onClick={() => onClose?.(id)} className="ml-2 font-bold hover:text-gray-200">
        ×
      </button>
    </div>
  );
};

export default Toast;
