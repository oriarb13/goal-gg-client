import Nav from "../shared/nav/Nav";
import fieldBg from "@/assets/images/field-bg.png";
import { LoginModal } from "../shared/nav/LoginModal";
import { SignUpModal } from "../shared/nav/SignupModal";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectUserLoading,
  selectCurrentUser,
} from "@/store/slices/userSlice";
import { logout } from "@/store/slices/userSlice";
import { showSnackBar } from "@/store/slices/snackBarSlice";
import { useAuth } from "@/service/users/usersQuery";
import { usersApi } from "@/service/users/usersApi";
import { GlobalSnackBar } from "@/ui/shared/globalSnackbar";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectUserLoading);
  const currentUser = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { logout: authLogout } = useAuth();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const handleLogout = () => {
    authLogout();
  };

  // Token check with snackbar notifications
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.log("🔓 No token found - logging out");
          dispatch(
            showSnackBar({
              message: "Session expired. Please login again.",
              severity: "error",
              show: true,
            })
          );
          dispatch(logout());
          return;
        }

        try {
          const response = await usersApi.auth();

          if (response.status !== 200) {
            console.log("🔓 Token invalid - logging out");
            dispatch(
              showSnackBar({
                message: "Session expired. Please login again.",
                severity: "error",
                show: true,
              })
            );
            dispatch(logout());
          } else {
            console.log("✅ Token is valid");
          }
        } catch (error: any) {
          if (error?.response?.status === 401) {
            console.log("🔓 Token expired - logging out");
            dispatch(
              showSnackBar({
                message: "Session expired. Please login again.",
                severity: "error",
                show: true,
              })
            );
            dispatch(logout());
          } else {
            console.log("🔓 Auth check failed - logging out");
            dispatch(
              showSnackBar({
                message: "Connection error. Please try again.",
                severity: "error",
                show: true,
              })
            );
            dispatch(logout());
          }
        }
      }
    };

    checkTokenValidity();
  }, [location.pathname, isAuthenticated, dispatch]);

  const publicRoutes = ["/", "/about"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const protectedRoutes = ["/home", "/profile", "/users", "/fields", "/clubs"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return (
      <div className="fixed inset-0 overflow-hidden font-roboto ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${fieldBg})`,
          }}
        />
        <div className="relative z-10 h-full">
          <Nav
            openLoginModal={openLoginModal}
            openSignUpModal={openSignUpModal}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <GlobalSnackBar />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            openSignUpModal={openSignUpModal}
          />
          <SignUpModal
            isOpen={isSignUpModalOpen}
            onClose={() => setIsSignUpModalOpen(false)}
            openLoginModal={openLoginModal}
          />
          <div className="h-[calc(100%-64px)] overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${fieldBg})`,
          }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <GlobalSnackBar />
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (isProtectedRoute && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300 dark:brightness-[0.5] dark:contrast-75 brightness-100 contrast-100"
        style={{
          backgroundImage: `url(${fieldBg})`,
        }}
      />
      <div className="relative z-10 h-full">
        <Nav
          openLoginModal={openLoginModal}
          openSignUpModal={openSignUpModal}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <GlobalSnackBar />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openSignUpModal={openSignUpModal}
        />
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          openLoginModal={openLoginModal}
        />
        <div className="h-[calc(100%-64px)] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
