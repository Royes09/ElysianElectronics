import "../app/globals.css";

import { AuthUserProvider } from "@/contexts/AuthUserContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}
