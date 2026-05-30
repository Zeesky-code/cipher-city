export interface Stop {
  name: string;
  where: string;
  lat: number;
  lng: number;
  narr: string;
  /** May contain inline HTML (<b> tags). Render with dangerouslySetInnerHTML. */
  fact: string;
  label: string;
  text: string;
  prompt: string;
  answer: string;
  hint: string;
  frag: string;
  key: string;
  final?: boolean;
  /** Stylised [x, y] position on the SVG map canvas (viewBox 620×470). */
  mapXY: [number, number];
}

export interface HuntIntro {
  kicker: string;
  heading: string;
  body: string[];
  ctaLabel: string;
}

export interface HuntFinale {
  kicker: string;
  heading: string;
  body: string[];
}

export interface Hunt {
  id: string;
  title: string;
  subtitle: string;
  mapTitle: string;
  mapSub: string;
  intro: HuntIntro;
  finale: HuntFinale;
  footer: string;
  stops: Stop[];
}
