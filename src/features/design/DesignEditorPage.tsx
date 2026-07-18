import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ShoppingBag, Sparkles, Wand2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Canvas as FabricCanvas, FabricImage, IText, type FabricObject } from "fabric";
import type { ApiResponse } from "../../shared/api/apiResponse";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { DESIGN_STATUS, getDesignStatusTone } from "../../shared/constants/designStatus";
import { useProductDetailQuery as useCatalogProductDetailQuery } from "../catalog/api";
import DesignPreview from "./DesignPreview";
import EditorToolbar, { type StickerAsset } from "./EditorToolbar";
import TShirtCanvas from "./TShirtCanvas";
import {
  getDesignErrorMessage,
  useDesignDetailQuery,
  useGenerateDesignPreviewMutation,
  useSaveDesignMutation,
} from "./api";
import type { DesignDetail, DesignLayer } from "./types";

type NamedFabricObject = FabricObject & { name?: string };

const STICKER_ASSETS: StickerAsset[] = [
  {
    id: "bolt",
    label: "Lightning",
    preview: "⚡",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="M102 12 33 103h44l-8 65 78-101h-48l3-55Z" fill="#F5C542" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "star",
    label: "Star",
    preview: "★",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="m90 15 21 48 52 5-39 34 12 51-46-27-46 27 12-51-39-34 52-5 21-48Z" fill="#FF7A59" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "smile",
    label: "Smile",
    preview: "☺",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="66" fill="#B7F36B" stroke="#111" stroke-width="8"/><circle cx="67" cy="75" r="8" fill="#111"/><circle cx="113" cy="75" r="8" fill="#111"/><path d="M58 105c16 23 48 23 64 0" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/></svg>`,
  },
  {
    id: "wave",
    label: "Wave",
    preview: "〰",
    svg: `<svg width="220" height="150" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg"><path d="M16 84c32-54 64 54 96 0s64 54 92 0" fill="none" stroke="#42A5F5" stroke-width="18" stroke-linecap="round"/><path d="M16 84c32-54 64 54 96 0s64 54 92 0" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "heart",
    label: "Heart",
    preview: "♥",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="M90 151C51 119 28 98 28 66c0-22 15-38 36-38 12 0 22 6 26 16 4-10 14-16 26-16 21 0 36 16 36 38 0 32-23 53-62 85Z" fill="#EF476F" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "badge",
    label: "Studio badge",
    preview: "AF",
    svg: `<svg width="190" height="190" viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="140" height="140" rx="32" fill="#111"/><rect x="38" y="38" width="114" height="114" rx="24" fill="none" stroke="#fff" stroke-width="5"/><text x="95" y="108" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="900" fill="#fff">AF</text><text x="95" y="130" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#B7F36B">STUDIO</text></svg>`,
  },
];

const STICKER_ASSETS: StickerAsset[] = [
  {
    id: "bolt",
    label: "Lightning",
    preview: "⚡",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="M102 12 33 103h44l-8 65 78-101h-48l3-55Z" fill="#F5C542" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "star",
    label: "Star",
    preview: "★",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="m90 15 21 48 52 5-39 34 12 51-46-27-46 27 12-51-39-34 52-5 21-48Z" fill="#FF7A59" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "smile",
    label: "Smile",
    preview: "☺",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="66" fill="#B7F36B" stroke="#111" stroke-width="8"/><circle cx="67" cy="75" r="8" fill="#111"/><circle cx="113" cy="75" r="8" fill="#111"/><path d="M58 105c16 23 48 23 64 0" fill="none" stroke="#111" stroke-width="8" stroke-linecap="round"/></svg>`,
  },
  {
    id: "wave",
    label: "Wave",
    preview: "〰",
    svg: `<svg width="220" height="150" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg"><path d="M16 84c32-54 64 54 96 0s64 54 92 0" fill="none" stroke="#42A5F5" stroke-width="18" stroke-linecap="round"/><path d="M16 84c32-54 64 54 96 0s64 54 92 0" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: "heart",
    label: "Heart",
    preview: "♥",
    svg: `<svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg"><path d="M90 151C51 119 28 98 28 66c0-22 15-38 36-38 12 0 22 6 26 16 4-10 14-16 26-16 21 0 36 16 36 38 0 32-23 53-62 85Z" fill="#EF476F" stroke="#111" stroke-width="8" stroke-linejoin="round"/></svg>`,
  },
  {
    id: "badge",
    label: "Studio badge",
    preview: "AF",
    svg: `<svg width="190" height="190" viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="140" height="140" rx="32" fill="#111"/><rect x="38" y="38" width="114" height="114" rx="24" fill="none" stroke="#fff" stroke-width="5"/><text x="95" y="108" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="900" fill="#fff">AF</text><text x="95" y="130" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#B7F36B">STUDIO</text></svg>`,
  },
];

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function objectToLayer(object: FabricObject, index: number): DesignLayer | null {
  if ((object as NamedFabricObject).name === "shirt-model") {
  if ((object as NamedFabricObject).name === "shirt-model") {
    return null;
  }

  const objectType = object.type?.toUpperCase() ?? "SHAPE";
  const isText = object.type === "i-text" || object.type === "textbox" || object.type === "text";
  const imageSource = object instanceof FabricImage ? object.getSrc() : null;
  const objectName = (object as NamedFabricObject).name;
  const imageLayerType = objectName === "design-sticker" ? "ICON" : "IMAGE";
  const objectName = (object as NamedFabricObject).name;
  const imageLayerType = objectName === "design-sticker" ? "ICON" : "IMAGE";

  return {
    layerType: isText ? "TEXT" : imageSource ? imageLayerType : objectType,
    content: isText ? String((object as IText).text ?? "") : imageSource,
    layerType: isText ? "TEXT" : imageSource ? imageLayerType : objectType,
    content: isText ? String((object as IText).text ?? "") : imageSource,
    imageUrl: imageSource || null,
    positionX: Math.round(object.left ?? 0),
    positionY: Math.round(object.top ?? 0),
    width: Math.round(object.getScaledWidth()),
    height: Math.round(object.getScaledHeight()),
    rotation: Math.round(object.angle ?? 0),
    color: typeof object.fill === "string" ? object.fill : null,
    zIndex: index + 1,
  };
}

function getEditableCanvasJson(canvas: FabricCanvas) {
  const canvasJson = canvas.toJSON() as Record<string, unknown>;
  const objects = Array.isArray(canvasJson.objects) ? canvasJson.objects : [];
  const editableObjects = canvas
    .getObjects()
    .map((object, index) => ({
      object,
      json: objects[index],
    }))
    .filter(({ object, json }) => {
      return (object as NamedFabricObject).name !== "shirt-model" && Boolean(json);
      return (object as NamedFabricObject).name !== "shirt-model" && Boolean(json);
    })
    .map(({ json }) => json);

  return {
    ...canvasJson,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    objects: editableObjects,
  };
}

function asCanvasJson(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export default function DesignEditorPage() {
  const { designId = "" } = useParams();
  const safeDesignId = designId.trim();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const designQuery = useDesignDetailQuery(safeDesignId);
  const saveMutation = useSaveDesignMutation(safeDesignId);
  const generatePreviewMutation = useGenerateDesignPreviewMutation(safeDesignId);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [nameByDesignId, setNameByDesignId] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState("");
  const [editorError, setEditorError] = useState("");
  const [shirtView, setShirtView] = useState<"front" | "back">("front");
  const [shirtView, setShirtView] = useState<"front" | "back">("front");
  const selectedColor = useMemo(() => {
    return typeof selectedObject?.fill === "string" ? selectedObject.fill : "#0a0a0a";
  }, [selectedObject]);
  const design = designQuery.data?.data;
  const productQuery = useCatalogProductDetailQuery(design?.productId ?? "");
  const product = productQuery.data?.data ?? null;
  const productQuery = useCatalogProductDetailQuery(design?.productId ?? "");
  const product = productQuery.data?.data ?? null;
  const locked = design?.status === DESIGN_STATUS.locked;
  const designName = design ? nameByDesignId[design.id] ?? design.name : "";
  // The save flow stores a client-rendered data URL; only server-generated (http) previews belong in the AI panel.
  const aiPreviewUrl =
    design?.previewImageUrl && /^https?:\/\//i.test(design.previewImageUrl)
      ? design.previewImageUrl
      : null;

  const handleReady = useCallback((canvas: FabricCanvas) => {
    canvasRef.current = canvas;
  }, []);

  const handleAddText = () => {
    const canvas = canvasRef.current;

    if (!canvas || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");
    const text = new IText("Your text", {
      left: 170,
      top: 230,
      fontSize: 38,
      fontFamily: "Inter",
      fill: selectedColor,
      fontWeight: "700",
    });
    (text as NamedFabricObject).name = "design-text";
    (text as NamedFabricObject).name = "design-text";
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleUploadImage = async (file: File) => {
    const canvas = canvasRef.current;

    if (!canvas || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    try {
      const dataUrl = await fileToDataUrl(file);
      const image = await FabricImage.fromURL(dataUrl);
      image.scaleToWidth(180);
      image.set({ left: 170, top: 220 });
      (image as NamedFabricObject).name = "design-image";
      (image as NamedFabricObject).name = "design-image";
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Could not upload image.");
    }
  };

  const handleAddSticker = async (asset: StickerAsset) => {
    const canvas = canvasRef.current;

    if (!canvas || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    try {
      const image = await FabricImage.fromURL(svgToDataUrl(asset.svg));
      image.scaleToWidth(145);
      image.set({ left: 188, top: 235 });
      (image as NamedFabricObject).name = "design-sticker";
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Could not add graphic.");
    }
  };

  const handleAddSticker = async (asset: StickerAsset) => {
    const canvas = canvasRef.current;

    if (!canvas || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    try {
      const image = await FabricImage.fromURL(svgToDataUrl(asset.svg));
      image.scaleToWidth(145);
      image.set({ left: 188, top: 235 });
      (image as NamedFabricObject).name = "design-sticker";
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Could not add graphic.");
    }
  };

  const handleDelete = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    setSelectedObject(null);
    canvas.renderAll();
  };

  const handleColorChange = (color: string) => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject || locked) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");
    activeObject.set({ fill: color });
    canvas.renderAll();
    setSelectedObject(activeObject);
  };

  const buildSavePayload = () => {
  const buildSavePayload = () => {
    const canvas = canvasRef.current;

    if (!canvas || !design || locked) {
      return null;
      return null;
    }

    const safeName = designName.trim();

    if (!safeName) {
      setEditorError("Design name is required.");
      return null;
      return null;
    }

    const canvasJson = getEditableCanvasJson(canvas);
    // Client-rendered preview kept for the current session's local cache only — NOT sent to the
    // backend. previewImageUrl/printFileUrl must be real storage (MinIO) URLs; sending a large
    // base64 data URL risks exceeding the request/DB limits the design doc warns about.
    // TODO: upload this preview to MinIO (needs a presigned-upload endpoint) and pass the URL back.
    const imageUrl = canvas.toDataURL({ format: "png", quality: 0.95, multiplier: 2 });
    const layers = canvas
      .getObjects()
      .map((object, index) => objectToLayer(object, index))
      .filter((layer): layer is DesignLayer => Boolean(layer));

    return {
      safeName,
      imageUrl,
      payload: {
    return {
      safeName,
      imageUrl,
      payload: {
        name: safeName,
        canvasJson,
        layers,
      },
    };
  };

  const updateSavedDesignCache = (
    safeName: string,
    imageUrl: string,
    savedDesign?: { status?: string | null; previewImageUrl?: string | null; printFileUrl?: string | null } | null,
  ) => {
    if (!design) {
      return;
    }
    };
  };

  const updateSavedDesignCache = (
    safeName: string,
    imageUrl: string,
    savedDesign?: { status?: string | null; previewImageUrl?: string | null; printFileUrl?: string | null } | null,
  ) => {
    if (!design) {
      return;
    }

    queryClient.setQueryData<ApiResponse<DesignDetail>>(
      ["designs", design.id],
      (current) => {
        if (!current?.data) {
          return current;
        }
    queryClient.setQueryData<ApiResponse<DesignDetail>>(
      ["designs", design.id],
      (current) => {
        if (!current?.data) {
          return current;
        }

        return {
          ...current,
          data: {
            ...current.data,
            name: safeName,
            status: savedDesign?.status ?? DESIGN_STATUS.saved,
            previewImageUrl: savedDesign?.previewImageUrl ?? imageUrl,
            printFileUrl: savedDesign?.printFileUrl ?? imageUrl,
          },
        };
      },
    );
    void queryClient.invalidateQueries({ queryKey: ["designs", "my"] });
    setNameByDesignId((current) => ({ ...current, [design.id]: safeName }));
  };

  const handleSave = () => {
    const saveData = buildSavePayload();

    if (!saveData) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    saveMutation.mutate(
      saveData.payload,
      {
        onSuccess: (response) => {
          updateSavedDesignCache(saveData.safeName, saveData.imageUrl, response.data);
        return {
          ...current,
          data: {
            ...current.data,
            name: safeName,
            status: savedDesign?.status ?? DESIGN_STATUS.saved,
            previewImageUrl: savedDesign?.previewImageUrl ?? imageUrl,
            printFileUrl: savedDesign?.printFileUrl ?? imageUrl,
          },
        };
      },
    );
    void queryClient.invalidateQueries({ queryKey: ["designs", "my"] });
    setNameByDesignId((current) => ({ ...current, [design.id]: safeName }));
  };

  const handleSave = () => {
    const saveData = buildSavePayload();

    if (!saveData) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    saveMutation.mutate(
      saveData.payload,
      {
        onSuccess: (response) => {
          updateSavedDesignCache(saveData.safeName, saveData.imageUrl, response.data);
          setSaveSuccess("Design saved");
        },
      },
    );
  };

  const handleGeneratePreview = async () => {
    if (!design || locked || generatePreviewMutation.isPending || saveMutation.isPending) {
      return;
    }

    setSaveSuccess("");
    setEditorError("");

    try {
      let safeName = designName.trim();

      if (design.status !== DESIGN_STATUS.saved) {
        const saveData = buildSavePayload();

        if (!saveData) {
          return;
        }

        const saved = await saveMutation.mutateAsync(saveData.payload);
        updateSavedDesignCache(saveData.safeName, saveData.imageUrl, saved.data);
        safeName = saveData.safeName;
      }

      const response = await generatePreviewMutation.mutateAsync();
        const generated = response.data;

        if (!generated?.previewImageUrl) {
          setEditorError("AI preview was generated but no image URL was returned.");
          return;
        }

        queryClient.setQueryData<ApiResponse<DesignDetail>>(
          ["designs", design.id],
          (current) => {
            if (!current?.data) {
              return current;
            }

            return {
              ...current,
              data: {
                ...current.data,
                status: generated.status ?? current.data.status,
                previewImageUrl: generated.previewImageUrl,
              },
            };
          },
        );
        void queryClient.invalidateQueries({ queryKey: ["designs", "my"] });
        setNameByDesignId((current) => ({ ...current, [design.id]: safeName }));
        setSaveSuccess("AI preview generated");
    } catch {
      // The mutation error panels below show the backend/API message.
    }
  };

  if (!safeDesignId) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Design id is missing" description="Please return to My Designs and choose a design." />
        </Container>
      </section>
    );
  }

  if (designQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading design editor..." />
      </section>
    );
  }

  if (designQuery.isError) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Cannot load design"
            description={getDesignErrorMessage(designQuery.error)}
            onRetry={() => designQuery.refetch()}
          />
        </Container>
      </section>
    );
  }

  if (!design) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState title="Design not found" description="The design could not be loaded or you do not have access." />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link to="/designs/my" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-950">
              <ArrowLeft size={16} />
              Back to My Designs
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={getDesignStatusTone(design.status)}>{design.status}</Badge>
            </div>
            <label className="mt-4 block max-w-2xl">
              <span className="sr-only">Design name</span>
              <input
                value={designName}
                disabled={locked}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setSaveSuccess("");
                  setEditorError("");
                  setNameByDesignId((current) => ({ ...current, [design.id]: nextName }));
                }}
                className="w-full rounded-2xl border border-primary-100 bg-white px-4 py-3 font-display text-3xl font-semibold text-primary-950 outline-none transition focus:border-primary-900 disabled:bg-primary-50 disabled:text-primary-500 sm:text-4xl"
              />
            </label>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
              Saved design data is the source of truth for print files. The Try-On result stays preview-only.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={locked || generatePreviewMutation.isPending || saveMutation.isPending}
              onClick={handleGeneratePreview}
            >
              <Wand2 size={16} />
              {generatePreviewMutation.isPending || saveMutation.isPending ? "Preparing..." : "AI Preview"}
            </Button>
            <Button type="button" variant="outline" disabled={design.status !== DESIGN_STATUS.saved} onClick={() => navigate(`/tryon/${design.id}`)}>
              <Sparkles size={16} />
              Try-On
            </Button>
            <Button type="button" disabled={design.status !== DESIGN_STATUS.saved} onClick={() => navigate(`/checkout/${design.id}`)}>
              <ShoppingBag size={16} />
              Checkout
            </Button>
          </div>
        </div>

        {locked && (
          <div className="mb-6 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            This design is locked.
          </div>
        )}
        {saveSuccess && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-success-500/20 bg-success-50 px-4 py-3 text-sm text-success-700 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 size={16} />
              {saveSuccess}
            </span>
            <button
              type="button"
              onClick={() => navigate("/designs/my")}
              className="text-left text-sm font-semibold underline underline-offset-4 sm:text-right"
            >
              Go to My Designs
            </button>
          </div>
        )}
        {editorError && (
          <div className="mb-6 rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm text-error-700">
            {editorError}
          </div>
        )}
        {saveMutation.isError && (
          <div className="mb-6 rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm text-error-700">
            {getDesignErrorMessage(saveMutation.error)}
          </div>
        )}
        {generatePreviewMutation.isError && (
          <div className="mb-6 rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm text-error-700">
            {getDesignErrorMessage(generatePreviewMutation.error)}
          </div>
        )}
        {generatePreviewMutation.isPending && (
          <div className="mb-6 rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-500">
            Generating AI preview... This can take up to a minute.
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <EditorToolbar
            locked={locked}
            selectedColor={selectedColor}
            saving={saveMutation.isPending}
            stickerAssets={STICKER_ASSETS}
            stickerAssets={STICKER_ASSETS}
            onAddText={handleAddText}
            onAddSticker={handleAddSticker}
            onAddSticker={handleAddSticker}
            onUploadImage={handleUploadImage}
            onDelete={handleDelete}
            onColorChange={handleColorChange}
            onSave={handleSave}
          />
          <div>
            <div className="mb-3 flex justify-end rounded-full bg-white p-1 shadow-soft">
              {(["front", "back"] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setShirtView(view)}
                  className={[
                    "rounded-full px-5 py-2 text-sm font-semibold capitalize transition",
                    shirtView === view
                      ? "bg-primary-900 text-white"
                      : "text-primary-500 hover:bg-primary-50 hover:text-primary-950",
                  ].join(" ")}
                >
                  {view}
                </button>
              ))}
            </div>
            <TShirtCanvas
              canvasJson={asCanvasJson(design.canvasJson)}
              layers={design.layers}
              locked={locked}
              shirtView={shirtView}
              productName={product?.name ?? design.name}
              onReady={handleReady}
              onSelectionChange={setSelectedObject}
            />
          </div>
        </div>

        {aiPreviewUrl && (
          <div className="mt-8 rounded-3xl border border-primary-100 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wand2 size={18} className="text-primary-500" />
              <h2 className="font-display text-xl font-semibold text-primary-950">AI Generated Preview</h2>
            </div>
            <DesignPreview imageUrl={aiPreviewUrl} name={design.name} className="mx-auto max-w-xl" />
          </div>
        )}
      </Container>
    </section>
  );
}
