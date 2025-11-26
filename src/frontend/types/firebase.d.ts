declare module "firebase/app" {
  export interface FirebaseOptions {
    apiKey: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    [key: string]: string | undefined;
  }

  export interface FirebaseApp {}

  export function initializeApp(options: FirebaseOptions): FirebaseApp;
}

declare module "firebase/analytics" {
  import type { FirebaseApp } from "firebase/app";

  export interface Analytics {}

  export function getAnalytics(app: FirebaseApp): Analytics;
  export function isSupported(): Promise<boolean>;
}

declare module "firebase/auth" {
  import type { FirebaseApp } from "firebase/app";

  export interface Auth {}

  export function getAuth(app: FirebaseApp): Auth;
}

declare module "firebase/firestore" {
  import type { FirebaseApp } from "firebase/app";

  export interface Firestore {}

  export function getFirestore(app: FirebaseApp): Firestore;
}
