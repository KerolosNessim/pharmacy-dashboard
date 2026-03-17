"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/user-store";

interface UserAvatarProps {
  withName?: boolean;
  size?: "sm" | "default" | "lg";
}
const UserAvatar = ({ withName = true, size = "default" }: UserAvatarProps) => {
  const { user } = useUserStore();
  return (
    <div className="flex items-center gap-2">
      <Avatar size={size}>
        {/* <AvatarImage src={user?.image} /> */}
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      {withName && (
        <div>
          <p className="font-semibold text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            {user?.role}
            {user?.pharmacy_id && (
              <>
                <span className="mr-1 size-1 rounded-full bg-primary block"></span>
                <span className="text-xs text-muted-foreground">
                  {user?.pharmacy_name}
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
