import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../auth/api";
import { useAuthStore } from "../auth/authStore";
import { loginSchema, type LoginFormValues } from "../auth/schemas";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { ROLES } from "../../shared/constants/roles";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const loginMutation = useLoginMutation();
  const [accessDeniedMessage, setAccessDeniedMessage] = useState("");
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
    const stateRedirect = (
      location.state as { from?: { pathname?: string } } | null
    )?.from?.pathname;
    return stateRedirect ?? "/admin/dashboard";
  }, [location.state]);

  const onSubmit = (values: LoginFormValues) => {
    setAccessDeniedMessage("");
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (!response.data) {
          return;
        }

        if (!response.data.user.roles.includes(ROLES.admin)) {
          setAccessDeniedMessage("This account does not have admin access.");
          return;
        }

        setSession(response.data);
        navigate(redirectTarget, { replace: true });
      },
    });
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-6 py-20">
      <Container className="flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900">
              <ShieldCheck size={26} className="text-accent-300" />
            </span>
          </div>

          <h1 className="mt-6 text-center font-display text-3xl font-semibold text-primary-950">
            Admin Portal
          </h1>
          <p className="mt-2 text-center text-sm leading-6 text-primary-500">
            Restricted access. Sign in with an authorized admin account.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              label="Email"
              type="email"
              placeholder="admin@fitwearstudio.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            {accessDeniedMessage && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {accessDeniedMessage}
              </p>
            )}

            {loginMutation.isError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(loginMutation.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loginMutation.isPending}
            >
              <ShieldCheck size={17} />
              Sign in
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
