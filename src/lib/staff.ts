export type StaffRole = "Makeup Artist" | "Photographer";

export type Staff = {
  id: string;
  slug: string;
  name: string;
  role: StaffRole;
  /** Signature color used as the event tint on the calendar */
  color: string;
  /** Two-stop gradient for avatar circles (hero/cards) */
  gradient: [string, string];
  initials: string;
  tagline: string;
};

export const STAFF: Staff[] = [
  {
    id: "emily",
    slug: "emily",
    name: "Emily",
    role: "Makeup Artist",
    color: "#c8847a",
    gradient: ["#e8b3a8", "#a85a4f"],
    initials: "EM",
    tagline: "Soft glam, weddings, editorial",
  },
  {
    id: "scarlett",
    slug: "scarlett",
    name: "Scarlett",
    role: "Makeup Artist",
    color: "#c95a3a",
    gradient: ["#e8826a", "#a8421f"],
    initials: "SC",
    tagline: "Bold colour & runway looks",
  },
  {
    id: "bella",
    slug: "bella",
    name: "Bella",
    role: "Makeup Artist",
    color: "#d99aa3",
    gradient: ["#f0c2c8", "#b8727c"],
    initials: "BE",
    tagline: "Bridal, dewy & natural finish",
  },
  {
    id: "thetis",
    slug: "thetis",
    name: "Thetis",
    role: "Makeup Artist",
    color: "#7a9b87",
    gradient: ["#a8c4b3", "#566f5e"],
    initials: "TH",
    tagline: "Avant-garde & SFX",
  },
  {
    id: "jay",
    slug: "jay",
    name: "Jay",
    role: "Photographer",
    color: "#3f3f46",
    gradient: ["#71717a", "#18181b"],
    initials: "JA",
    tagline: "Studio, fashion & portrait",
  },
];

export function getStaffBySlug(slug: string): Staff | undefined {
  return STAFF.find((s) => s.slug === slug);
}

export function getStaffById(id: string): Staff | undefined {
  return STAFF.find((s) => s.id === id);
}
