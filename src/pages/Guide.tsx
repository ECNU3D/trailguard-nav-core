import { useState } from "react";
import GuideList from "./GuideList";
import GuideDetail from "./GuideDetail";

const Guide = () => {
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  const handleSelectEntry = (entryId: number) => {
    setSelectedEntryId(entryId);
  };

  const handleGoBack = () => {
    setSelectedEntryId(null);
  };

  if (selectedEntryId !== null) {
    return (
      <GuideDetail 
        entryId={selectedEntryId} 
        onGoBack={handleGoBack}
      />
    );
  }

  return (
    <GuideList onSelectEntry={handleSelectEntry} />
  );
};

export default Guide;