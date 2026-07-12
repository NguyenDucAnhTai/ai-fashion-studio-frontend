import CTASection from "./components/CTASection";
import FeaturedProducts from "./components/FeaturedProducts";
import FeedbackPreview from "./components/FeedbackPreview";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import StyleDiscoverySection from "./components/StyleDiscoverySection";
import TryOnIntro from "./components/TryOnIntro";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <StyleDiscoverySection />
      <HowItWorks />
      <TryOnIntro />
      <FeedbackPreview />
      <CTASection />
      <Footer />
    </>
  );
}
