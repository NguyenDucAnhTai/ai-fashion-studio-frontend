import { ImagePlus, Save, Trash2, Type } from "lucide-react";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";

interface EditorToolbarProps {
  locked: boolean;
  selectedColor: string;
  saving: boolean;
  onAddText: () => void;
  onUploadImage: (file: File) => void;
  onDelete: () => void;
  onColorChange: (color: string) => void;
  onSave: () => void;
}

export default function EditorToolbar({
  locked,
  selectedColor,
  saving,
  onAddText,
  onUploadImage,
  onDelete,
  onColorChange,
  onSave,
}: EditorToolbarProps) {
  return (
    <aside className="rounded-3xl border border-primary-100 bg-white p-5 shadow-soft">
      <h2 className="text-sm font-semibold text-primary-950">Tools</h2>
      <p className="mt-2 text-xs leading-5 text-primary-500">Text, image, move, resize, rotate, delete, and save are enough for MVP.</p>

      <div className="mt-5 space-y-3">
        <Button type="button" className="w-full" variant="outline" disabled={locked} onClick={onAddText}>
          <Type size={16} />
          Add text
        </Button>
        <label
          className={[
            "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-primary-900 px-6 py-2.5 text-sm font-medium tracking-wide text-primary-900 transition hover:bg-primary-900 hover:text-white",
            locked ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
        >
          <ImagePlus size={16} />
          Upload image
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={locked}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onUploadImage(file);
                event.target.value = "";
              }
            }}
          />
        </label>
        <Button type="button" className="w-full" variant="ghost" disabled={locked} onClick={onDelete}>
          <Trash2 size={16} />
          Delete selected
        </Button>
      </div>

      <div className="mt-6 border-t border-primary-100 pt-5">
        <Input
          label="Selected text color"
          type="color"
          value={selectedColor}
          disabled={locked}
          onChange={(event) => onColorChange(event.target.value)}
          className="h-12 p-1"
        />
      </div>

      <Button type="button" size="lg" className="mt-6 w-full" disabled={locked} loading={saving} onClick={onSave}>
        <Save size={16} />
        Save design
      </Button>
    </aside>
  );
}
