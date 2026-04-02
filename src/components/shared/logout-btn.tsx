"use client";
import { logoutApi } from "@/api/auth";
import { useUserStore } from "@/stores/user-store";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const LogoutBtn = () => {
  const [loading, setLoading] = useState(false);
  const { removeUser } = useUserStore();
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    const res = await logoutApi();
    console.log(res);

    if (res?.ok) {
      fetch("/api/logout", {
        method: "POST",
      }).then(() => {
        removeUser();
        toast.success(res?.data?.message);
        router.refresh();
        router.push("/login");
      });
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
