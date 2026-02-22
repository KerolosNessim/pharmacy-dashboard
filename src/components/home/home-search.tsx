import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Camera, Search } from "lucide-react";
const HomeSearch = () => {
  return (
      <InputGroup className="bg-bg border-0 outline-0 h-12! rounded-lg  ">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search products, SKU, or barcode..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton className="bg-primary/30 text-primary h-9! hover:bg-primary/50! hover:text-primary">
            <Camera className="size-5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
  )
}

export default HomeSearch