import Nav from "../shared/nav/Nav";
import fieldBg from "@/assets/images/field-bg.png";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${fieldBg})`,
        }}
      />
      <div className="relative z-10">
        <Nav />
        <div className="flex">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
