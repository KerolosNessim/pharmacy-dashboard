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
import { Pencil, Search, Trash, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const MemberTable = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* search and filter */}
      <div className="flex items-center gap-2">
        <InputGroup className="bg-background! border-0   ">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search by name or ID" />
        </InputGroup>
        <Select defaultValue="all">
          <SelectTrigger className="lg:w-60! bg-background! border-0">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="pharmacist">Pharmacist</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* table */}
      <div className="border rounded-lg! overflow-hidden ">
        <Table className="">
          <TableHeader className="bg-bg ">
            <TableRow className="hover:bg-bg ">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-bg/50">
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted-foreground/5  h-14  px-4 "
              >
                <TableCell>38238{index + 1}</TableCell>
                <TableCell >
                  Abdulaziz Ahmed
                </TableCell>
                <TableCell >
                  <Badge variant="outline">
                    <User />
                    Pharmacist
                  </Badge>
                </TableCell>
                <TableCell >
                  {" "}
                  Olaya Main Pharmacy
                </TableCell>
                <TableCell className="flex items-center gap-2">
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

export default MemberTable;
