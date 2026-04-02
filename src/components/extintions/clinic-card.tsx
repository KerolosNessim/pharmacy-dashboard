import { singleClinic } from "@/types/extintions";
import { Button } from "../ui/button";

const ClinicCard = ({ clinic, onClick }: { clinic: singleClinic; onClick?: () => void }) => {
  return (
    <Button
      onClick={onClick}
      variant={"secondary"}
      className="h-fit border p-3 justify-start"
    >
      <div className="flex flex-col gap-1">
        <h2>{clinic?.name}</h2>
        <p className="text-muted-foreground text-xs text-start">
          {clinic?.doctors?.length} doctors
        </p>
      </div>
    </Button>
  );
};

export default ClinicCard;
