import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const { t, language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-base sm:text-xl text-muted-foreground mb-4">
          {t("common.error")} 404
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {language === 'zh' ? '抱歉，您访问的页面不存在或已被移除' : 'Sorry, the page you are looking for does not exist or has been removed'}
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-forest-primary text-white rounded-lg hover:bg-forest-primary/90 transition-colors"
        >
          {language === 'zh' ? '返回首页' : 'Back to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
