import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/service/users/usersQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/shadCN/dialog";
import { Button } from "@/ui/shadCN/button";
import { Input } from "@/ui/shadCN/input";
import { Label } from "@/ui/shadCN/label";
import { Separator } from "@/ui/shadCN/separator";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import DotsLoader from "@/assets/animations/DotsLoader";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openSignUpModal?: () => void;
}

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginModal = ({
  isOpen,
  onClose,
  openSignUpModal,
}: LoginModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [loginStatus, setLoginStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { login, loginLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (loginStatus.type) {
      setLoginStatus({ type: null, message: "" });
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]?.toString() || ""] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoginStatus({ type: null, message: "" });

    const success = await login({
      email: formData.email,
      password: formData.password,
    });

    if (success) {
      setLoginStatus({
        type: "success",
        message: t("loginModal.loginSuccess"),
      });

      setTimeout(() => {
        handleClose();
        navigate("/home");
      }, 3000);
    } else {
      setLoginStatus({
        type: "error",
        message: t("loginModal.loginError"),
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setErrors({});
    setShowPassword(false);
    setLoginStatus({ type: null, message: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl text-foreground gradient-brand">
        <DialogHeader className="space-y-4 md:space-y-6">
          <DialogTitle className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-800 text-center">
            {t("loginModal.login")}
          </DialogTitle>
          <DialogDescription className="text-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p className="text-base md:text-lg lg:text-xl">
              {t("loginModal.dontHaveAccountYet")}
            </p>
            <Separator
              orientation="vertical"
              className="hidden sm:block mx-2 bg-white/30 h-6"
            />
            {openSignUpModal && (
              <p
                className="text-base md:text-lg lg:text-xl hover:underline hover:text-slate-800/60 cursor-pointer"
                onClick={() => {
                  handleClose();
                  openSignUpModal();
                }}
              >
                {t("loginModal.clickHere")}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-800">
              {t("form.email")}
            </Label>
            <Input
              className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/60 focus:border-white/40"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("form.email")}
              disabled={loginLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-300">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ">
              <Label htmlFor="password" className="text-slate-800">
                {t("form.password")}
              </Label>
              <Button
                variant="link"
                className="text-xs text-slate-800/70 hover:text-slate-800/50 p-0 h-auto"
                type="button"
              >
                {t("form.forgotPassword")}
              </Button>
            </div>
            <div className="relative">
              <Input
                className="bg-white/10 border-white/20 text-slate-800 placeholder:text-slate-800/60 focus:border-white/40 pr-10 rtl:pr-3 rtl:pl-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={t("form.password")}
                disabled={loginLoading}
              />
              <Button
                variant="ghost"
                className="absolute right-0 rtl:right-auto rtl:left-0 top-0 h-full px-3 text-slate-800/70 hover:text-slate-800 hover:bg-transparent"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loginLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-300">{errors.password}</p>
            )}
          </div>

          {loginStatus.type && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                loginStatus.type === "success"
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-red-500/20 border border-red-500/30"
              }`}
            >
              {loginStatus.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <p
                className={`text-sm ${
                  loginStatus.type === "success"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {loginStatus.message}
              </p>
            </div>
          )}

          <DialogFooter className="sm:justify-between mt-6 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={loginLoading || loginStatus.type === "success"}
              className="flex-1 bg-transparent border-white/30 text-slate-800 hover:bg-white/10 hover:text-slate-800"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loginLoading || loginStatus.type === "success"}
              className="flex-1  hover:bg-white/90"
            >
              {loginLoading ? (
                <>
                  <DotsLoader className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : loginStatus.type === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t("common.success")}
                </>
              ) : (
                t("common.submit")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
