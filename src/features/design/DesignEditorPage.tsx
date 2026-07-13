import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, ShoppingBag, Sparkles } from "lucide-react";
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
import EditorToolbar from "./EditorToolbar";
import TShirtCanvas from "./TShirtCanvas";
import { getDesignErrorMessage, useDesignDetailQuery, useSaveDesignMutation } from "./api";
import type { DesignDetail, DesignLayer } from "./types";

type NamedFabricObject = FabricObject & { name?: string };

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

function objectToLayer(object: FabricObject, index: number): DesignLayer | null {
  if ((object as NamedFabricObject).name === "shirt-area") {
    return null;
  }

  const objectType = object.type?.toUpperCase() ?? "SHAPE";
  const isText = object.type === "i-text" || object.type === "textbox" || object.type === "text";
  const imageSource = object instanceof FabricImage ? object.getSrc() : null;

  return {
    layerType: isText ? "TEXT" : imageSource ? "IMAGE" : objectType,
    content: isText ? String((object as IText).text ?? "") : null,
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
      return (object as NamedFabricObject).name !== "shirt-area" && Boolean(json);
    })
    .map(({ json }) => json);

  return {
    ...canvasJson,
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
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [nameByDesignId, setNameByDesignId] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState("");
  const [editorError, setEditorError] = useState("");
  const selectedColor = useMemo(() => {
    return typeof selectedObject?.fill === "string" ? selectedObject.fill : "#0a0a0a";
  }, [selectedObject]);
  const design = designQuery.data?.data;
  const locked = design?.status === DESIGN_STATUS.locked;
  const designName = design ? nameByDesignId[design.id] ?? design.name : "";

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
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    } catch (error) {
      setEditorError(error instanceof Error ? error.message : "Could not upload image.");
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

  const handleSave = () => {
    const canvas = canvasRef.current;

    if (!canvas || !design || locked) {
      return;
    }

    const safeName = designName.trim();

    if (!safeName) {
      setEditorError("Design name is required.");
      return;
    }

    setSaveSuccess("");
    setEditorError("");
    const canvasJson = getEditableCanvasJson(canvas);
    const imageUrl = canvas.toDataURL({ format: "png", quality: 0.95, multiplier: 2 });
    const layers = canvas
      .getObjects()
      .map((object, index) => objectToLayer(object, index))
      .filter((layer): layer is DesignLayer => Boolean(layer));

    saveMutation.mutate(
      {
        name: safeName,
        canvasJson,
        previewImageUrl: imageUrl,
        // TODO: Replace preview data URL with uploaded CDN URL when upload service is ready.
        printFileUrl: imageUrl,
        layers,
      },
      {
        onSuccess: (response) => {
          const savedDesign = response.data;

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
          setSaveSuccess("Design saved");
        },
      },
    );
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

          <div className="flex gap-3">
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

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <EditorToolbar
            locked={locked}
            selectedColor={selectedColor}
            saving={saveMutation.isPending}
            onAddText={handleAddText}
            onUploadImage={handleUploadImage}
            onDelete={handleDelete}
            onColorChange={handleColorChange}
            onSave={handleSave}
          />
          <TShirtCanvas
            canvasJson={asCanvasJson(design.canvasJson)}
            locked={locked}
            onReady={handleReady}
            onSelectionChange={setSelectedObject}
          />
        </div>
      </Container>
    </section>
  );
}
