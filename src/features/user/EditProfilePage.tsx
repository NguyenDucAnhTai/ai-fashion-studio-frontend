import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import { useAuthStore } from "../auth/authStore";
import {
  getProfileErrorTitle,
  getProfileFieldErrors,
  MY_PROFILE_QUERY_KEY,
  profileToCurrentUser,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "./api";
import type { UpdateProfileRequest, UserProfile } from "./types";

const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(255, "Full name must be 255 characters or fewer"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be 20 characters or fewer")
    .optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileQuery = useMyProfileQuery();
  const updateProfile = useUpdateMyProfileMutation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const [generalError, setGeneralError] = useState("");
  const profile = profileQuery.data?.data;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    values: {
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    setGeneralError("");
    const phone = values.phone?.trim();
    const payload: UpdateProfileRequest = {
      fullName: values.fullName.trim(),
      phone: phone || null,
    };

    updateProfile.mutate(payload, {
      onSuccess: (response) => {
        if (!response.data) {
          return;
        }

        queryClient.setQueryData<ApiResponse<UserProfile>>(
          MY_PROFILE_QUERY_KEY,
          response,
        );
        setCurrentUser(profileToCurrentUser(response.data, currentUser));
        navigate("/profile", {
          replace: true,
          state: { profileMessage: "Profile updated" },
        });
      },
      onError: (error) => {
        const fieldErrors = getProfileFieldErrors(error);
        const fieldEntries = Object.entries(fieldErrors);

        fieldEntries.forEach(([field, message]) => {
          setError(field as keyof EditProfileFormValues, {
            type: "server",
            message,
          });
        });

        if (fieldEntries.length === 0) {
          setGeneralError(getApiErrorMessage(error));
        }
      },
    });
  };

  if (profileQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Loading label="Loading profile..." />
      </section>
    );
  }

  if (profileQuery.isError) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title={getProfileErrorTitle(profileQuery.error)}
            description="Please check your session or try again in a moment."
            onRetry={() => profileQuery.refetch()}
          />
        </Container>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
        <Container>
          <ErrorState
            title="No profile data"
            description="The profile form cannot be opened until your profile is loaded."
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-950"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <div className="mx-auto max-w-2xl rounded-3xl border border-primary-100 bg-white p-8 shadow-soft sm:p-10">
          <p className="text-sm font-semibold text-accent-600">Edit Profile</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            Update personal information
          </h1>
          <p className="mt-3 text-sm leading-7 text-primary-500">
            Only your full name and phone number can be edited here. Email,
            roles, status, and password are not part of this profile form.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Email" value={profile.email} readOnly />
            <Input
              label="Full name"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register("phone")}
            />

            {generalError && (
              <p className="rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {generalError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={updateProfile.isPending}
            >
              <Save size={17} />
              Save profile
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
