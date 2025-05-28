import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useLogin, useCurrentUser } from "@/service/users/usersQuery";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  openSignUpModal?: () => void;
}

// Define the validation schema using Zod
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
  const [isFailed, setIsFailed] = useState(false);

  // Use the proper hooks from our new structure
  const loginMutation = useLogin();
  const { error: authError } = useCurrentUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFailed(false);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    try {
      // Use the login mutation from our new structure
      const response = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // If we reach here, login was successful
      if (response.success) {
        onClose();
        // Reset form
        setFormData({ email: "", password: "" });
        setErrors({});
        setIsFailed(false);

        // Navigate to dashboard after successful login
        navigate("/");
      } else {
        setIsFailed(true);
      }
    } catch (error) {
      setIsFailed(true);
      console.error("Login error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-foreground gradient-brand">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {t("loginModal.login")}
          </DialogTitle>
          <DialogDescription className="text-white/80 flex items-center">
            <p className="text-sm">{t("loginModal.dontHaveAccountYet")}</p>
            <Separator orientation="vertical" className="mx-2 bg-white/30" />
            {openSignUpModal && (
              <p
                className="text-sm hover:underline hover:text-white/60 cursor-pointer"
                onClick={openSignUpModal}
              >
                {t("loginModal.clickHere")}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display auth error if it exists */}
          {authError && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
              {authError.message || "שגיאה באימות"}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              {t("form.email")}
            </Label>
            <Input
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("form.email")}
              disabled={loginMutation.isPending}
            />
            {errors.email && (
              <p className="text-xs text-red-300">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white">
                {t("form.password")}
              </Label>
              <Button
                variant="link"
                className="text-xs text-white/70 hover:text-white/50 p-0 h-auto"
                type="button"
              >
                {t("form.forgotPassword")}
              </Button>
            </div>
            <div className="relative">
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={t("form.password")}
                disabled={loginMutation.isPending}
              />
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-transparent"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loginMutation.isPending}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-300">{errors.password}</p>
            )}
          </div>

          {/* Login Error Message */}
          {isFailed && (
            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
              {t("loginModal.emailOrPasswordError")}
            </div>
          )}

          <DialogFooter className="sm:justify-between mt-6 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loginMutation.isPending}
              className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex-1 bg-white text-pgreendark hover:bg-white/90"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מתחבר...
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
