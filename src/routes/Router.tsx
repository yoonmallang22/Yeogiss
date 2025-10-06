import { BrowserRouter, Route, Routes } from "react-router-dom";
import KakaoMap from "@/components/KakaoMap";
import Home from "@/pages/home/Home";
import Direction from "@/pages/direction/Direction";
import GoogleAnalytics from "@/lib/GoogleAnalytics";
import PATH from "@/constants/path";

const Router = () => {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <Routes>
        <Route path={PATH.HOME} element={<KakaoMap />}>
          <Route index element={<Home />} />
          <Route path={PATH.DIRECTIONS} element={<Direction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
