import AddPharmacyDialog from "@/components/pharmacies/add-pharmacies-dialog";
import PharmaciesTable from "@/components/pharmacies/pharmacies-table";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";

const PharmaciesPage = () => {
  return (
      <section className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Building2 />
              All Pharmacies
            </CardTitle>
            <CardAction>
              <AddPharmacyDialog />
            </CardAction>
          </CardHeader>
          <CardContent>
            <PharmaciesTable/>
          </CardContent>
        </Card>
      </section>
  );
};

export default PharmaciesPage;
