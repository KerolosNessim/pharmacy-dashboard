"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/ui/input-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoBack } from "@/hooks/use-goback";
import { ArrowLeft, Search, Users } from "lucide-react";
const RequestPage = () => {
  const goBack = useGoBack();
  return (
    <section className="flex flex-col gap-6 p-4">
      {/* header */}
      <div className="flex items-center gap-2">
        <Button variant={"ghost"} className="hover:bg-bg" onClick={goBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Request Items</h2>
          <p className="text-muted-foreground text-sm">
            Request items from another branch
          </p>
        </div>
      </div>
      {/* search for items */}
      <div>
        <InputGroup className="bg-bg border-primary/50 outline-0 h-12! rounded-lg  ">
          <InputGroupAddon>
            <Search className="text-primary" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search Products to add..." />
        </InputGroup>
      </div>
      {/* branches */}
      <div>
        <Field>
          <FieldLabel >Request from branch:</FieldLabel>
          <Select >
            <SelectTrigger  className="w-full h-12! bg-bg!">
              <SelectValue
                className="text-sm!"
                placeholder="select branch "
              />
            </SelectTrigger>
            <SelectContent  position="popper" >
              <SelectGroup>
                {Array.from({ length: 10 }).map((_, index) => (
                  <SelectItem
                    className="group text-base!"
                    key={index}
                    value={index.toString()}
                  >
                    <Users className="text-primary group-hover:text-white " />
                    Branch {index + 1}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      {/* button */}
      <Button disabled className="w-full h-12! ">Submit Request</Button>
    </section>
  );
};

export default RequestPage;