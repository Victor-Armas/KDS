import { Routes, Route, Navigate } from "react-router-dom";
import KioskLayout from "../layouts/KioskLayout";
import KioskPage from "../modules/kiosk/page/KioskPage";
import KitchenPage from "@/modules/kitchen/page/KitchenPage";

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/kiosk" />} />
      <Route element={<KioskLayout />}>
        <Route path="/kiosk" element={<KioskPage />} />
      </Route>
      <Route path="/kitchen" element={<KitchenPage />} />
    </Routes>
  );
}
