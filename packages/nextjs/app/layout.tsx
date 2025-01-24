import { Outfit } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata = getMetadata({
  title: "Lena Finance",
  description: "A Suite of tools for DeFi projects",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning lang="en" className={`${outfit.variable} font-sans`}>
      <body>
        <ThemeProvider enableSystem>
          <div className="min-h-screen relative font-mono overflow-hidden">
            <div className="relative">
              <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
