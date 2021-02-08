import { renderRoutes } from "react-router-config";
import { BrowserRouter } from "react-router-dom"; //BrowserRouter, HashRouter

import Login from "../views/login/Index";
import MainLayout from "../views/layout/Main";
import Page404 from "./404";
import App from "../views/list/Index";
import Data from "../views/list/Data";
const routes = [
  {
    path: "/",
    exact: true,
    component: Login,
  },
  {
    path: "/app",
    component: MainLayout,
    routes: [
      {
        path: "/app/list",
        component: App,
      },
      {
        path: "/app/data",
        component: Data,
      },
    ],
  },
  {
    path: "/404",
    exact: true,
    component: Page404,
  },
];
function Router() {
  return (
    <BrowserRouter>
      {/* kick it all off with the root route */}
      {renderRoutes(routes)}
    </BrowserRouter>
  );
}

export default Router;
