import { Geist, Geist_Mono, Marck_Script, Martian_Mono, Noto_Serif_Display, Ysabeau_Office } from "next/font/google";

// Every family ships Cyrillic: the Russian site must not fall back to system fonts.
const serifDisplay = Noto_Serif_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-serif-display",
  display: "swap",
});

const ysabeau = Ysabeau_Office({
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-ysabeau",
  display: "swap",
});

const martian = Martian_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["wdth"],
  variable: "--font-martian",
  display: "swap",
});

const marck = Marck_Script({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  variable: "--font-marck",
  display: "swap",
});

export const fontVariables = [serifDisplay.variable, ysabeau.variable, martian.variable, marck.variable].join(" ");

// The admin is a working tool: a neutral grotesk reads better in forms, tables and numbers than the editorial faces.
const geist = Geist({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const adminFontVariables = [geist.variable, geistMono.variable].join(" ");
