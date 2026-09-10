import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/features/HomePage";
import { StoreSelectPage } from "@/features/StoreSelectPage";
import { MenuPage } from "@/features/MenuPage";
import { ProductPage } from "@/features/ProductPage";
import { CheckoutPage } from "@/features/CheckoutPage";
import { PaymentPage } from "@/features/PaymentPage";
import { OrdersPage } from "@/features/OrdersPage";
import { OrderDetailPage } from "@/features/OrderDetailPage";
import { MePage } from "@/features/MePage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/stores", element: <StoreSelectPage /> },
      { path: "/menu", element: <MenuPage /> },
      { path: "/product/:id", element: <ProductPage /> },
      // the cart is a sheet on the menu page, not a standalone screen
      { path: "/cart", element: <Navigate to="/menu?cart=1" replace /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/payment/:orderId", element: <PaymentPage /> },
      { path: "/orders", element: <OrdersPage /> },
      { path: "/orders/:id", element: <OrderDetailPage /> },
      { path: "/me", element: <MePage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
