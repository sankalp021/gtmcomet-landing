import localFont from "next/font/local";

/*
 * Anek Latin by Ek Type (OFL 1.1, see ./fonts/OFL.txt).
 * One variable file per unicode range, both on the weight and width axes.
 * The width axis carries the page's hierarchy: expanded for headlines,
 * normal for reading, condensed for data.
 */
export const anek = localFont({
  src: "./fonts/anek-latin-latin.woff2",
  variable: "--font-anek",
  weight: "100 800",
  display: "swap",
  declarations: [
    { prop: "font-stretch", value: "75% 125%" },
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

/*
 * Holds the rupee sign (U+20B9). Only fetched on pages that show one.
 * It comes first in the font stack and has no metric fallback of its own, so
 * its unicode-range passes every ordinary character through to `anek`.
 */
export const anekExt = localFont({
  src: "./fonts/anek-latin-latin-ext.woff2",
  variable: "--font-anek-ext",
  weight: "100 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "font-stretch", value: "75% 125%" },
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
    },
  ],
});
