import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./features/auth/login/Login";
import SignUp from "./features/auth/sign-up/SignUp";
import {Home} from "@/features/home/Home.jsx";
import VerificationCodePage from "@/features/auth/verification/VerificationPage.jsx";

function App() {
  const router = createBrowserRouter([
    {path:"/",element: <Home />},
    { path: "/login", element: <Login /> },
    { path: "/sign-up", element: <SignUp /> },{
    path: "/verify",element:<VerificationCodePage/>,
    }
  ]);
  return <RouterProvider router={router}></RouterProvider>;
}
export default App;
