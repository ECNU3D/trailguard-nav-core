import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, User, Search } from "lucide-react";

const guideEntries = [
  {
    id: 1,
    title: "基础急救处理",
    description: "处理外伤、止血和紧急医疗情况的基本方法",
    category: "急救",
    difficulty: "初级",
    duration: "10分钟",
    content: "详细的急救处理步骤...",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "搭建临时庇护所",
    description: "使用自然材料快速搭建可靠的临时避难所",
    category: "庇护所",
    difficulty: "中级",
    duration: "30分钟",
    content: "庇护所搭建指南...",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "可食用野生植物识别",
    description: "识别常见可食用植物，避免有毒物种",
    category: "植物",
    difficulty: "高级",
    duration: "45分钟",
    content: "植物识别详细指南...",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "寻找和净化水源",
    description: "在野外寻找安全水源并进行基本净化",
    category: "生存",
    difficulty: "中级",
    duration: "25分钟",
    content: "水源寻找和净化方法...",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    title: "户外导航基础",
    description: "使用指南针和自然标志进行方向定位",
    category: "导航",
    difficulty: "中级",
    duration: "35分钟",
    content: "导航技能详细说明...",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    title: "生火技巧",
    description: "在各种天气条件下安全生火的方法",
    category: "生存",
    difficulty: "初级",
    duration: "20分钟",
    content: "生火技巧详细步骤...",
    image: "/placeholder.svg"
  }
];

const categories = ["全部", "急救", "庶所", "植物", "生存", "导航"];

interface GuideListProps {
  onSelectEntry: (entryId: number) => void;
}

const GuideList = ({ onSelectEntry }: GuideListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const filteredEntries = guideEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "全部" || entry.category === selectedCategory;
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">户外生存指南</h1>
        <p className="text-sm sm:text-base text-muted-foreground">探索自然，安全第一</p>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索指南内容..."
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
          <p className="text-muted-foreground">没有找到相关指南</p>
        </div>
      )}
    </div>
  );
};

export default GuideList;
export { guideEntries };