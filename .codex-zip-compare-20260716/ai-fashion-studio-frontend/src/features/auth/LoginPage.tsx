import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  LogIn,
  PackageCheck,
  Shirt,
  Sparkles,
  Star,
} from "lucide-react";
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
          user = {
            email: values.email,
            roles: [ROLES.customer],
            role: ROLES.customer,
          };
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
    <section className="relative min-h-screen overflow-hidden bg-[#f6f4ef] pt-28 pb-20 lg:pt-32">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent-300/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-beige-300/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-primary-200/60 blur-3xl" />

      <Container>
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(20,20,20,0.10)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="relative hidden min-h-[680px] overflow-hidden bg-primary-950 p-10 text-white lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(196,181,253,0.35),transparent_32%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.16),transparent_28%)]" />
            <div className="absolute -right-28 top-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">
                  <Sparkles size={16} className="text-accent-300" />
                  AI T-shirt customization
                </div>

                <h2 className="mt-8 max-w-md font-display text-5xl font-semibold leading-tight">
                  Your fashion idea, ready to wear.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
                  Sign in to continue designing shirts, previewing Try-On
                  results, tracking orders, and saving your favorite ideas.
                </p>
              </div>

              <div className="space-y-3">
                {CUSTOMER_BENEFITS.map(({ icon: Icon, title, detail }) => (
                  <div
                    key={title}
                    className="group flex gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 transition hover:bg-white/[0.11]"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent-300 transition group-hover:scale-105">
                      <Icon size={19} />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/60">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="relative p-6 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-950 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
                  <LogIn size={14} />
                  Customer Login
                </div>

                <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-primary-950 sm:text-5xl">
                  Welcome back to Fitwear Studio
                </h1>

                <p className="mt-4 text-sm leading-7 text-primary-500">
                  Login to continue your designs, Try-On previews, orders, and
                  saved studio work.
                </p>
              </div>

              <div className="mb-7 grid grid-cols-3 gap-3">
                {["Design", "Try-On", "Order"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-primary-100 bg-beige-50 px-3 py-3 text-center"
                  >
                    <CheckCircle2
                      size={16}
                      className="mx-auto mb-1 text-success-700"
                    />
                    <p className="text-xs font-semibold text-primary-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Input
                  label="Email address"
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

                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-400">
                    Secure customer access
                  </span>
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-primary-950 underline underline-offset-4 transition hover:text-accent-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                {loginMutation.isError && (
                  <p className="rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm leading-6 text-error-700">
                    {authMessage || getApiErrorMessage(loginMutation.error)}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full justify-center rounded-2xl bg-primary-950 py-4 text-white hover:bg-primary-800"
                  loading={loginMutation.isPending}
                >
                  <LogIn size={17} />
                  Login
                  <ArrowRight size={17} />
                </Button>
              </form>

              <div className="mt-8 rounded-3xl border border-primary-100 bg-white p-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <p className="text-sm text-primary-500">
                  New to Fitwear Studio?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-950 underline underline-offset-4 transition hover:text-accent-600"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
