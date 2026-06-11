import { ToastContainer } from "react-toastify";

const baseClass =
  "bg-error/90 text-xs px-7.5 py-3.5 mx-5 mt-5 relative flex p-1 min-w-10 min-h-10 justify-center rounded-2xl overflow-hidden text-center";

const contextClass = {
  success: baseClass,
  error: baseClass,
  info: baseClass,
  warning: baseClass,
  default: baseClass,
  dark: baseClass,
};

const Toast = () => {
  return (
    <ToastContainer
      position="top-center"
      toastClassName={(context) => contextClass[context?.type || "default"]}
      limit={1}
      autoClose={3000}
      closeButton={false}
      hideProgressBar
    />
  );
};

export default Toast;
