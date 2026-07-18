import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../../shared/components/Container";
import Hero3DPreview from "./Hero3DPreview";
import HeroCustomizerControls from "./HeroCustomizerControls";
import {
  COLOR_OPTIONS,
  FABRIC_OPTIONS,
  FIT_OPTIONS,
  type FabricOption,
  type FitOption,
} from "../types/heroTypes";

export default function HeroSection() {
  const [color, setColor] = useState<string>(COLOR_OPTIONS[0].hex);
  const [fabricId, setFabricId] = useState<FabricOption>("cotton");
  const [fitId, setFitId] = useState<FitOption>("regular");

  const fabric = useMemo(
    () => FABRIC_OPTIONS.find((option) => option.id === fabricId) ?? FABRIC_OPTIONS[0],
    [fabricId],
  );

  const fit = useMemo(
    () => FIT_OPTIONS.find((option) => option.id === fitId) ?? FIT_OPTIONS[1],
    [fitId],
  );

  return (
    <section className="relative overflow-hidden bg-[#faf8f4] pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #C8C0B4 1px, transparent 0)",
          backgroundSize: "42px 42px",
        }}
      />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-primary-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            Create Your Fit.
            <br />
            <span className="italic text-accent-500">Wear Your Identity.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-primary-600 lg:text-lg">
            Customize clothing components, rotate your design in 3D, and preview
            your personalized fashion piece before checkout.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-900 px-8 py-3.5 text-base font-medium tracking-wide text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
            >
              Start Creating
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-full border border-primary-900 bg-transparent px-8 py-3.5 text-base font-medium tracking-wide text-primary-900 transition-all duration-200 hover:bg-primary-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      </Container>

      <div className="relative mx-auto mt-12 w-full max-w-5xl px-4 sm:px-6 lg:px-0">
        <Hero3DPreview color={color} fabric={fabric} fit={fit} />

        <HeroCustomizerControls
          color={color}
          fabric={fabricId}
          fit={fitId}
          onColorChange={setColor}
          onFabricChange={setFabricId}
          onFitChange={setFitId}
        />
      </div>
    </section>
  );
}
