import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "./components/LightRays";
import Navbar from "./components/Navbar";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"], // Specify the desired weights
  subsets: ["latin"], // Specify the desired subsets
  variable: "--font-ubuntu",
});

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"], // Specify the desired weights
  subsets: ["latin"], // Specify the desired subsets
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "Dev Events",
  description: "Find all events in developer community in a single platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${ubuntu.variable} ${ubuntuMono.variable} antialiased`}>
        <div className="absolute top-0 inset-0 z-[-1] min-h-screen ">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={1}
            rayLength={0.7}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0.01}
            distortion={0.01}
            className="custom-rays"
          />
        </div>
        <Navbar></Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
