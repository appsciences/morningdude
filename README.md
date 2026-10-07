# Morning Dude

Expo TypeScript app with Firebase email/password authentication, persistent login on native devices, and a private Firestore profile per user. Web uses Firebase's browser persistence.

See [the product spec](SPEC.md) for the planned morning review of unanswered Slack messages, important emails, and work/business opportunities.

## Firebase project setup

1. In https://console.firebase.google.com/ create a project named **morning-dude**. Project IDs are globally unique; use the assigned ID if the requested one is unavailable. Analytics is optional.
2. Register a **Web app** in Project settings, including when targeting iOS/Android with the Firebase JS SDK. Copy its public Firebase configuration.
3. Copy `.env.example` to `.env.local` and fill all four values. These Expo public variables are bundled into the client; never put service-account keys or other private credentials here.
4. In Authentication → Sign-in method, enable **Email/Password**. Add your deployed web hostname to authorized domains if needed.
5. Create a Cloud Firestore database in production mode and choose your preferred region. Publish the contents of `firestore.rules` in its Rules tab before testing profile access. Alternatively, with an authenticated Firebase CLI, run `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID` from this directory.

The project and rules have not been provisioned or deployed automatically. No service-account key is needed by the app.

## Development

Requires Node.js 24 (validated with 24.19.0) and npm.

```sh
npm ci
npx expo start --web
```

For a native device, use `npx expo start` and an Expo Go version supporting SDK 57, or a development build. A cloud machine must be reachable from the device; native device connectivity is separate from local web validation. Restart Expo after editing `.env.local`.

```sh
npx tsc --noEmit
npx expo export --platform web
```

In restricted cloud networking, `EXPO_OFFLINE=1 npx expo start --web` and `EXPO_OFFLINE=1 npx expo export --platform web` use installed SDK metadata. Firebase requests still need network access to `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`, and `firestore.googleapis.com`.

## Functional validation after configuration

Create an account, save a display name, reload to confirm the session and profile persist, sign out, and sign in again. A second account should get a separate profile. Firestore rules deny unauthenticated access and access to another user's document. Live Firebase behavior requires the real project configuration, enabled provider, database, and published rules.
