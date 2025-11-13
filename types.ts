
export interface RoadmapNode {
  name: string;
  description: string;
  resources?: string[];
  salaryExpectations?: string;
  careerProgression?: string;
  children?: RoadmapNode[];
}

export interface GroundedInfo {
  text: string;
  sources: { web: { uri: string; title: string } }[];
}