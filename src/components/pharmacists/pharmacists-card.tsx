"use client";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Phone, Save, X } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

const PharmacistsCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="w-full p-4 rounded-lg border hover:bg-muted-foreground/5 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
      {/* details */}
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Abdulaziz</p>
        <div className="flex items-center gap-2">
          <Badge variant="success">Main Pharmacy</Badge>
          <Badge variant="outline">Olaya Main Pharmacy</Badge>
          <p className="text-muted-foreground text-sm">ID: 396127</p>
        </div>
      </div>
      {/* actions */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input type="text" placeholder="+966501234567" className="focus-visible:ring-primary" />
          <Button onClick={() => setIsEditing(false)}>
            <Save />
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            <X />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm italic">Not set</p>
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Phone />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default PharmacistsCard;
