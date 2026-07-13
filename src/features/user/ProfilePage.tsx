import { Edit3, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../../shared/api/apiResponse";
import Badge from "../../shared/components/Badge";
import Container from "../../shared/components/Container";
import EmptyState from "../../shared/components/EmptyState";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { useAuthStore } from "../auth/authStore";
import {
  getProfileErrorTitle,
  MY_PROFILE_QUERY_KEY,
  profileToCurrentUser,
  useMyProfileQuery,
} from "./api";
import AvatarUploader from "./components/AvatarUploader";
import type { UserProfile } from "./types";

function getStatusTone(status: string) {
  return status.toUpperCase() === "ACTIVE" ? "success" : "warning";
}

export default function ProfilePage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const profileQuery = useMyProfileQuery();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const [notice, setNotice] = useState(
    (location.state as { profileMessage?: string } | null)?.profileMessage ?? "",
  );
  const profile = profileQuery.data?.data;

  const handleAvatarUploaded = (avatarUrl: string) => {
    if (!profile) {
      return;
    }

    const nextProfile = { ...profile, avatarUrl };
    queryClient.setQueryData<ApiResponse<UserProfile>>(
      MY_PROFILE_QUERY_KEY,
      (oldProfile) =>
        oldProfile ? { ...oldProfile, data: nextProfile } : oldProfile,
    );
    setCurrentUser(profileToCurrentUser(nextProfile, currentUser));
    setNotice("Avatar uploaded");
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
          <EmptyState
            title="No profile data"
            description="Your profile information will appear here after the backend returns it."
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-accent-600">My Profile</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
              Personal account details
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
              Manage your display name, phone number, and avatar. Email, role,
              status, and password are controlled outside this profile page.
            </p>
          </div>
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-900 px-6 py-2.5 text-sm font-medium tracking-wide text-white shadow-sm transition hover:bg-primary-700"
          >
            <Edit3 size={16} />
            Edit Profile
          </Link>
        </div>

        {notice && (
          <div className="mb-6 rounded-2xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-700">
            {notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={38} />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-3xl font-semibold text-primary-950">
                  {profile.fullName}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.roles.map((role) => (
                    <Badge key={role} tone="accent">
                      {role}
                    </Badge>
                  ))}
                  <Badge tone={getStatusTone(profile.status)}>
                    {profile.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                  <Mail size={14} />
                  Email
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-primary-950">
                  {profile.email}
                </p>
              </div>
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                  <Phone size={14} />
                  Phone
                </p>
                <p className="mt-2 text-sm font-semibold text-primary-950">
                  {profile.phone || "Not updated"}
                </p>
              </div>
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-400">
                  <ShieldCheck size={14} />
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-primary-950">
                  {profile.status}
                </p>
              </div>
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                  Roles
                </p>
                <p className="mt-2 text-sm font-semibold text-primary-950">
                  {profile.roles.join(", ") || "No role"}
                </p>
              </div>
            </div>
          </div>

          <AvatarUploader profile={profile} onUploaded={handleAvatarUploaded} />
        </div>
      </Container>
    </section>
  );
}
