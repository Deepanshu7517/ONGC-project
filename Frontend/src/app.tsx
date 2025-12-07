// App.tsx
import "./css/global.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import SignIn from "./pages/signIn";
import Dashboard from "./pages/dashboard";
import ErrorElement from "./pages/errorElement";
import Footer from "./components/footer";
import ProtectedRoute from './components/protectedRoute';
import useInactivityLogout from './utils/useInactivityLogout';

const Layout = () => {
  return (
    <div className="layout">
      <header>
        <Navbar />
      </header>

      <main className="content">
        <Outlet /> {/* 👈 renders child routes here */}
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export const App = () => {
  useInactivityLogout();

  const routes = createBrowserRouter([
    {
      element: <Layout />, // 👈 default layout
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
          errorElement: <ErrorElement goTo="/" />,
        },
      ],
    },
    {
      path: "/login", // 👈 login page has no Navbar/Footer
      element: <SignIn />,
      errorElement: <ErrorElement goTo="/login" />,
    },
  ]);

  return <RouterProvider router={routes} />;
};
