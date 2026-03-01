import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Pencil, Phone, Search, Trash, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
const DoctorsTable = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* search and filter */}
      <div>
        <InputGroup className="bg-background! border-0   ">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search by name or ID" />
        </InputGroup>
      </div>
      {/* table */}
      <div className="border rounded-lg! overflow-hidden ">
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>Doctor Name</TableHead>
              <TableHead>Extensions</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Hospital Branch</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>Abdulaziz Ahmed</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    <Phone />
                    5030
                  </Badge>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>Ophthalmology Clinic</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Building2 size={16}/> Olaya Hospital
                </TableCell>
                <TableCell className="space-y-1">
                  <Button variant="ghost" size="icon">
                    <Pencil />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorsTable;
