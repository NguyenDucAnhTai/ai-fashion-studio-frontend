import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Rect, type FabricObject } from "fabric";

type NamedFabricObject = FabricObject & { name?: string };

interface TShirtCanvasProps {
  canvasJson?: Record<string, unknown> | null;
  locked: boolean;
  onReady: (canvas: FabricCanvas) => void;
  onSelectionChange: (object: FabricObject | null) => void;
}

export default function TShirtCanvas({ canvasJson, locked, onReady, onSelectionChange }: TShirtCanvasProps) {
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasElementRef.current || canvasRef.current) {
      return;
    }

    const canvas = new FabricCanvas(canvasElementRef.current, {
      width: 520,
      height: 620,
      backgroundColor: "#fdfcfa",
      preserveObjectStacking: true,
      selection: !locked,
    });

    const shirtArea = new Rect({
      left: 110,
      top: 90,
      width: 300,
      height: 430,
      rx: 36,
      ry: 36,
      fill: "#ffffff",
      stroke: "#d8d8d8",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    (shirtArea as NamedFabricObject).name = "shirt-area";

    canvas.add(shirtArea);
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

    if (!canvas || !canvasJson || Object.keys(canvasJson).length === 0) {
      return;
    }

    canvas.loadFromJSON(canvasJson).then(() => {
      canvas.getObjects().forEach((object) => {
        const isBase = (object as NamedFabricObject).name === "shirt-area";
        object.set({
          selectable: !locked && !isBase,
          evented: !locked && !isBase,
        });
      });
      canvas.selection = !locked;
      canvas.renderAll();
    });
  }, [canvasJson, locked]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.selection = !locked;
    canvas.getObjects().forEach((object) => {
      const isBase = (object as NamedFabricObject).name === "shirt-area";
      object.set({ selectable: !locked && !isBase, evented: !locked && !isBase });
    });
    canvas.discardActiveObject();
    canvas.renderAll();
  }, [locked]);

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-4 shadow-soft">
      <div className="overflow-auto rounded-2xl bg-beige-50 p-4">
        <canvas ref={canvasElementRef} className="mx-auto block max-w-full" />
      </div>
    </div>
  );
}
