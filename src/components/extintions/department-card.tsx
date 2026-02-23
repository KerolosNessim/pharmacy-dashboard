import { Building2, CreditCard, Phone } from "lucide-react";
import { Button } from "../ui/button";

const DepartmentCard = ({insurance = false }: {insurance?: boolean}) => {
  return (
    <div className=" rounded-lg p-4 bg-bg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary/30 text-primary size-12 rounded-md flex items-center justify-center">
          {insurance ? <CreditCard /> : <Building2 />}
        </div>
        <h2 className=" font-bold">
          {insurance ? "Medgulf" : "Employee Clinic"}
        </h2>
      </div>
      <Button
        variant={"secondary"}
        className=" bg-primary/20 text-primary text-lg rounded-full"
      >
        <Phone />
        <span className="underline">5050</span>
      </Button>
    </div>
  );
};

export default DepartmentCard;
