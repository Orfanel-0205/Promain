// src/App.tsx
import {
    AuthView,
    NeonAuthUIProvider,
} from "@neondatabase/neon-js/auth/react/ui";
import { authClient } from "./auth";

export default function App() {
  return (
    <NeonAuthUIProvider authClient={authClient}>
      <AuthView pathname="sign-in" /> {/* 'sign-in' or 'sign-up' */}
    </NeonAuthUIProvider>
  );
}
 