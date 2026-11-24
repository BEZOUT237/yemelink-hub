import { lazy, Suspense } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts, Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import appCss from "../styles.css?url";

const NetworkBackground = lazy(() => import("@/components/three/NetworkBackground"));

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).__YEMELINK_SPA__) {
    return <>{children}</>;
  }
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "YEMELINK — Online Products & Services" },
      { name: "description", content: "YEMELINK is a tech & digital media company helping businesses transform their digital presence. Web, mobile, design, and marketing." },
      { name: "author", content: "YEMELINK" },
      { property: "og:title", content: "YEMELINK — Online Products & Services" },
      { property: "og:description", content: "Tech hub for entrepreneurs: web development, mobile apps, design, and digital marketing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();
  const { reducedMotion } = useMotionPrefs();

  return (
    <AuthProvider>
      <SmoothScrollProvider>
        <div className="min-h-screen bg-background overflow-x-hidden">
          <IntroLoader />
          <CustomCursor />
          <div className="fixed inset-0 -z-10 grid-bg opacity-40" aria-hidden />
          <div className="fixed inset-0 -z-10 bg-mesh" aria-hidden />
          <Suspense fallback={null}>
            <NetworkBackground />
          </Suspense>
          <Header />
          <main className="pt-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
          <Toaster />
        </div>
      </SmoothScrollProvider>
    </AuthProvider>
  );
}
