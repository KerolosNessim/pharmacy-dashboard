import AddPharmacistDialog from "@/components/pharmacists/add-pharmacist-dialog";
import PharmacistStaffTable from "@/components/pharmacists/pharmacist-staff-table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

const PharmacistsStaffPage = () => {
  return (
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Users />
              All Pharmacists Staff
            </CardTitle>
            <CardAction>
              <AddPharmacistDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <PharmacistStaffTable />
          </CardContent>
        </Card>
      </section>
  );
};

export default PharmacistsStaffPage;
