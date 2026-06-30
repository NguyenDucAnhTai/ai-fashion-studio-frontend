import type { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "For Individuals",
    href: "/individuals",
    dropdown: [
      {
        title: "Personal Stylist",
        description:
          "Get curated outfit recommendations from your AI fashion coach.",
        href: "/individuals/stylist",
        imageBg: "bg-beige-200",
      },
      {
        title: "2D Fit Preview",
        description:
          "See exactly how clothes will look on your body before buying.",
        href: "/individuals/fit-preview",
        imageBg: "bg-accent-100",
      },
      {
        title: "Size Guide",
        description:
          "AI-powered size recommendations based on your measurements.",
        href: "/individuals/size-guide",
        imageBg: "bg-primary-100",
      },
      {
        title: "Style Quiz",
        description: "Discover your personal aesthetic through our style quiz.",
        href: "/individuals/style-quiz",
        imageBg: "bg-beige-300",
      },
    ],
  },
  {
    label: "For Business",
    href: "/business",
    dropdown: [
      {
        title: "Business Uniforms",
        description: "Custom-branded uniforms designed for your entire team.",
        href: "/business/uniforms",
        imageBg: "bg-primary-100",
      },
      {
        title: "Bulk Orders",
        description: "Streamlined ordering with volume discounts and tracking.",
        href: "/business/bulk-orders",
        imageBg: "bg-beige-200",
      },
      {
        title: "Custom Branding",
        description: "Add your logo and brand colors to any garment.",
        href: "/business/branding",
        imageBg: "bg-accent-100",
      },
      {
        title: "Team Outfitting",
        description:
          "Manage sizes, preferences and orders for your whole team.",
        href: "/business/team",
        imageBg: "bg-beige-300",
      },
    ],
  },
  {
    label: "Try-On Studio",
    href: "/studio",
    dropdown: [
      {
        title: "AI Fashion Coach",
        description:
          "Chat with your personal AI stylist for expert fashion guidance.",
        href: "/studio/coach",
        imageBg: "bg-accent-100",
      },
      {
        title: "Outfit Builder",
        description:
          "Mix and match pieces to create complete outfit combinations.",
        href: "/studio/builder",
        imageBg: "bg-beige-200",
      },
      {
        title: "Fabric Selector",
        description: "Browse material swatches and feel the texture virtually.",
        href: "/studio/fabrics",
        imageBg: "bg-primary-100",
      },
      {
        title: "Saved Designs",
        description: "Access and refine your previously saved outfit designs.",
        href: "/studio/saved",
        imageBg: "bg-beige-300",
      },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    dropdown: [
      {
        title: "Streetwear",
        description: "Bold, contemporary pieces inspired by urban culture.",
        href: "/collections/streetwear",
        imageBg: "bg-primary-800",
      },
      {
        title: "Campus Collection",
        description: "Casual, versatile styles for everyday campus life.",
        href: "/collections/campus",
        imageBg: "bg-beige-200",
      },
      {
        title: "Business Formal",
        description: "Sharp, tailored looks for the professional environment.",
        href: "/collections/business",
        imageBg: "bg-primary-100",
      },
      {
        title: "Occasion Wear",
        description:
          "Statement pieces for events, celebrations, and ceremonies.",
        href: "/collections/occasion",
        imageBg: "bg-accent-100",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    dropdown: [
      {
        title: "Our Story",
        description:
          "How Fitwear Studio is changing the way people shop fashion.",
        href: "/about/story",
        imageBg: "bg-beige-200",
      },
      {
        title: "Sustainability",
        description: "Our commitment to ethical and eco-conscious fashion.",
        href: "/about/sustainability",
        imageBg: "bg-success-50",
      },
      {
        title: "Careers",
        description: "Join our team and help shape the future of fashion tech.",
        href: "/about/careers",
        imageBg: "bg-beige-300",
      },
      {
        title: "Press",
        description: "News, media coverage, and brand resources.",
        href: "/about/press",
        imageBg: "bg-accent-100",
      },
    ],
  },
];
