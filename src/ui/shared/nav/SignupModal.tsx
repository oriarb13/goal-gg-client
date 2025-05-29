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
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import DotsLoader from "@/assets/animations/DotsLoader";
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

const SportCategoryEnum = {
  FOOTBALL: "FOOTBALL",
  BASKETBALL: "BASKETBALL",
} as const;

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [signUpStatus, setSignUpStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const registerMutation = useRegisterUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (signUpStatus.type) {
      setSignUpStatus({ type: null, message: "" });
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
    setSignUpStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSignUpStatus({ type: null, message: "" });

    try {
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: {
          prefix: formData.phonePrefix,
          number: formData.phoneNumber,
        },
        sport_category: formData.sportCategory.toLowerCase(),
        year_of_birth: parseInt(formData.yearOfBirth, 10),
        country: formData.country,
        city: formData.city,
      };

      const response = await registerMutation.mutateAsync(submitData);

      if (response.status === 201) {
        setSignUpStatus({
          type: "success",
          message: t("signUpModal.signUpSuccess"),
        });

        setTimeout(() => {
          handleClose();
          openLoginModal();
        }, 3000);
      }
    } catch (error) {
      setSignUpStatus({
        type: "error",
        message: t("signUpModal.signUpError"),
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 80 }, (_, i) =>
    (currentYear - 5 - i).toString()
  ).reverse();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-fit max-w-4xl text-foreground gradient-brand max-h-[85vh] overflow-y-auto overflow-x-hidden mt-20">
        <DialogHeader className="space-y-4 md:space-y-6">
          <DialogTitle className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center">
            {t("signUpModal.title")}
          </DialogTitle>
          <DialogDescription className="text-white/80 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <p className="text-base md:text-lg lg:text-xl">
              {t("signUpModal.alreadyHaveAccount")}
            </p>
            <Separator
              orientation="vertical"
              className="hidden sm:block mx-2 bg-white/30 h-6"
            />
            <p
              className="text-base md:text-lg lg:text-xl hover:underline hover:text-white/60 cursor-pointer"
              onClick={() => {
                handleClose();
                openLoginModal();
              }}
            >
              {t("signUpModal.login")}
            </p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="firstName"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.firstNameLabel")}
              </Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl px-4 md:px-6"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t("signUpModal.firstNamePlaceholder")}
                disabled={registerMutation.isPending}
              />
              {errors.firstName && (
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="lastName"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.lastNameLabel")}
              </Label>
              <Input
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl px-4 md:px-6"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t("signUpModal.lastNamePlaceholder")}
                disabled={registerMutation.isPending}
              />
              {errors.lastName && (
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <Label
              htmlFor="phone"
              className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
            >
              {t("signUpModal.phoneLabel")}
            </Label>
            <PhoneInput
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl"
              value={formData.phone}
              onChange={handlePhoneChange}
              international
              initialValueFormat="national"
              defaultCountry="IL"
              disabled={registerMutation.isPending}
            />
            {errors.phone && (
              <p className="text-sm md:text-base lg:text-lg text-red-300">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <Label
              htmlFor="email"
              className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
            >
              {t("signUpModal.emailLabel")}
            </Label>
            <Input
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl px-4 md:px-6"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("signUpModal.emailPlaceholder")}
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm md:text-base lg:text-lg text-red-300">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="password"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.passwordLabel")}
              </Label>
              <div className="relative">
                <Input
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl px-4 md:px-6 pr-12 md:pr-16"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t("signUpModal.passwordPlaceholder")}
                  disabled={registerMutation.isPending}
                />
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 md:px-4 text-white/70 hover:text-white hover:bg-transparent"
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={registerMutation.isPending}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="md:w-6 md:h-6" />
                  ) : (
                    <Eye size={20} className="md:w-6 md:h-6" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="confirmPassword"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.confirmPasswordLabel")}
              </Label>
              <Input
                className={cn(
                  "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl px-4 md:px-6",
                  errors.confirmPassword && "border-red-300"
                )}
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("signUpModal.confirmPasswordPlaceholder")}
                disabled={registerMutation.isPending}
              />
              {errors.confirmPassword && (
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="sportCategory"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.sportCategoryLabel")}
              </Label>
              <Select
                value={formData.sportCategory}
                onValueChange={(value) =>
                  handleSelectChange("sportCategory", value)
                }
                disabled={registerMutation.isPending}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl">
                  <SelectValue
                    placeholder={t("signUpModal.sportCategoryPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SportCategoryEnum.FOOTBALL}>
                    {t("signUpModal.sportFootball")}
                  </SelectItem>
                  <SelectItem value={SportCategoryEnum.BASKETBALL}>
                    {t("signUpModal.sportBasketball")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.sportCategory && (
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.sportCategory}
                </p>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <Label
                htmlFor="yearOfBirth"
                className="text-lg md:text-xl lg:text-2xl text-white font-semibold"
              >
                {t("signUpModal.yearOfBirthLabel")}
              </Label>
              <Select
                value={formData.yearOfBirth}
                onValueChange={(value) =>
                  handleSelectChange("yearOfBirth", value)
                }
                disabled={registerMutation.isPending}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl">
                  <SelectValue
                    placeholder={t("signUpModal.yearOfBirthPlaceholder")}
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
                <p className="text-sm md:text-base lg:text-lg text-red-300">
                  {errors.yearOfBirth}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <CountrySelector
              value={formData.country}
              onChange={handleCountryChange}
              error={errors.country}
              label="signUpModal.countryLabel"
              placeholder="signUpModal.countryPlaceholder"
            />

            <CitySelector
              value={formData.city}
              onChange={handleCityChange}
              countryCode={formData.countryCode}
              error={errors.city}
              label="signUpModal.cityLabel"
              placeholder="signUpModal.cityPlaceholder"
              disabled={!formData.countryCode || registerMutation.isPending}
            />
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              disabled={registerMutation.isPending}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-pgreendark w-5 h-5 md:w-6 md:h-6"
            />
            <Label
              htmlFor="agreeToTerms"
              className="text-base md:text-lg lg:text-xl font-normal leading-none text-white"
            >
              {t("signUpModal.agreeToTerms")}
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm md:text-base lg:text-lg text-red-300">
              {errors.agreeToTerms}
            </p>
          )}

          {signUpStatus.type && (
            <div
              className={`flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-lg ${
                signUpStatus.type === "success"
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-red-500/20 border border-red-500/30"
              }`}
            >
              {signUpStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-red-400" />
              )}
              <p
                className={`text-base md:text-lg lg:text-xl ${
                  signUpStatus.type === "success"
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {signUpStatus.message}
              </p>
            </div>
          )}

          <DialogFooter className="sm:justify-between mt-8 md:mt-10 gap-4 md:gap-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={
                registerMutation.isPending || signUpStatus.type === "success"
              }
              className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={
                registerMutation.isPending || signUpStatus.type === "success"
              }
              className="flex-1 bg-white text-pgreendark hover:bg-white/90 h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl"
            >
              {registerMutation.isPending ? (
                <>
                  <DotsLoader className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                </>
              ) : signUpStatus.type === "success" ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
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

export default SignUpModal;
