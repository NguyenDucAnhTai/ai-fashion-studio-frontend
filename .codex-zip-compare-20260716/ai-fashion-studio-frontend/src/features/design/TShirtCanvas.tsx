import { useEffect, useMemo, useRef } from "react";
import { Canvas as FabricCanvas, FabricImage, IText, type FabricObject } from "fabric";
import type { DesignLayer } from "./types";

type NamedFabricObject = FabricObject & { name?: string };

interface TShirtCanvasProps {
  canvasJson?: Record<string, unknown> | null;
  layers?: DesignLayer[];
  locked: boolean;
  shirtView: "front" | "back";
  productName?: string;
  onReady: (canvas: FabricCanvas) => void;
  onSelectionChange: (object: FabricObject | null) => void;
}

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 620;
const EDITABLE_OBJECT_CONFIG = {
  borderColor: "#0a0a0a",
  cornerColor: "#0a0a0a",
  cornerSize: 10,
  transparentCorners: false,
};

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function fallbackShirtSvg(productName = "AI Fashion Studio", shirtView: "front" | "back") {
  const safeName = productName.replace(/[<>&"]/g, "");
  const isBack = shirtView === "back";

  return `
    <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shirtFill" x1="120" y1="60" x2="400" y2="560" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.55" stop-color="#f7f7f5"/>
          <stop offset="1" stop-color="#ecebe7"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-15%" width="140%" height="135%">
          <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#111111" flood-opacity="0.16"/>
        </filter>
      </defs>
      <rect width="520" height="620" fill="#fdfcfa"/>
      <path
        d="M177 79 C201 65 222 58 246 58 L274 58 C298 58 319 65 343 79 L437 133 C450 141 456 157 450 171 L413 257 C408 269 394 274 383 268 L350 251 L350 518 C350 537 335 552 316 552 L204 552 C185 552 170 537 170 518 L170 251 L137 268 C126 274 112 269 107 257 L70 171 C64 157 70 141 83 133 Z"
        fill="url(#shirtFill)"
        stroke="#dad8d2"
        stroke-width="2.5"
        filter="url(#softShadow)"
      />
      ${
        isBack
          ? `<path d="M215 72 C225 88 238 97 260 97 C282 97 295 88 305 72" fill="none" stroke="#d2d0ca" stroke-width="8" stroke-linecap="round"/>
             <path d="M195 135 C234 154 286 154 325 135" fill="none" stroke="#e0ded8" stroke-width="4" stroke-linecap="round"/>`
          : `<path d="M219 67 C225 91 239 105 260 105 C281 105 295 91 301 67" fill="none" stroke="#d2d0ca" stroke-width="13" stroke-linecap="round"/>`
      }
      <path d="${isBack ? "M186 178 L334 178 L334 378 L186 378 Z" : "M181 252 L339 252 L339 432 L181 432 Z"}" fill="none" stroke="#cbc8c1" stroke-width="2" stroke-dasharray="10 9" opacity="0.75"/>
      <text x="260" y="590" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" fill="#8c877f">${safeName} · ${isBack ? "Back" : "Front"}</text>
    </svg>
  `;
}

function hasCanvasObjects(canvasJson?: Record<string, unknown> | null) {
  return Array.isArray(canvasJson?.objects) && canvasJson.objects.length > 0;
}

function isBaseObject(object: FabricObject) {
  return (object as NamedFabricObject).name === "shirt-model";
}

function fitObject(object: FabricObject, maxWidth: number, maxHeight: number) {
  const width = object.width || maxWidth;
  const height = object.height || maxHeight;
  const scale = Math.min(maxWidth / width, maxHeight / height);

  object.set({
    scaleX: scale,
    scaleY: scale,
  });
}

function configureEditableObject(object: FabricObject, locked: boolean) {
  object.set({
    ...EDITABLE_OBJECT_CONFIG,
    selectable: !locked,
    evented: !locked,
  });
}

async function objectFromLayer(layer: DesignLayer) {
  const left = layer.positionX || 170;
  const top = layer.positionY || 220;
  const angle = layer.rotation || 0;

  if (layer.layerType === "TEXT") {
    const text = new IText(layer.content || "Your text", {
      left,
      top,
      angle,
      fontSize: Math.max(18, Math.min(layer.height || 42, 72)),
      fontFamily: "Inter",
      fontWeight: "700",
      fill: layer.color || "#0a0a0a",
    });
    (text as NamedFabricObject).name = "design-text";
    return text;
  }

  const source = layer.imageUrl || layer.content;
  if (!source) {
    return null;
  }

  const image = await FabricImage.fromURL(source);
  fitObject(image, Math.max(layer.width || 150, 24), Math.max(layer.height || 150, 24));
  image.set({
    left,
    top,
    angle,
  });
  (image as NamedFabricObject).name = layer.layerType === "ICON" ? "design-sticker" : "design-image";
  return image;
}

export default function TShirtCanvas({
  canvasJson,
  layers = [],
  locked,
  shirtView,
  productName,
  onReady,
  onSelectionChange,
}: TShirtCanvasProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const layerKey = useMemo(() => JSON.stringify(layers), [layers]);
  const shirtBackgroundUrl = useMemo(
    () => svgToDataUrl(fallbackShirtSvg(productName, shirtView)),
    [productName, shirtView],
  );

  useEffect(() => {
    if (!canvasElementRef.current || canvasRef.current) {
      return;
    }

    const canvas = new FabricCanvas(canvasElementRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: !locked,
    });

    canvas.on("selection:created", (event) => onSelectionChange(event.selected?.[0] ?? null));
    canvas.on("selection:updated", (event) => onSelectionChange(event.selected?.[0] ?? null));
    canvas.on("selection:cleared", () => onSelectionChange(null));
    canvasRef.current = canvas;
    onReady(canvas);

    return () => {
      canvas.dispose();
      canvasRef.current = null;
    };
  }, [locked, onReady, onSelectionChange]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    let cancelled = false;

    async function loadCanvas() {
      const editableObjects: FabricObject[] = [];
      const savedCanvasJson = canvasJson;

      if (canvas && savedCanvasJson && hasCanvasObjects(savedCanvasJson)) {
        await canvas.loadFromJSON(savedCanvasJson);
        editableObjects.push(...canvas.getObjects().filter((object) => !isBaseObject(object)));
      } else {
        for (const layer of layers) {
          const object = await objectFromLayer(layer);
          if (object) {
            editableObjects.push(object);
          }
        }
      }

      if (cancelled || !canvas) {
        return;
      }

      canvas.clear();
      canvas.backgroundColor = "transparent";
      editableObjects.forEach((object) => {
        configureEditableObject(object, locked);
        canvas.add(object);
      });
      canvas.selection = !locked;
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    void loadCanvas();

    return () => {
      cancelled = true;
    };
  }, [canvasJson, layerKey, locked, productName, shirtView]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.selection = !locked;
    canvas.getObjects().forEach((object) => {
      if (isBaseObject(object)) {
        object.set({ selectable: false, evented: false });
      } else {
        configureEditableObject(object, locked);
      }
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  }, [locked]);

  return (
    <div className="flex min-h-[690px] items-start justify-center rounded-3xl border border-primary-100 bg-white p-4 shadow-soft">
      <div className="overflow-auto rounded-2xl bg-beige-50 p-4">
        <div className="relative h-[620px] w-[520px] max-w-full">
          <img
            src={shirtBackgroundUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            draggable={false}
          />
          <canvas ref={canvasElementRef} className="relative z-10 mx-auto block max-w-full" />
        </div>
      </div>
    </div>
  );
}
