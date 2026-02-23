import ClinicCard from "@/components/extintions/clinic-card";
import DepartmentCard from "@/components/extintions/department-card";
import ExtintionSearch from "@/components/extintions/extintion-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Building2, CreditCard } from "lucide-react";
const ExtintionsPage = () => {
  return (
    <section className="p-4 flex flex-col gap-4">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold">Extensions</h1>
        <p className="text-muted-foreground">
          Find doctor and department contact information
        </p>
      </div>
      {/* search */}
      <ExtintionSearch />
      {/* tabs */}
      <Tabs defaultValue="clinic" className="gap-4">
        <TabsList className="w-full bg-bg h-12!">
          <TabsTrigger
            className="data-[state=active]:bg-background! data-[state=active]:border-0! border-0"
            value="clinic"
          >
            Clinics & Doctors
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-background! data-[state=active]:border-0!  border-0"
            value="departments"
          >
            Departments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clinic" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Browse by Specialty</h2>
            <p className="text-sm text-muted-foreground">295 doctors total</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 13 }).map((_, i) => {
              return <ClinicCard key={i} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="departments" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" />
            <h2 className=" font-bold">General Departments</h2>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => {
              return <DepartmentCard key={i} />;
            })}
          </div>
          <div className="flex items-center gap-2">
            <CreditCard  className="text-primary" />
            <h2 className=" font-bold">Insurance Departments</h2>
          </div>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => {
              return <DepartmentCard key={i} insurance />;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default ExtintionsPage