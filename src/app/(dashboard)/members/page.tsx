"use client";
import AddDoctorDialog from "@/components/members/add-doctor-dialog";
import AddMemberDialog from "@/components/members/add-member-dialog";
import DoctorsTable from "@/components/members/doctors-table";
import MemberTable from "@/components/members/member-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Stethoscope, Users } from "lucide-react";

const MembersPage = () => {
  const goBack = useGoBack();

  return (
    <section className="p-4 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center gap-2  ">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users />
            Staff & Directory Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage staff members and doctor extensions
          </p>
        </div>
      </div>
      {/* tabs */}
      <Tabs defaultValue="staff" className="flex flex-col gap-6">
        <TabsList className="w-full lg:w-1/3 bg-bg  ">
          <TabsTrigger
            className="data-[state=active]:bg-background!
          data-[state=active]:border-0! border-0"
            value="staff"
          >
            <Users />
            Members
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-background!
          data-[state=active]:border-0! border-0"
            value="doctors"
          >
            <Stethoscope />
            Doctors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Users />
                All Members (50)
              </CardTitle>
              <CardAction>
                <AddMemberDialog />
              </CardAction>
            </CardHeader>
            <CardContent>
              <MemberTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Stethoscope />
                All Doctors (50)
              </CardTitle>
              <CardAction>
                <AddDoctorDialog />
              </CardAction>
            </CardHeader>
            <CardContent>
              <DoctorsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MembersPage;
