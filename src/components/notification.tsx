import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; 
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(percentage);

      if (elapsed >= duration) {
        setVisible(false);
        clearInterval(interval);
      }
    }, 40); 

    return () => clearInterval(interval);
  }, [duration]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "bg-[var(--color-primary-1)]"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div className={`fixed bottom-4 right-4 w-80 rounded-md shadow-lg overflow-hidden`}>
      <div className={`px-4 py-3 text-white font-semibold ${bgColor}`}>
        {message}
      </div>
      <div className="h-1 bg-[var(--color-primary-2)]">
        <div
          className="h-1 bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Notification;
