import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import { DESIGN_STATUS, getDesignStatusTone } from "../../shared/constants/designStatus";
import DesignPreview from "../design/DesignPreview";
import { useDesignDetailQuery } from "../design/api";
import { useCreateTryOnMutation } from "./api";
import { tryOnSchema, type TryOnFormValues } from "./schemas";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

export default function TryOnPage() {
  const { designId = "" } = useParams();
  const navigate = useNavigate();
  const designQuery = useDesignDetailQuery(designId);
  const createTryOn = useCreateTryOnMutation();
  const [photoUrl, setPhotoUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TryOnFormValues>({
    resolver: zodResolver(tryOnSchema),
    mode: "onBlur",
    defaultValues: { heightCm: 170, weightKg: 60 },
  });
  const design = designQuery.data?.data;
  const canSubmit = Boolean(photoUrl && design && (design.status === DESIGN_STATUS.saved || design.status === DESIGN_STATUS.locked));

  const handleFileChange = async (file: File) => {
    setPhotoUrl(await fileToDataUrl(file));
  };

  const onSubmit = (values: TryOnFormValues) => {
    if (!design || !photoUrl) {
      return;
    }

    createTryOn.mutate(
      {
        designId: design.id,
        userPhotoUrl: photoUrl,
        heightCm: values.heightCm,
        weightKg: values.weightKg,
      },
      {
        onSuccess: (response) => {
          if (response.data?.tryonRequestId) {
            navigate(`/tryon/result/${response.data.tryonRequestId}`);
          }
        },
      },
    );
  };

  if (designQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading design for Try-On..." />
      </section>
    );
  }

  if (!design) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Design not found" description="Try-On requires a saved design that belongs to your account." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div>
            <p className="text-sm font-semibold text-accent-600">AI Virtual Try-On</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-semibold text-primary-950">{design.name}</h1>
              <Badge tone={getDesignStatusTone(design.status)}>{design.status}</Badge>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-500">
              Upload a customer photo and submit an async Try-On job. The result is only a preview and is never used as the print file.
            </p>
            <div className="mt-8 rounded-3xl border border-primary-100 bg-white p-5 shadow-soft">
              <DesignPreview imageUrl={design.previewImageUrl} name={design.name} className="min-h-[420px]" />
            </div>
          </div>

          <form className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="text-lg font-semibold text-primary-950">Customer photo</h2>
            <p className="mt-2 text-sm leading-6 text-primary-500">Use a clear front-facing image for the MVP demo request.</p>

            <label className="mt-5 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-primary-200 bg-beige-50 text-center transition hover:border-accent-300">
              {photoUrl ? (
                <img src={photoUrl} alt="Uploaded customer" className="h-72 w-full rounded-3xl object-cover" />
              ) : (
                <>
                  <UploadCloud size={42} className="text-primary-300" />
                  <span className="mt-3 text-sm font-semibold text-primary-700">Upload user photo</span>
                  <span className="mt-1 text-xs text-primary-400">Stored as data URL until upload service exists</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void handleFileChange(file);
                  }
                }}
              />
            </label>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input label="Height (cm)" type="number" error={errors.heightCm?.message} {...register("heightCm")} />
              <Input label="Weight (kg)" type="number" error={errors.weightKg?.message} {...register("weightKg")} />
            </div>

            {design.status === DESIGN_STATUS.draft && (
              <p className="mt-4 rounded-2xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
                Save this design before requesting Try-On.
              </p>
            )}
            {createTryOn.isError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getApiErrorMessage(createTryOn.error)}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={!canSubmit} loading={createTryOn.isPending}>
              <Sparkles size={17} />
              Submit Try-On
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
