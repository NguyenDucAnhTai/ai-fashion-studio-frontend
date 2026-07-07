import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { useResetPasswordMutation } from "./api";
import { resetPasswordSchema, type ResetPasswordFormValues } from "./schemas";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetPasswordMutation = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: searchParams.get("otp") ?? "",
      newPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(
      {
        email: values.email.trim(),
        otp: values.otp.trim(),
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => navigate("/login?reset=success", { replace: true }),
      },
    );
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold text-accent-600">Password reset</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            Set a new password
          </h1>
          <p className="mt-4 text-sm leading-7 text-primary-500">
            Use the verified OTP and choose a stronger password.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input label="OTP" error={errors.otp?.message} {...register("otp")} />
            <Input
              label="New password"
              type="password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            {resetPasswordMutation.isError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(resetPasswordMutation.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={resetPasswordMutation.isPending}
            >
              <LockKeyhole size={17} />
              Reset password
            </Button>
          </form>

          <Link
            to="/login"
            className="mt-6 inline-flex text-sm font-semibold text-primary-950 underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </Container>
    </section>
  );
}
