import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Canvas as FabricCanvas, FabricImage, IText, type FabricObject } from "fabric";
import { getApiErrorMessage } from "../../shared/api/httpClient";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Loading from "../../shared/components/Loading";
import { DESIGN_STATUS, getDesignStatusTone } from "../../shared/constants/designStatus";
import EditorToolbar from "./EditorToolbar";
import TShirtCanvas from "./TShirtCanvas";
import { useDesignDetailQuery, useSaveDesignMutation } from "./api";
import type { DesignLayer } from "./types";

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
  const imageSource = "getSrc" in object && typeof object.getSrc === "function" ? object.getSrc() : null;

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

export default function DesignEditorPage() {
  const { designId = "" } = useParams();
  const navigate = useNavigate();
  const designQuery = useDesignDetailQuery(designId);
  const saveMutation = useSaveDesignMutation(designId);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const selectedColor = useMemo(() => {
    return typeof selectedObject?.fill === "string" ? selectedObject.fill : "#0a0a0a";
  }, [selectedObject]);
  const design = designQuery.data?.data;
  const locked = design?.status === DESIGN_STATUS.locked;

  const handleReady = useCallback((canvas: FabricCanvas) => {
    canvasRef.current = canvas;
  }, []);

  const handleAddText = () => {
    const canvas = canvasRef.current;

    if (!canvas || locked) {
      return;
    }

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

    const dataUrl = await fileToDataUrl(file);
    const image = await FabricImage.fromURL(dataUrl);
    image.scaleToWidth(180);
    image.set({ left: 170, top: 220 });
    canvas.add(image);
    canvas.setActiveObject(image);
    canvas.renderAll();
  };

  const handleDelete = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject || locked) {
      return;
    }

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

    activeObject.set({ fill: color });
    canvas.renderAll();
    setSelectedObject(activeObject);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;

    if (!canvas || !design || locked) {
      return;
    }

    const canvasJson = canvas.toJSON(["name", "src"]) as Record<string, unknown>;
    const imageUrl = canvas.toDataURL({ format: "png", quality: 0.95, multiplier: 2 });
    const layers = canvas
      .getObjects()
      .map((object, index) => objectToLayer(object, index))
      .filter((layer): layer is DesignLayer => Boolean(layer));

    saveMutation.mutate(
      {
        name: design.name,
        canvasJson,
        previewImageUrl: imageUrl,
        printFileUrl: imageUrl,
        layers,
      },
      {
        onSuccess: () => navigate("/designs/my"),
      },
    );
  };

  if (designQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Loading design editor..." />
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
              Back to designs
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl font-semibold text-primary-950">{design.name}</h1>
              <Badge tone={getDesignStatusTone(design.status)}>{design.status}</Badge>
            </div>
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
            This design is locked after payment. Editing and saving are disabled.
          </div>
        )}
        {saveMutation.isError && (
          <div className="mb-6 rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm text-error-700">
            {getApiErrorMessage(saveMutation.error)}
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
            canvasJson={design.canvasJson}
            locked={locked}
            onReady={handleReady}
            onSelectionChange={setSelectedObject}
          />
        </div>
      </Container>
    </section>
  );
}
