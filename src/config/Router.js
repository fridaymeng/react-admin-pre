import { renderRoutes } from "react-router-config";
import { BrowserRouter } from "react-router-dom"; //BrowserRouter, HashRouter

import Login from "views/login/Index";
import MainLayout from "layout/Main";
import Page404 from "views/error/Page404";
import dashboard from "views/dashboard/Index";
import List from "views/list/Index";
import Data from "views/nodes/Data";
import DataV3 from "views/nodes/DataV3";
import Connection from "views/connection/Index";
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
        path: "/app/dashboard",
        component: dashboard,
      },
      {
        path: "/app/list",
        component: List,
      },
      {
        path: "/app/data",
        component: Data,
      },
      {
        path: "/app/datav3",
        component: DataV3,
      },
      {
        path: "/app/connection",
        component: Connection,
      },
      {
        path: "*",
        exact: true,
        component: Page404,
      },
    ],
  },
  {
    path: "*",
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
