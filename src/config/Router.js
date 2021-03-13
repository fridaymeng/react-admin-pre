import { renderRoutes } from "react-router-config";
import { BrowserRouter } from "react-router-dom"; //BrowserRouter, HashRouter

import Login from "views/login/Index";
import MainLayout from "layout/Main";
import Page404 from "views/error/Page404";
import App from "views/list/Index";
import Data from "views/list/Data";
import DataV3 from "views/list/DataV3";
import Connection from "views/list/Connection";
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
