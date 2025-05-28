import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/ui/shadCN/button";
import { Separator } from "@/ui/shadCN/separator";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/ui/shadCN/sheet";
import { ModeToggle } from "./theme/mode-toggle";
import Language from "./theme/language";
import { useTranslation } from "react-i18next";

interface MenuItem {
  key: string;
  path?: string;
  onClick?: () => void;
  label: string;
}
interface NavProps {
  openLoginModal: () => void;
  openSignUpModal: () => void;
}
const Nav = ({ openLoginModal, openSignUpModal }: NavProps) => {
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
  const user = false;

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  useEffect(() => {
    setMenuItems(user ? userMenuItems : guestMenuItems);
  }, [user]);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden md:flex justify-between items-center p-4 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gradient-brand">
            GoalGG
          </Link>
        </div>

        {/* Desktop Menu Items */}
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

        {/* Desktop Settings */}
        <div className="flex items-center gap-2 ">
          <ModeToggle />
          <Language />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        {/* Mobile Logo */}
        <Link to="/" className="text-xl font-bold text-gradient-brand">
          GoalGG
        </Link>

        {/* Mobile Menu Button */}
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
            <div className="flex items-center gap-2 justify-center">
              <ModeToggle />
              <Language />
            </div>
            {/* Mobile Menu Items */}
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
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Extra Actions */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="space-y-2">
                <Button className="w-full" variant="default">
                  התחבר
                </Button>
                <Button className="w-full" variant="outline">
                  הרשם
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Nav;
