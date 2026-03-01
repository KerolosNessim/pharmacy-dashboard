import { Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const UploadHistoryCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between ">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="text-primary" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge className="rounded-sm">Offers</Badge>
                <Badge variant={"outline"} className="rounded-sm border-2">
                  completed
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Jan 1, 2026 - Jan 31, 2026
                <br />
                rows processed{" "}
              </p>
            </div>
          </div>
          {/* date */}
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">Jan 1, 2026</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadHistoryCard;
