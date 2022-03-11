import { t } from "./i18n";

import { Theme } from "./theme";
import { ContainerProvider } from "./contexts/container";
import { NotificationProvider } from "./contexts/notification";
import {
  Route,
  Routes,
  useLocation,
  LinkDecorator,
  MenuItemDecorator,
} from "./routing";

import { Dashboard } from "./pages/dashboard";
import { Products } from "./pages/products";
import { ProductsClear } from "./pages/products/clear";
import { ProductsImport } from "./pages/products/import";
import { Orders } from "./pages/orders";
import { OrdersCreate } from "./pages/orders/create";
import { OrdersUpdate } from "./pages/orders/update";
import { OrdersDelete } from "./pages/orders/delete";
import { OrdersClear } from "./pages/orders/clear";
import { OrdersExport } from "./pages/orders/export";

const PAGES = [
  {
    path: "/",
    menu: true,
    text: t("Dashboard"),
    view: <Dashboard />,
  },
  {
    path: "/products",
    menu: true,
    text: t("Products"),
    view: <Products />,
  },
  {
    path: "/products/clear",
    menu: false,
    text: t("Clear products"),
    view: <ProductsClear />,
  },
  {
    path: "/products/import",
    menu: false,
    text: t("Import products"),
    view: <ProductsImport />,
  },
  {
    path: "/orders",
    menu: true,
    text: t("Orders"),
    view: <Orders />,
  },
  {
    path: "/orders/export",
    menu: false,
    text: t("Export orders"),
    view: <OrdersExport />,
  },
  {
    path: "/orders/clear",
    menu: false,
    text: t("Clear orders"),
    view: <OrdersClear />,
  },
  {
    path: "/orders/create",
    menu: false,
    text: t("Create order"),
    view: <OrdersCreate />,
  },
  {
    path: "/orders/update/:id",
    menu: false,
    text: t("Update order"),
    view: <OrdersUpdate />,
  },
  {
    path: "/orders/delete/:id",
    menu: false,
    text: t("Delete order"),
    view: <OrdersDelete />,
  },
];

export const App = () => {
  const { pathname } = useLocation();

  return (
    <ContainerProvider>
      <NotificationProvider>
        <Theme
          currentPage={pathname}
          linkDecorator={LinkDecorator}
          menuItems={PAGES.filter(({ menu }) => menu).map(({ path, text }) => (
            <MenuItemDecorator key={path} href={path} text={text} />
          ))}
        >
          <Routes>
            {PAGES.map(({ path, view }) => (
              <Route key={path} path={path} element={view} />
            ))}
          </Routes>
        </Theme>
      </NotificationProvider>
    </ContainerProvider>
  );
};
