import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle, Info, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IdentificationResult } from "@/lib/identification";
import { useLanguage } from "@/contexts/LanguageContext";

const IdentifyResult = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [result, setResult] = useState<IdentificationResult | null>(null);

  useEffect(() => {
    // Get identification result from sessionStorage
    const storedResult = sessionStorage.getItem("identificationResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // If no result data, return to identify page
      navigate("/identify");
    }
  }, [navigate]);

  if (!result) {
    return <div>{t('common.loading')}</div>;
  }

  const getSafetyBanner = (edibility: string) => {
    switch (edibility) {
      case "toxic":
        return {
          icon: AlertTriangle,
          text: t('result.safety.toxic'),
          bgColor: "bg-red-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
      case "not-edible":
        return {
          icon: Info,
          text: t('result.safety.not_edible'),
          bgColor: "bg-yellow-500",
          textColor: "text-black",
          iconColor: "text-black"
        };
      case "edible":
        return {
          icon: CheckCircle,
          text: t('result.safety.edible'),
          bgColor: "bg-green-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
      default:
        return {
          icon: Info,
          text: t('result.safety.not_edible'),
          bgColor: "bg-gray-500",
          textColor: "text-white",
          iconColor: "text-white"
        };
    }
  };

  const safetyInfo = getSafetyBanner(result.bestMatch.edibility);
  const SafetyIcon = safetyInfo.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/identify")}
        className="flex items-center space-x-2 p-0 h-auto"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>{t('common.back')}</span>
      </Button>

      {/* Page title */}
      <div className="text-center space-y-2 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t('result.title')}</h1>
      </div>

      {/* User submitted image */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('result.user_photo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-square max-w-sm mx-auto rounded-lg overflow-hidden">
            <img 
              src={result.userImage} 
              alt={t('result.user_photo')}
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Safety warning banner - most prominent element */}
      <div className={`${safetyInfo.bgColor} ${safetyInfo.textColor} p-4 rounded-lg border-2 border-current shadow-lg`}>
        <div className="flex items-center space-x-3">
          <SafetyIcon className={`h-6 w-6 ${safetyInfo.iconColor} flex-shrink-0`} />
          <div>
            <div className="font-bold text-lg">{safetyInfo.text}</div>
            <div className="text-sm mt-1 opacity-90">
              {t('result.disclaimer')}
            </div>
          </div>
        </div>
      </div>

      {/* Best match result */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {t('result.best_match')}
            <Badge variant="secondary">
              {t('result.confidence')}: {result.bestMatch.confidence}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <img 
                src={result.bestMatch.referenceImage}
                alt={result.bestMatch.commonName}
                className="w-full aspect-square rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">{result.bestMatch.commonName}</h3>
              <p className="text-muted-foreground italic">{result.bestMatch.scientificName}</p>
              <Button 
                onClick={() => navigate(`/guide/${result.bestMatch.guideId}`)}
                className="w-full sm:w-auto"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {t('result.view_details')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other possible matches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('result.other_matches')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {result.otherMatches.map((match, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg border">
                <img 
                  src={match.image}
                  alt={match.name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{match.name}</div>
                  <div className="text-xs text-muted-foreground">{match.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="bg-muted rounded-lg p-4 text-center">
        <div className="text-sm text-muted-foreground">
          <strong>{t('result.disclaimer_title')}：</strong>{t('result.disclaimer')}
        </div>
      </div>
    </div>
  );
};

export default IdentifyResult;