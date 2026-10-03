export type JourneyStore = {
  rawProgress: number;
  progress: number;
  previousProgress: number;
  velocity: number;
  scrollY: number;
  sectionTop: number;
  sectionHeight: number;
  travel: number;
  direction: 1 | -1;
  rafActive: boolean;
  canvasReady: boolean;
  stage: string;
};

export const journeyStore: JourneyStore = {
  rawProgress: 0,
  progress: 0,
  previousProgress: 0,
  velocity: 0,
  scrollY: 0,
  sectionTop: 0,
  sectionHeight: 0,
  travel: 1,
  direction: 1,
  rafActive: false,
  canvasReady: false,
  stage: "CAMPUS"
};

export function getJourneyStage(progress: number): string {
  if (progress < 0.18) return "CAMPUS";
  if (progress < 0.38) return "WAREHOUSE";
  if (progress < 0.56) return "NETWORK";
  if (progress < 0.74) return "HUB";
  if (progress < 0.9) return "FREIGHT";
  return "HANDOFF";
}
