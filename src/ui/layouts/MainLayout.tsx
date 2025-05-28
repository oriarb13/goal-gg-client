import Nav from "../shared/nav/Nav";
import fieldBg from "@/assets/images/field-bg.png";
import { LoginModal } from "../shared/nav/LoginModal";
import { SignUpModal } from "../shared/nav/SignupModal";
import { useState } from "react";
function MainLayout({ children }: { children: React.ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    console.log("openLoginModal");
  };
  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    console.log("openSignUpModal");
  };
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
