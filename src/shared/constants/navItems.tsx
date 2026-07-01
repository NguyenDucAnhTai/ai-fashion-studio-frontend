import type { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    dropdown: [
      {
        title: "Product Catalog",
        description: "Browse active T-shirts and choose a variant before designing.",
        href: "/products",
        imageBg: "bg-beige-200",
      },
      {
        title: "Design Draft Flow",
        description: "Select a product and start a saved design from the detail page.",
        href: "/products",
        imageBg: "bg-accent-100",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about-us",
    dropdown: [
      {
        title: "Platform Story",
        description: "Understand how catalog, design, try-on, order, and payment connect.",
        href: "/about-us",
        imageBg: "bg-primary-100",
      },
      {
        title: "Published Content",
        description: "Read public About sections served by the content service.",
        href: "/about-us",
        imageBg: "bg-beige-300",
      },
    ],
  },
  {
    label: "Feedback",
    href: "/feedbacks",
    dropdown: [
      {
        title: "Public Reviews",
        description: "See customer feedback that has been approved for public browsing.",
        href: "/feedbacks",
        imageBg: "bg-accent-100",
      },
      {
        title: "Trust Signals",
        description: "Ratings and comments from completed orders after moderation.",
        href: "/feedbacks",
        imageBg: "bg-success-50",
      },
    ],
  },
  {
    label: "Try-On Studio",
    href: "/products",
    dropdown: [
      {
        title: "Start From Product",
        description: "The MVP design and try-on journey starts from a selected T-shirt.",
        href: "/products",
        imageBg: "bg-primary-800",
      },
      {
        title: "Saved Design Rule",
        description: "Try-On is available after the customer saves a design.",
        href: "/products",
        imageBg: "bg-beige-200",
      },
    ],
  },
];
