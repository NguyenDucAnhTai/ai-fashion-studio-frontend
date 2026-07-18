import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { useForgotPasswordMutation } from "./api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "./schemas";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(values, {
      onSuccess: () => {
        navigate(`/verify-reset-otp?email=${encodeURIComponent(values.email)}`);
      },
    });
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold text-accent-600">Password reset</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            Request a reset OTP
          </h1>
          <p className="mt-4 text-sm leading-7 text-primary-500">
            Enter the email for your Fitwear Studio account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />

            {forgotPasswordMutation.isError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(forgotPasswordMutation.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={forgotPasswordMutation.isPending}
            >
              <Mail size={17} />
              Send OTP
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
