"use client";
import { useUserStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { Loader2, LogOut } from "lucide-react";
import { logoutApi } from "@/api/auth";
import { deleteToken } from "@/actions/auth";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LogoutBtn = () => {
  const [loading, setLoading] = useState(false);
  const { removeUser } = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    const res = await logoutApi();
    console.log(res);
    
    if (res?.ok) {
      await deleteToken();
      removeUser();
      toast.success(res?.data?.message);
      router.push("/login");
    } else {
      toast.error(res?.error);
    }
    setLoading(false);
  };
  return (
    <Button
      disabled={loading}
      variant="destructive"
      className="cursor-pointer"
      onClick={handleLogout}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Sign Out
        </>
      )}
    </Button>
  );
};

export default LogoutBtn;
