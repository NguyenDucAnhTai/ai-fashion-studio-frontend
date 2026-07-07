import { type ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUserQuery } from "../features/auth/api";
import { useAuthStore } from "../features/auth/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

function AuthBootstrap({ children }: ProvidersProps) {
  const initFromStorage = useAuthStore((state) => state.initFromStorage);
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const shouldRestore = hydrated && Boolean(accessToken || !currentUser);
  const currentUserQuery = useCurrentUserQuery(shouldRestore);

  useEffect(() => {
    if (currentUserQuery.data?.data) {
      setCurrentUser(currentUserQuery.data.data);
    }
  }, [currentUserQuery.data, setCurrentUser]);

  return children;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryClientProvider>
  );
}
