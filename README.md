# Ka-agapay – Mobile Health Service App

Mobile-first health service application for **RHU1 and RHU2, Malasiqui, Pangasinan**. Built for barangay residents including elderly, low-literacy, and PWD users. Runs in **Expo Go** on Android.

## Tech Stack

- **Frontend:** React Native + Expo
- **Styling:** NativeWind (Tailwind for React Native)
- **Navigation:** Expo Router
- **State:** React Context (Auth)
- **Backend:** REST API (configure `EXPO_PUBLIC_API_URL` in env)
- **Offline:** AsyncStorage cache

## Features

- **Account & Auth:** OTP + 4–6 digit PIN, optional biometrics (Face ID/Fingerprint)
- **Home:** Greeting, 4 main actions (Book Appointment, Health Programs, My Queue, Ask Ka-agapay), next appointment card, queue status
- **Health Programs:** List with descriptions, schedule, “Makinig” (Read Aloud) TTS
- **Appointments:** Step-by-step booking (service → date → AM/PM → RHU) → QR + queue number
- **Digital Queue:** Queue number, now serving, estimated wait, priority (Senior/PWD/Pregnant)
- **AI Chatbot:** Simple Filipino, text input, TTS responses, disclaimer (“Hindi ako kapalit ng doktor”)
- **Announcements:** Feed with “Read Aloud” per post
- **Notifications:** In-app list; SMS fallback when internet is weak
- **Feedback:** 1–5 emoji rating + one-tap options

## Accessibility

- Large text (16px body, 20–24px headings)
- High contrast (dark text on light background)
- Icons paired with labels
- TTS (Makinig) on programs and announcements
- Simple Filipino by default
- Thumb-friendly primary buttons

## Get Started

1. **Install**

   ```bash
   npm install
   ```

2. **Environment (optional)**

   Create `.env` or set:

   ```bash
   EXPO_PUBLIC_API_URL=https://ka-agapay-api.vercel.app/api
   ```

3. **Run**

   ```bash
   npx expo start
   ```

   Then open in **Expo Go** on your Android device (scan QR).

   **Windows:** The project uses `metro.config.cjs` (not `metro.config.js`) so Metro loads the config with CommonJS and avoids the ESM/Windows path error. Do not add a `metro.config.js` file.

## API Endpoints (Backend)

The app expects:

- `POST /auth/request-otp`, `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/login`
- `GET /user/profile`
- `POST /appointments`, `GET /appointments/:userId`, `GET /appointments/:id`, `PATCH /appointments/:id/cancel`
- `GET /queue/status/:appointmentId`
- `GET /programs`, `GET /announcements`
- `POST /chatbot/message`, `POST /feedback`

## Project Structure

- `app/` – Expo Router screens (tabs, auth, appointments, chatbot, announcements, notifications, feedback)
- `components/` – Reusable UI
- `context/` – AuthContext
- `hooks/` – useTts, etc.
- `services/api/` – API client and endpoints
- `services/storage/` – AsyncStorage cache
- `types/` – TypeScript types
- `utils/` – Constants (barangays, services, RHU, etc.)

## License

Private.
