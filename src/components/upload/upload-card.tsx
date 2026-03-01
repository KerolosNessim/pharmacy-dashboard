import { Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const UploadCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between ">
          
        <div className="flex items-start gap-2">
          <FileSpreadsheet className="text-primary" />
          <div>
            <h3 className="font-semibold">RAMADAN COP 3 (16FEB - 31MAR) 2026 Summary+ Final List.xlsx</h3>
            <p className="text-muted-foreground text-sm">
              125.27 KB Feb 14, 2026
            </p>
          </div>
          </div>
          {/* buttons */}
          <div className="flex items-center gap-2">
            <Button variant={"secondary"} size={"icon"}><Download/></Button>
            <Button variant={"secondary"} size={"icon"}><Trash2 className="text-red-500"/></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
