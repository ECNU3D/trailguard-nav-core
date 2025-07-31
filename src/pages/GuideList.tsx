import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, User, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getGuideEntries = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('guide.entries.basic_first_aid'),
    description: t('guide.entries.basic_first_aid_desc'),
    category: t('guide.list.first_aid'),
    difficulty: t('guide.level.beginner'),
    duration: "10分钟",
    content: "详细的急救处理步骤...",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: t('guide.entries.shelter'),
    description: t('guide.entries.shelter_desc'),
    category: t('guide.list.shelter'),
    difficulty: t('guide.level.intermediate'),
    duration: "30分钟",
    content: "庇护所搭建指南...",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: t('guide.entries.edible_plants'),
    description: t('guide.entries.edible_plants_desc'),
    category: t('guide.list.plants'),
    difficulty: t('guide.level.advanced'),
    duration: "45分钟",
    content: "植物识别详细指南...",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: t('guide.entries.water'),
    description: t('guide.entries.water_desc'),
    category: t('guide.list.survival'),
    difficulty: t('guide.level.intermediate'),
    duration: "25分钟",
    content: "水源寻找和净化方法...",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    title: t('guide.entries.navigation'),
    description: t('guide.entries.navigation_desc'),
    category: t('guide.list.navigation'),
    difficulty: t('guide.level.intermediate'),
    duration: "35分钟",
    content: "导航技能详细说明...",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    title: t('guide.entries.fire'),
    description: t('guide.entries.fire_desc'),
    category: t('guide.list.survival'),
    difficulty: t('guide.level.beginner'),
    duration: "20分钟",
    content: "生火技巧详细步骤...",
    image: "/placeholder.svg"
  }
];

const getCategories = (t: (key: string) => string) => [
  t('guide.list.all'), 
  t('guide.list.first_aid'), 
  t('guide.list.shelter'), 
  t('guide.list.plants'), 
  t('guide.list.survival'), 
  t('guide.list.navigation')
];

interface GuideListProps {
  onSelectEntry: (entryId: number) => void;
}

const GuideList = ({ onSelectEntry }: GuideListProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t('guide.list.all'));
  
  const guideEntries = getGuideEntries(t);
  const categories = getCategories(t);

  const filteredEntries = guideEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === t('guide.list.all') || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedEntries = categories.slice(1).reduce((acc, category) => {
    const entries = filteredEntries.filter(entry => entry.category === category);
    if (entries.length > 0) {
      acc[category] = entries;
    }
    return acc;
  }, {} as Record<string, typeof guideEntries>);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{t('guide.list.title')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t('guide.list.subtitle')}</p>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('guide.list.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>

      {/* 类别筛选 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            className="cursor-pointer text-xs px-3 py-1"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* 分组条目列表 */}
      <div className="space-y-6">
        {Object.entries(groupedEntries).map(([category, entries]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              {category}
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {entries.map((entry) => (
                <Card 
                  key={entry.id} 
                  className="cursor-pointer hover:shadow-mobile transition-all duration-200 border-border"
                  onClick={() => onSelectEntry(entry.id)}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg leading-tight">
                          {entry.title}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1 leading-relaxed">
                          {entry.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                           <span className="truncate">{entry.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{entry.difficulty}</span>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs self-start sm:self-center flex-shrink-0">
                        {entry.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('guide.list.no_results')}</p>
        </div>
      )}
    </div>
  );
};

export default GuideList;
export { getGuideEntries };