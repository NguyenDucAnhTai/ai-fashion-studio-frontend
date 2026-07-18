import { Camera, UploadCloud, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "../../../shared/components/Button";
import {
  getAvatarErrorMessage,
  useUploadMyAvatarMutation,
} from "../api";
import type { UserProfile } from "../types";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface AvatarUploaderProps {
  profile: UserProfile;
  onUploaded: (avatarUrl: string) => void;
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AvatarUploader({
  profile,
  onUploaded,
}: AvatarUploaderProps) {
  const inputId = "profile-avatar-file";
  const previewUrlRef = useRef<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [clientError, setClientError] = useState("");
  const uploadAvatar = useUploadMyAvatarMutation();
  const imageUrl = previewUrl || profile.avatarUrl;

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => revokePreviewUrl();
  }, []);

  const handleFileChange = (file?: File) => {
    setClientError("");
    uploadAvatar.reset();
    revokePreviewUrl();
    setPreviewUrl("");
    setSelectedFile(null);

    if (!file) {
      return;
    }

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setClientError("Avatar must be a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setClientError("Avatar must be 5MB or smaller.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setClientError("Please choose an avatar image before uploading.");
      return;
    }

    uploadAvatar.mutate(selectedFile, {
      onSuccess: (response) => {
        if (!response.data?.avatarUrl) {
          return;
        }

        onUploaded(response.data.avatarUrl);
        revokePreviewUrl();
        setPreviewUrl("");
        setSelectedFile(null);
      },
    });
  };

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={profile.fullName}
              className="h-full w-full object-cover"
            />
          ) : profile.fullName ? (
            <span className="text-3xl font-semibold">
              {getInitials(profile.fullName)}
            </span>
          ) : (
            <UserRound size={40} />
          )}
          {uploadAvatar.isPending && (
            <span className="absolute inset-0 flex items-center justify-center bg-primary-950/50 text-white">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary-950">Profile avatar</p>
          <p className="mt-1 text-sm leading-6 text-primary-500">
            Choose a JPEG, PNG, or WebP image up to 5MB. The image is previewed
            locally and uploaded only after you save it.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary-900 bg-transparent px-4 py-2 text-sm font-medium text-primary-900 transition hover:bg-primary-900 hover:text-white"
            >
              <Camera size={16} />
              Choose image
            </label>
            <input
              id={inputId}
              type="file"
              accept={ACCEPTED_AVATAR_TYPES.join(",")}
              className="sr-only"
              onChange={(event) => handleFileChange(event.target.files?.[0])}
            />

            <Button
              type="button"
              size="sm"
              disabled={!selectedFile}
              loading={uploadAvatar.isPending}
              onClick={handleUpload}
            >
              <UploadCloud size={16} />
              Upload Avatar
            </Button>
          </div>

          {selectedFile && (
            <p className="mt-3 text-xs text-primary-500">
              Ready to upload: {selectedFile.name}
            </p>
          )}
          {clientError && (
            <p className="mt-3 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {clientError}
            </p>
          )}
          {uploadAvatar.isError && (
            <p className="mt-3 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
              {getAvatarErrorMessage(uploadAvatar.error)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
