"use client";
import { getClinicsApi, getDepartmentsApi } from "@/api/extintions";
import AddClinicDialog from "@/components/extintions/add-clicnc-dialog";
import AddDepartmentDialog from "@/components/extintions/add-department-dialog";
import AddDoctorExtensionDialog from "@/components/extintions/add-doctor-ex-dialog";
import ClinicCard from "@/components/extintions/clinic-card";
import DepartmentCard from "@/components/extintions/department-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/stores/user-store";
import { singleClinic } from "@/types/extintions";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const ExtintionsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<singleClinic | null>(null);
  const { user } = useUserStore();
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartmentsApi(),
  });
  const { data: clinics } = useQuery({
    queryKey: ["clinics"],
    queryFn: () => getClinicsApi(),
  });

  const departmentsList = departments?.data?.data;
  const clinicsList = clinics?.data?.data;
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
      {/* <ExtintionSearch /> */}
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
            {user?.role === "super_admin" && (
              <div className="flex items-center gap-2">
                <AddClinicDialog />
                <AddDoctorExtensionDialog />
              </div>
            )}
          </div>

          {selectedSpecialty ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="text-primary" />
                  <h2 className="text-xl font-bold">
                    {" "}
                    {selectedSpecialty?.name}
                  </h2>
                </div>
                <Button
                  onClick={() => setSelectedSpecialty(null)}
                  variant={"secondary"}
                >
                  <ArrowLeft />
                  Back
                </Button>
              </div>
              <div className="space-y-4">
                {selectedSpecialty?.doctors?.map((doctor) => {
                  return (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between gap-2 bg-bg border rounded p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/30 text-primary size-12 rounded-md flex items-center justify-center">
                          <User />
                        </div>
                        <h2 className=" font-bold">{doctor?.name}</h2>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(doctor?.phone);
                          toast.success("Phone number copied to clipboard");
                        }}
                        variant={"secondary"}
                        className=" text-sm! bg-primary/20 text-primary  rounded-full"
                      >
                        <Phone />
                        <span className="underline">{doctor?.phone}</span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {clinicsList?.map((clinic: singleClinic) => {
                return (
                  <ClinicCard
                    onClick={() => setSelectedSpecialty(clinic)}
                    key={clinic.id}
                    clinic={clinic}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="departments" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="text-primary" />
              <h2 className="text-xl font-bold"> Departments</h2>
            </div>
            {user?.role === "super_admin" && <AddDepartmentDialog />}
          </div>
          <div className="flex flex-col gap-4">
            {departmentsList?.map((department) => {
              return (
                <DepartmentCard key={department.id} department={department} />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ExtintionsPage;
