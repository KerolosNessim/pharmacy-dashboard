import { useUserStore } from "@/stores/user-store";
import { Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";

const UserInfo = () => {
  const { user } = useUserStore();
  return (
    <div className="bg-bg rounded-lg p-4 flex items-center gap-4 ">
      {/* image */}
      <Avatar className="size-16">
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>
      {/* info */}
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-lg">{user?.name}</h2>
        <p className="text-muted-foreground text-sm">ID:{user?.id_number}</p>
        {
          user?.pharmacy_id && (
            <p className="text-muted-foreground text-sm">Pharmacy:{user?.pharmacy_name}</p>
          )
        }
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="pending">
            <Shield />
            {user?.role}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
