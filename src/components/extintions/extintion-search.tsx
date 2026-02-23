import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
const ExtintionSearch = () => {
  return (
    <InputGroup className="bg-bg border-0 outline-0 h-12! rounded-lg  ">
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search doctor, department, or extension..." />
    </InputGroup>
  );
};

export default ExtintionSearch;
