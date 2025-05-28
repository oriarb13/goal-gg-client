import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
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
import { Checkbox } from "@/ui/shadCN/checkbox";
import { Separator } from "@/ui/shadCN/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadCN/select";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegisterUser } from "@/service/users/usersQuery";
import { PhoneInput } from "../phone-input";
import { CountrySelector } from "../mapbox/CountrySelector";
import { CitySelector } from "../mapbox/CItySelector";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  openLoginModal: () => void;
}

// Sport category enum (adjust to match your backend)
const SportCategoryEnum = {
  FOOTBALL: "FOOTBALL",
  BASKETBALL: "BASKETBALL",
} as const;

// Define the validation schema using Zod
const signUpSchema = z
  .object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    phonePrefix: z.string().min(1, { message: "Phone prefix is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    sportCategory: z.enum(
      [SportCategoryEnum.FOOTBALL, SportCategoryEnum.BASKETBALL],
      {
        required_error: "Sport category is required",
      }
    ),
    yearOfBirth: z
      .string()
      .regex(/^\d{4}$/, { message: "Valid birth year is required" }),
    country: z.string().min(2, { message: "Country is required" }),
    city: z.string().min(2, { message: "City is required" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms and conditions",
    }),
    countryCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpModal = ({
  isOpen,
  onClose,
  openLoginModal,
}: SignUpModalProps) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    phonePrefix: "+972", // Default phone prefix
    phoneNumber: "", // Actual phone number
    email: "",
    password: "",
    confirmPassword: "",
    sportCategory: SportCategoryEnum.FOOTBALL,
    yearOfBirth: "",
    country: "",
    city: "",
    agreeToTerms: false,
    countryCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Use the register mutation from our new structure
  const registerMutation = useRegisterUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));
    if (errors.agreeToTerms) {
      setErrors((prev) => ({ ...prev, agreeToTerms: "" }));
    }
  };

  const handlePhoneChange = (
    value: string,
    metadata?: { prefix: string; number: string }
  ) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || "",
      phonePrefix: metadata?.prefix || prev.phonePrefix,
      phoneNumber: metadata?.number || prev.phoneNumber,
    }));

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleCountryChange = (value: string, countryCode?: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
      countryCode: countryCode || "",
      // Clear city when country changes
      city: "",
    }));

    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value }));
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err?.path[0]?.toString() || ""] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      phonePrefix: "+972",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      sportCategory: SportCategoryEnum.FOOTBALL,
      yearOfBirth: "",
      country: "",
      city: "",
      agreeToTerms: false,
      countryCode: "",
    });
    setErrors({});
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the data for submission matching your API structure
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: {
          prefix: formData.phonePrefix,
          number: formData.phoneNumber,
        },
        sport_category: formData.sportCategory,
        year_of_birth: parseInt(formData.yearOfBirth, 10),
        country: formData.country,
        city: formData.city,
      };

      const response = await registerMutation.mutateAsync(submitData);

      if (response.success) {
        setIsSuccess(true);
        // Show success message for 3 seconds then switch to login
        setTimeout(() => {
          resetForm();
          onClose();
          openLoginModal();
        }, 3000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Error handling is done by the mutation's onError
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Generate years for dropdown (from current year - 100 to current year - 5)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) =>
    (currentYear - 5 - i).toString()
  ).reverse();

  // Show success state
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md gradient-brand">
          <div className="flex flex-col items-center justify-center py-8 text-center text-white">
            <CheckCircle className="h-16 w-16 text-white mb-4" />
            <DialogTitle className="text-xl font-bold mb-2">
              {t("signup.userCreatedSuccessfully")}
            </DialogTitle>
            <DialogDescription className="text-white/80 mb-4">
              {t("signup.redirectingToLogin")}
            </DialogDescription>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">מעביר לדף התחברות...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto text-foreground gradient-brand sm:max-w-lg">
        <DialogHeader className="px-1">
          <DialogTitle className="text-xl font-bold text-white">
            {t("signup.title")}
          </DialogTitle>
          <DialogDescription className="text-white/80 flex items-center">
            <p className="text-sm">{t("signup.alreadyHaveAccount")}</p>
            <Separator orientation="vertical" className="mx-2 bg-white/30" />
            <p
              className="text-sm hover:underline hover:text-white/60 cursor-pointer"
              onClick={openLoginModal}
            >
              {t("signup.login")}
            </p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-1">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                {t("signup.firstNameLabel")}
              </Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t("signup.firstNamePlaceholder")}
                disabled={registerMutation.isPending}
              />
              {errors.firstName && (
                <p className="text-xs text-red-300">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                {t("signup.lastNameLabel")}
              </Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t("signup.lastNamePlaceholder")}
                disabled={registerMutation.isPending}
              />
              {errors.lastName && (
                <p className="text-xs text-red-300">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              {t("signup.phoneLabel")}
            </Label>
            <PhoneInput
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              value={formData.phone}
              onChange={handlePhoneChange}
              international
              initialValueFormat="national"
              defaultCountry="IL"
              disabled={registerMutation.isPending}
            />
            {errors.phone && (
              <p className="text-xs text-red-300">{errors.phone}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              {t("signup.emailLabel")}
            </Label>
            <Input
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("signup.emailPlaceholder")}
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p className="text-xs text-red-300">{errors.email}</p>
            )}
          </div>

          {/* Password Fields */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              {t("signup.passwordLabel")}
            </Label>
            <div className="relative">
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={t("signup.passwordPlaceholder")}
                disabled={registerMutation.isPending}
              />
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-white/70 hover:text-white hover:bg-transparent"
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={registerMutation.isPending}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-300">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">
              {t("signup.confirmPasswordLabel")}
            </Label>
            <Input
              className={cn(
                "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40",
                errors.confirmPassword && "border-red-300"
              )}
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={t("signup.confirmPasswordPlaceholder")}
              disabled={registerMutation.isPending}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-300">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Sport Category and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sportCategory" className="text-white">
                {t("signup.sportCategoryLabel")}
              </Label>
              <Select
                value={formData.sportCategory}
                onValueChange={(value) =>
                  handleSelectChange("sportCategory", value)
                }
                disabled={registerMutation.isPending}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue
                    placeholder={t("signup.sportCategoryPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SportCategoryEnum.FOOTBALL}>
                    {t("signup.sportFootball")}
                  </SelectItem>
                  <SelectItem value={SportCategoryEnum.BASKETBALL}>
                    {t("signup.sportBasketball")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.sportCategory && (
                <p className="text-xs text-red-300">{errors.sportCategory}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfBirth" className="text-white">
                {t("signup.yearOfBirthLabel")}
              </Label>
              <Select
                value={formData.yearOfBirth}
                onValueChange={(value) =>
                  handleSelectChange("yearOfBirth", value)
                }
                disabled={registerMutation.isPending}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue
                    placeholder={t("signup.yearOfBirthPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.yearOfBirth && (
                <p className="text-xs text-red-300">{errors.yearOfBirth}</p>
              )}
            </div>
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-2 gap-4">
            <CountrySelector
              value={formData.country}
              onChange={handleCountryChange}
              error={errors.country}
              label="signup.countryLabel"
              placeholder="signup.countryPlaceholder"
              // disabled={registerMutation.isPending}
            />

            <CitySelector
              value={formData.city}
              onChange={handleCityChange}
              countryCode={formData.countryCode}
              error={errors.city}
              label="signup.cityLabel"
              placeholder="signup.cityPlaceholder"
              disabled={!formData.countryCode || registerMutation.isPending}
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              disabled={registerMutation.isPending}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-pgreendark"
            />
            <Label
              htmlFor="agreeToTerms"
              className="text-sm font-normal leading-none text-white"
            >
              {t("signup.agreeToTerms")}
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-300">{errors.agreeToTerms}</p>
          )}

          {/* Submit Buttons */}
          <DialogFooter className="sm:justify-between mt-6 gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={registerMutation.isPending}
              className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex-1 bg-white text-pgreendark hover:bg-white/90"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  נרשם...
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

export default SignUpModal;
