import { Shirt } from "lucide-react";

interface DesignPreviewProps {
  imageUrl?: string | null;
  name: string;
  className?: string;
}

export default function DesignPreview({ imageUrl, name, className = "" }: DesignPreviewProps) {
  return (
    <div className={["relative flex min-h-56 items-center justify-center overflow-hidden rounded-3xl bg-beige-50", className].join(" ")}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center text-primary-300">
          <Shirt size={54} strokeWidth={1.5} />
          <p className="mt-3 text-sm font-medium">No preview yet</p>
        </div>
      )}
    </div>
  );
}
