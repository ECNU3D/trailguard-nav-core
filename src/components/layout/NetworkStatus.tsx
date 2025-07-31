import { useState, useEffect } from "react";
import { CloudOff, Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NetworkStatus = () => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center">
      <div className="flex items-center justify-center space-x-2 text-sm text-yellow-800">
        <CloudOff className="h-4 w-4" />
        <span>{t("network.offline")}</span>
      </div>
    </div>
  );
};

export default NetworkStatus;