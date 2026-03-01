import DangerZone from "./danger-zone";
import UploadHistoryCard from "./upload-history-card";

const UploadHistoryContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Files that have been processed (offers/insurance imported)
      </p>
      {/* upload history cards */}
      {
        Array.from({ length: 5 }).map((_, index) => (
          <UploadHistoryCard key={index} />
        ))
      }
      {/* danger zone */}
      <DangerZone />
    </div>
  );
};

export default UploadHistoryContent;
