import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, PackageCheck, Shirt, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { ROLES } from "../../shared/constants/roles";
import { getCurrentUser, useLoginMutation } from "./api";
import { useAuthStore } from "./authStore";
import { normalizeAuthResponse } from "./normalizers";
import { getRoleRedirect, isRedirectAllowedForRoles } from "./roleRedirect";
import { loginSchema, type LoginFormValues } from "./schemas";

const CUSTOMER_BENEFITS = [
  {
    icon: Shirt,
    title: "Design your own tee",
    detail: "Customize prints, colors, and materials in the studio editor.",
  },
  {
    icon: Sparkles,
    title: "Preview with AI Try-On",
    detail: "See how a design looks on you before you place an order.",
  },
  {
    icon: PackageCheck,
    title: "Track every order",
    detail: "Follow production, shipping, and delivery status live.",
  },
  {
    icon: Star,
    title: "Share your feedback",
    detail: "Rate completed orders to help other shoppers choose.",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const loginMutation = useLoginMutation();
  const [authMessage, setAuthMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const redirectTarget = useMemo(() => {
    const queryRedirect = searchParams.get("redirect");
    const stateRedirect = (
      location.state as { from?: { pathname?: string } } | null
    )?.from?.pathname;
    return queryRedirect ?? stateRedirect ?? "";
  }, [location.state, searchParams]);

  const onSubmit = (values: LoginFormValues) => {
    setAuthMessage("");
    loginMutation.mutate(values, {
      onSuccess: async (response) => {
        const session = normalizeAuthResponse(response);
        let user = session.user;

        setSession(session);

        if (!user || user.roles.length === 0) {
          try {
            const meResponse = await getCurrentUser();
            user = meResponse.data ?? user;
          } catch {
            user = user ?? null;
          }
        }

        if (!user) {
          // TODO: remove this CUSTOMER fallback when backend always returns /me after login.
          user = { email: values.email, roles: [ROLES.customer], role: ROLES.customer };
        } else if (user.roles.length === 0) {
          // TODO: remove this CUSTOMER fallback when backend always returns role/roles.
          user = { ...user, roles: [ROLES.customer], role: ROLES.customer };
        }

        setCurrentUser(user);

        const roles = user.roles.length ? user.roles : [ROLES.customer];
        const target = isRedirectAllowedForRoles(redirectTarget, roles)
          ? redirectTarget
          : getRoleRedirect(roles);

        navigate(target, { replace: true });
      },
      onError: (error) => {
        setAuthMessage(getApiErrorMessage(error));
      },
    });
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft lg:grid-cols-[1fr_0.85fr]">
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold text-accent-600">
              Welcome back
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
              Sign in to your Fitwear Studio account
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-500">
              Access your saved designs, Try-On previews, checkout, and order
              history.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <Input
                label="Email"
                type="email"
                placeholder="customer@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Password@123"
                error={errors.password?.message}
                {...register("password")}
              />

              {loginMutation.isError && (
                <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                  {authMessage || getApiErrorMessage(loginMutation.error)}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loginMutation.isPending}
              >
                <LogIn size={17} />
                Login
              </Button>
            </form>

            <p className="mt-6 text-sm text-primary-500">
              <Link
                to="/forgot-password"
                className="font-semibold text-primary-950 underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </p>

            <p className="mt-3 text-sm text-primary-500">
              New customer?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary-950 underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>

          <aside className="bg-primary-950 p-8 text-white sm:p-10 lg:p-12">
            <h2 className="font-display text-3xl font-semibold">
              Your studio, from idea to doorstep
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Everything you need as a Fitwear Studio customer, in one
              account.
            </p>
            <div className="mt-8 space-y-4">
              {CUSTOMER_BENEFITS.map(({ icon: Icon, title, detail }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-300">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
