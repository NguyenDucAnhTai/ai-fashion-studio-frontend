export interface NavDropdownItem {
  title: string;
  description: string;
  href: string;
  imageBg: string;
}

export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

export type BadgeTone = "neutral" | "success" | "warning" | "error" | "accent";

export interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  imageBg: string;
  tag?: string;
}
