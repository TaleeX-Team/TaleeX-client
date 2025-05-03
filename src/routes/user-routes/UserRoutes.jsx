import ProtectedLayout from "@/layouts/ProtectedLayout";
import UserRouteProtector from "./UserRouteProtector";
import Companies from "@/features/companies/Companies";
import CompanyDetails from "@/features/companies/company-details";
import Home from "@/features/home/Home";
import ErrorPage from "@/pages/ErrorPage";
import Jobs from "@/features/jobs/jobs";
import JobsPage from "@/features/jobs/jobs";
import JobDetailsPage from "@/features/jobs/jobDetails";
import SettingsLayout from "@/layouts/SettingsLayout";
import {Navigate, Outlet} from "react-router-dom";
import {Suspense} from "react";
import FullPageSpinner from "@/components/FullPageSpinner";
import ProfilePage from "@/features/settings/profile/Profile";
import BillingPage from "@/features/settings/billing/Billing";
import SetPassword from "@/features/settings/set-password/SetPassword";
import ChangePasswordPage from "@/features/settings/change-password/ChangePasswordPage";
import JobApplicationPage from "@/features/jobs/form/JobApplicationPage.jsx";
import JobApplicationManager from "@/features/jobs/applications/applicants-tab.jsx";

const AppRedirect = () => {
    return <Navigate to="/app/companies" replace/>;
};

const UserRoutes = {
    path: "/app",
    element: (
        <UserRouteProtector>
            <ProtectedLayout/>
        </UserRouteProtector>
    ),
    errorElement: <ErrorPage/>,
    children: [
        {
            index: true,
            element: <AppRedirect/>, // Redirect /app to /app/companies
        },
        {
            path: "companies",
            children: [
                {
                    index: true,
                    element: <Companies/>, // Show companies list at /app/companies
                },
                {
                    path: ":companyId", // Company details as child of companies
                    element: <CompanyDetails/>,
                },
            ],
        },
        // Keep home route but make it accessible via explicit path
        {
            path: "home",
            element: <Home/>,
        },
        {path: "jobs", element: <JobsPage/>},
        {
            path: "jobs/:id",
            element: <JobApplicationManager/>,
        },

        {
            path: "settings",
            element: (
                <SettingsLayout>
                    <Outlet/>
                </SettingsLayout>
            ),
            errorElement: <ErrorPage/>,
            children: [
                {
                    index: true,
                    element: <Navigate to="/app/settings/profile" replace/>,
                },
                {
                    path: "profile",
                    element: (
                        <Suspense fallback={<FullPageSpinner/>}>
                            <ProfilePage/>
                        </Suspense>
                    ),
                },
                {
                    path: "billing",
                    element: (
                        <Suspense fallback={<FullPageSpinner/>}>
                            <BillingPage/>
                        </Suspense>
                    ),
                },
                {
                    path: "set-password",
                    element: (
                        <Suspense fallback={<FullPageSpinner/>}>
                            <SetPassword/>
                        </Suspense>
                    ),
                },
                {
                    path: "change-password",
                    element: (
                        <Suspense fallback={<FullPageSpinner/>}>
                            <ChangePasswordPage/>
                        </Suspense>
                    ),
                },

            ],
        },
    ],
};

export default UserRoutes;
