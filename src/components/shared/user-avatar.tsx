"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/user-store";


interface UserAvatarProps {
  withName?: boolean;
  size?: "sm" | "default" | "lg";
}
const UserAvatar = ({
  withName = true,
  size = "default",
}: UserAvatarProps) => {

  const {user} = useUserStore()
  return (
    <div className="flex items-center gap-2">
      <Avatar size={size}>
        {/* <AvatarImage src={user?.image} /> */}
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      {withName && (
        <div>
          <p className="font-semibold text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
