import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { useVerifyResetOtpMutation } from "./api";
import {
  verifyResetOtpSchema,
  type VerifyResetOtpFormValues,
} from "./schemas";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readResetToken(response: unknown) {
  const data = isRecord(response) && "data" in response ? response.data : response;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (!isRecord(data)) {
    return null;
  }

  const token =
    data.resetToken ?? data.ResetToken ?? data.token ?? data.reset_token;

  return typeof token === "string" && token.trim() ? token.trim() : null;
}

export default function VerifyResetOtpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const initialEmail = searchParams.get("email") ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),
    mode: "onChange",
    defaultValues: { email: initialEmail, otp: "" },
  });

  const onSubmit = (values: VerifyResetOtpFormValues) => {
    const email = values.email.trim();
    const otp = values.otp.trim();

    verifyResetOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: (response) => {
          const resetToken = readResetToken(response) ?? otp;

          navigate(
            `/reset-password?email=${encodeURIComponent(email)}`,
            { state: { resetToken } },
          );
        },
      },
    );
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold text-accent-600">Password reset</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            Verify OTP
          </h1>
          <p className="mt-4 text-sm leading-7 text-primary-500">
            Confirm the OTP before choosing a new password.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input label="OTP" error={errors.otp?.message} {...register("otp")} />

            {verifyResetOtpMutation.isError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(verifyResetOtpMutation.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={verifyResetOtpMutation.isPending}
            >
              <KeyRound size={17} />
              Verify OTP
            </Button>
          </form>

          <Link
            to="/forgot-password"
            className="mt-6 inline-flex text-sm font-semibold text-primary-950 underline underline-offset-4"
          >
            Request another OTP
          </Link>
        </div>
      </Container>
    </section>
  );
}
