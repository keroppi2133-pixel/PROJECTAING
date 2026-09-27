export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  image: string;
  caption: string;
  story: string;
  tags?: string[];
}

export interface SurpriseConfig {
  gfName: string;
  secretCode: string;
  finalName: string;
  anniversaryDate: string; // YYYY-MM-DD
  letterTitle: string;
  letterGreeting: string;
  letterBody: string[];
  letterClosing: string;
  questionText: string;
  hintText: string;
}
