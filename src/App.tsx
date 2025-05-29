import MainLayout from "@/ui/layouts/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
// import { store } from "./store/store";

import { useEffect } from "react";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { useInitializeAuth } from "@/service/users/usersQuery";
import AboutPage from "./pages/AboutPage";
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { mutate: initAuth } = useInitializeAuth();

  useEffect(() => {
    // Initialize auth on app mount
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthInitializer>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/home" element={<HomePage />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
            <Toaster position="top-center" richColors closeButton dir="rtl" />
          </AuthInitializer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
