import type { Metadata } from "next";
import "./globals.css";
import { ResumeProvider } from "@/context/ResumeContext";
import { TemplateProvider } from "@/context/TemplateContext";
import { ColorThemeProvider } from "@/context/ColorThemeContext";

export const metadata: Metadata = {
  title: "AI Resume Builder",
  description: "Build a Resume That Gets Read.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TemplateProvider>
          <ColorThemeProvider>
            <ResumeProvider>{children}</ResumeProvider>
          </ColorThemeProvider>
        </TemplateProvider>
      </body>
    </html>
  );
}
