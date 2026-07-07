import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import Input from "../../shared/components/Input";
import { useRegisterMutation } from "./api";
import { registerSchema, type RegisterFormValues } from "./schemas";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    const phone = values.phone?.trim();

    registerMutation.mutate(
      {
        email: values.email,
        password: values.password,
        fullName: values.fullName.trim(),
        ...(phone ? { phone } : {}),
      },
      {
        onSuccess: () => navigate("/login?registered=1", { replace: true }),
      },
    );
  };

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold text-accent-600">
            Customer account
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            Create your Fitwear Studio account
          </h1>
          <p className="mt-4 text-sm leading-7 text-primary-500">
            New accounts are created as CUSTOMER by default, matching the MVP
            authentication contract.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Input
              label="Full name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register("password")}
            />

            {registerMutation.isError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(registerMutation.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={registerMutation.isPending}
            >
              <UserPlus size={17} />
              Register
            </Button>
          </form>

          <p className="mt-6 text-sm text-primary-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-950 underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
