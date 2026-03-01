import { Download, FileSpreadsheet, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const DataSyncCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex lg:items-center lg:justify-between flex-col lg:flex-row gap-4 ">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="text-primary size-6 shrink-0" />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold line-clamp-1">
                COP_2_(1-15_Feb)_&_Founding_Day_(21-24_Feb)2026_Summary+List_1771002247332.xlsx
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant={"success"} className="rounded-sm!">
                  offers
                </Badge>
                <p>672 rows / 672 matched</p>
                <p>Feb 13, 2026</p>
              </div>
            </div>
          </div>
          {/* buttons */}
          <Button variant={"outline"}>
            <Download />
            Process
          </Button>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSyncCard;
