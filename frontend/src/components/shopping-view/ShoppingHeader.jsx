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

/* ----------------------------------------
   Component: MenuItems
   Description: Renders navigation links for the shopping header.
----------------------------------------- */
function MenuItems() {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItem.map((menuItem) => (
        <Link
          className="text-sm font-medium"
          key={menuItem.id}
          to={menuItem.path}
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

/* ----------------------------------------
   Component: HeaderRightContent
   Description:
   Displays user-related actions on the right side:
   - Shopping cart icon
   - Avatar dropdown with Account and Logout options
   Handles logout process with visual feedback and toast notifications.
----------------------------------------- */
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  // Handle user logout with async thunk
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

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        {/* Shopping Cart Button */}
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>

          {/* 🔢 Badge showing cart item count */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
        </Button>

        <UserCartWrapper
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* Dropdown Menu for User Account */}
      <DropdownMenu>
        {/* Avatar acts as dropdown trigger */}
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* Dropdown content */}
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56 shadow-lg  bg-white dark:bg-neutral-900"
        >
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>

          {/* Navigate to user account page */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* Logout button with spinner during process */}
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
   Description:
   Main header for the shopping view.
   - Contains brand logo
   - Responsive navigation (hamburger menu on mobile)
   - Displays user section if authenticated
----------------------------------------- */
export default function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and brand name */}
        <Link to="/" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold">Loop Mart</span>
        </Link>

        {/* Mobile Navigation Menu (Sheet) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header manu</span>
            </Button>
          </SheetTrigger>

          {/* Slide-out menu on mobile with padding for better spacing */}
          <SheetContent
            side="left"
            className="w-full max-w-xs pl-6 pt-6 pr-4 bg-background"
          >
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right-side content (visible only when logged in) */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
