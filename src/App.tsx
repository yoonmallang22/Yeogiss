import { ToastContainer } from "react-toastify";
import Router from "@/routes/Router";

function App() {
  return (
    <>
      <Router />
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={4000}
        hideProgressBar
      />
    </>
  );
}

export default App;
