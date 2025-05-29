import Nav from "../shared/nav/Nav";
import fieldBg from "@/assets/images/field-bg.png";
import { LoginModal } from "../shared/nav/LoginModal";
import { SignUpModal } from "../shared/nav/SignupModal";
import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectUserLoading,
} from "@/store/slices/userSlice";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  // protect
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectUserLoading);
  const location = useLocation();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    console.log("openLoginModal");
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    console.log("openSignUpModal");
  };

  const publicRoutes = ["/", "/about"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return (
      <div className="fixed inset-0 overflow-hidden">
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
          />
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

  // loading wait for connected user
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
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // if not connected - redirect to home page
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // if connected - show the protected page
  return (
    <div className="fixed inset-0 overflow-hidden">
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
        />
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
