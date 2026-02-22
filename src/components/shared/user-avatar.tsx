import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface UserAvatarProps {
  withName?: boolean;
  size?: "sm" | "default" | "lg";
}
const UserAvatar = ({
  withName = true,
  size = "default",
}: UserAvatarProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={size}>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      {withName && (
        <div>
          <p className="font-semibold text-sm">Alrashidi</p>
          <p className="text-xs text-muted-foreground">Neuro Pharmacy</p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
