import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="fixed inset-0 -z-10 grid-bg opacity-40" aria-hidden />
        <div className="fixed inset-0 -z-10 bg-mesh" aria-hidden />
        <Header />
        <main className="pt-24">
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
}
