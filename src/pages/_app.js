import "../app/globals.css";
import { Toaster } from "react-hot-toast";

import { AuthUserProvider } from "@/contexts/AuthUserContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 60,
          left: 20,
          bottom: 60,
          right: 20,
        }}
      />
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
