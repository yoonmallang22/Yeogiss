import { BrowserRouter, Route, Routes } from "react-router-dom";
import KakaoMap from "@/components/KakaoMap";
import Home from "@/pages/home/Home";
import Direction from "@/pages/direction/Direction";
import GoogleAnalytics from "@/lib/GoogleAnalytics";

const Router = () => {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <Routes>
        <Route path="/" element={<KakaoMap />}>
          <Route index element={<Home />} />
          <Route path="/directions" element={<Direction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
