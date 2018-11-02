import LoginPage from "../views/Auth/LoginPage.jsx";
import RegisterPage from "../views/Auth/RegisterPage.jsx";
import { PersonAdd, Fingerprint } from "@material-ui/icons";

const authRoutes = [
  {
    path: "/login",
    name: "Login Page",
    short: "Login",
    mini: "LP",
    icon: Fingerprint,
    component: LoginPage
  },
  {
    path: "/register",
    
    component: RegisterPage
  },
];

export default authRoutes;
