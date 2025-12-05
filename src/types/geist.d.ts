// Type declarations for Geist fonts
declare module "geist/font/sans" {
  import { NextFont } from "next/dist/compiled/@next/font";
  export const GeistSans: NextFont & { variable: string };
}

declare module "geist/font/mono" {
  import { NextFont } from "next/dist/compiled/@next/font";
  export const GeistMono: NextFont & { variable: string };
}
