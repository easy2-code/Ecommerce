// components/shopping-view/ShoppingHeader.jsx
import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItem } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { logoutUserThunk } from "@/store/auth-slice";
import UserCartWrapper from "./UserCartWrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";

/* ----------------------------------------
   Component: MenuItems
----------------------------------------- */
function MenuItems() {
  const navigate = useNavigate();

  const handleNavigate = (menuItem) => {
    if (menuItem.path === "/shop/listing" && menuItem.id !== "home") {
      // Navigate with category filter in query param
      navigate(`${menuItem.path}?category=${menuItem.id}`);
    } else {
      navigate(menuItem.path);
    }
  };

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItem.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

/* ----------------------------------------
   Component: HeaderRightContent
----------------------------------------- */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        toast.success("Logout successful ✅", {
          description: "You have been signed out successfully.",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(error || "Logout failed ❌");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems?.length || 0}
          </span>
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 shadow-lg bg-white dark:bg-neutral-900"
        >
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={loading}
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ----------------------------------------
   Component: ShoppingHeader
----------------------------------------- */
export default function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState(false);

  // ✅ Handle menu navigation & filtering
  const handleNavigate = (menuItem) => {
    if (menuItem.id === "home") {
      navigate("/shop/home");
    } else {
      // Apply category filter
      dispatch(fetchAllFilteredProducts({ category: [menuItem.id] }));
      navigate("/shop/listing");
    }
    setOpenSheet(false); // close mobile sheet after click
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">Loop Mart</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-full max-w-xs pl-6 pt-6 pr-4 bg-background"
          >
            <MenuItems onItemClick={handleNavigate} />
            {isAuthenticated ? (
              <HeaderRightContent />
            ) : (
              <Button
                onClick={() => navigate("/auth/login")}
                className="w-full mt-4 bg-black text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
            )}
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems onItemClick={handleNavigate} />
        </div>

        {/* Right Side */}
        {/* Right Side */}
        <div className="hidden lg:block">
          {isAuthenticated ? (
            <HeaderRightContent />
          ) : (
            <Button
              onClick={() => navigate("/auth/login")}
              className="bg-black text-white hover:bg-gray-800"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
