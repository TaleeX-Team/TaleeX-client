import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./features/auth/login/Login";
import SignUp from "./features/auth/sign-up/SignUp";

function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}
export default App;
