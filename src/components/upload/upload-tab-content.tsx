import { AlertCircle, File } from "lucide-react";
import React from "react";
import UploadForm from "./upload-form";
import UploadCard from "./upload-card";
import DangerZone from "./danger-zone";

const UploadTabContent = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* alert box */}
      <div className="bg-bg border border-primary/20 rounded-lg p-6 flex flex-col gap-4">
        <h2 className="flex items-center gap-2  font-semibold">
          <AlertCircle className="text-primary" size={20} />
          How it works
        </h2>
        <p className="text-muted-foreground ">
          Upload any file here, then tell me in chat what you want to do with it
          (e.g., &quot;Import offers from the COP file&quot; or &quot;Update
          insurance data&quot;).
        </p>
      </div>
      {/* form */}
      <UploadForm />
      {/* cards */}
      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-muted-foreground font-semibold">
          <File size={16} />
          Saved Files (6)
        </h2>
        {Array.from({ length: 6 }).map((_, i) => (
          <UploadCard key={i} />
        ))}
      </div>
      {/* danger zone */}
      <DangerZone />
    </div>
  );
};

export default UploadTabContent;
