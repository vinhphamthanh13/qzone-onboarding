import DashboardIcon from "@material-ui/icons/Dashboard";
import {  Person,
          ContentPaste,
          BusinessCenter,
          Report,
          BubbleChart,
          LocationOn,
  PersonAdd,
    Email
        } from "@material-ui/icons";
import Dashboard from "../views/Dashboard/Dashboard.jsx";
import Administration from "../views/Administration/Administration.jsx";
import BusinessDetails from "../views/BusinessDetails/BusinessDetails.jsx";
import BusinessEdit from "../views/BusinessDetails/BusinessEdit.jsx";
import Calendar from "../views/Calendar/Calendar.jsx";
import CustomerFlow from "../views/CustomerFlow/CustomerFlow.jsx";
import ProviderDetails from "../views/Provider/ProviderDetails.jsx";
import ProviderCreate from "../views/Provider/ProviderWizard.jsx";
import ProviderEdit from "../views/Provider/ProviderEdit.jsx";
import Reports from "../views/Reports/Reports.jsx";
import ServicesList from "../views/Services/ServicesList.jsx";
import ServiceCreate from "../views/Services/ServiceCreate.jsx";
import ServiceEdit from "../views/Services/ServiceEdit.jsx";
import LocationList from "../views/Location/LocationList.jsx";
import RegisterPage from "../views/Auth/RegisterPage.jsx";
import EmailTemplates from '../views/EmailTemplates/EmailTemplates';
import EditEmailTemplate from "../views/EmailTemplates/EditEmailTemplate";
import CreateEmailTemplate from "../views/EmailTemplates/CreateEmailTemplate";

export const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    path: "/customer_flow",
    name: "Manage Customer Flow",
    icon: DashboardIcon,
    component: CustomerFlow
  },
  {
    path: "/reports",
    name: "Reports",
    icon: Report,
    component: Reports
  },
  {
    path: "/calendar",
    name: "Manage Calendar",
    icon: BubbleChart,
    component: Calendar
  },
  {
    path: "/email-templates",
    name: "Email Templates Page",
    icon: Email,
    component: EmailTemplates
  },
  { redirect: true, path: "/", pathTo: "/login", name: "Login" }
];

export const otherRoutes=[
  {
    path: "/location/list",
    name: "Location List",
    icon: LocationOn,
    component: LocationList
  },
  {
    path: "/provider/create",
    name: "Provider Create",
    icon: Person,
    component: ProviderCreate
  },
  {
    path: "/provider/edit/:id",
    name: "Provider Edit",
    icon: Person,
    component: ProviderEdit
  },
  {
    path: "/business_details",
    name: "Update Business Details",
    icon: BusinessCenter,
    component: BusinessDetails
  },
  {
    path: "/services/list",
    name: "Manage Services",
    icon: ContentPaste,
    component: ServicesList
  },
  {
    path: "/services/create",
    name: "Create Services",
    icon: ContentPaste,
    component: ServiceCreate
  },
  {
    path: "/service/edit/:id",
    name: "Service Edit",
    icon: ContentPaste,
    component: ServiceEdit
  },
  {
    path: "/administration",
    name: "Administration",
    icon: LocationOn,
    component: Administration
  },
  {
    path: "/provider/list",
    name: "Provider Details",
    icon: Person,
    component: ProviderDetails
  },
  {
    path: "/provider/card",
    name: "Provider Card",
    icon: Person,
    component: ProviderDetails
  },
  {
    path: "/business/edit",
    name: "Business Edit",
    icon: BusinessCenter,
    component: BusinessEdit
  },
  {
    path: "/register",
    name: "Register Page",
    short: "Register",
    mini: "RP",
    icon: PersonAdd,
    component: RegisterPage
  },
  {
    path: "/email-templates/edit/:id",
    name: "Edit Email Template",
    short: "Edit Email Template",
    component: EditEmailTemplate
  },
  {
    path: "/email-templates/create",
    name: "Create Email Template",
    short: "Create Template",
    component: CreateEmailTemplate
  }

];
