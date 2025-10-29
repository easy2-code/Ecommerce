import React, { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { logoutUserThunk } from "@/store/auth-slice";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        toast.success("Logout successful ✅", {
          description: "You have been signed out successfully.",
        });
        navigate("/auth/login");
      })
      .catch((error) => {
        toast.error(error || "Logout failed ❌");
      })
      .finally(() => setLoading(false));
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          disabled={loading}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow cursor-pointer"
        >
          {loading ? (
            <>
              <Spinner className="w-4 h-4" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut />
              Logout
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
