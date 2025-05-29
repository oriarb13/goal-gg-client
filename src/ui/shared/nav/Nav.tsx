import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/ui/shadCN/button";
import { Separator } from "@/ui/shadCN/separator";
import { Menu, LogOut, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/ui/shadCN/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadCN/dropdown-menu";
import { ModeToggle } from "./theme/mode-toggle";
import Language from "./theme/language";
import { useTranslation } from "react-i18next";
import type { UserFull } from "@/types/userTypes";

interface MenuItem {
  key: string;
  path?: string;
  onClick?: () => void;
  label: string;
}

interface NavProps {
  openLoginModal: () => void;
  openSignUpModal: () => void;
  isAuthenticated: boolean;
  currentUser: UserFull | null;
  onLogout: () => void;
}

const Nav = ({
  openLoginModal,
  openSignUpModal,
  isAuthenticated,
  currentUser,
  onLogout,
}: NavProps) => {
  const userMenuItems: MenuItem[] = [
    { key: "home", path: "/home", label: "home" },
    { key: "about", path: "/about", label: "about" },
    { key: "fields", path: "/fields", label: "fields" },
    { key: "clubs", path: "/clubs", label: "clubs" },
    { key: "users", path: "/users", label: "users" },
    { key: "profile", path: "/profile", label: "profile" },
  ];

  const guestMenuItems: MenuItem[] = [
    { key: "about", path: "/about", label: "about" },
    { key: "login", onClick: openLoginModal, label: "login" },
    { key: "register", onClick: openSignUpModal, label: "register" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const location = useLocation();
  const { t } = useTranslation();

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    setMenuItems(isAuthenticated ? userMenuItems : guestMenuItems);
  }, [isAuthenticated]);

  const userDisplayName = currentUser
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : "";

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex flex-col">
        <div className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex flex-col items-center">
            {isAuthenticated && currentUser && (
              <div className="w-full border-b border-border/50 px-4 pb-1">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    {t("nav.hello")} {userDisplayName}
                  </span>
                </div>
              </div>
            )}

            <Link to="/" className="text-3xl font-bold text-gradient-brand">
              GoalGG
            </Link>
          </div>

          <div className="flex items-center justify-center flex-1 mx-8">
            {menuItems.map((item, index) => (
              <div key={item.key} className="flex items-center">
                {index > 0 && (
                  <div className="h-6 mx-3">
                    <Separator
                      orientation="vertical"
                      className="h-full bg-border"
                    />
                  </div>
                )}
                {item.key === "login" || item.key === "register" ? (
                  <div
                    onClick={item.onClick}
                    className="text-pgreen px-3 py-2 rounded-lg text-2xl font-medium transition-colors hover:bg-accent hover:text-primary-foreground cursor-pointer"
                  >
                    {t(`nav.${item.label}`)}
                  </div>
                ) : (
                  <Link
                    to={item.path || ""}
                    className={`text-muted-foreground px-3 py-2 rounded-lg text-2xl font-medium transition-colors hover:bg-accent hover:text-primary-foreground ${
                      isActivePath(item.path || "")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(`nav.${item.label}`)}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Language />

            {isAuthenticated && currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userDisplayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("nav.profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col">
        <div className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-md border-b border-border">
          <Link to="/" className="text-xl font-bold text-gradient-brand">
            GoalGG
          </Link>
          {isAuthenticated && currentUser && (
            <div className="w-full   px-4 py-1">
              <div className="text-center">
                <span className="text-xl text-muted-foreground">
                  {t("nav.hello")} {userDisplayName}
                </span>
              </div>
            </div>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">פתח תפריט</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="flex flex-col items-center justify-between mt-2">
                <SheetTitle className="text-right text-xl font-bold tracking-widest">
                  תפריט ניווט
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="sr-only">
                תפריט ניווט למכשירים ניידים
              </SheetDescription>

              {isAuthenticated && currentUser && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <p className="font-medium">{userDisplayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 justify-center mt-4">
                <ModeToggle />
                <Language />
              </div>

              <div className="flex flex-col space-y-2 mt-8">
                {menuItems.map((item) => {
                  if (item.key === "login" || item.key === "register") {
                    return null;
                  }
                  return (
                    <Link
                      key={item.key}
                      to={item.path || ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        isActivePath(item.path || "")
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {t(`nav.${item.label}`)}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Navigate to profile or settings
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t("nav.profile")}
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("nav.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openLoginModal();
                      }}
                    >
                      {t("nav.login")}
                    </Button>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openSignUpModal();
                      }}
                    >
                      {t("nav.register")}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default Nav;
