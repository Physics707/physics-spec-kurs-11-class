export interface LearningObjective {
  code: string;
  text: string;
}

export interface Problem {
  title: string;
  statement: string;
  given?: string[];
  solution: SolutionStep[];
  answer: string;
}

export interface SolutionStep {
  label?: string;
  text: string;
  formula?: string;
}

export interface LessonContent {
  theory: TheoryBlock[];
  problems: Problem[];
}

export interface TheoryBlock {
  heading: string;
  paragraphs: string[];
  formulas?: string[];
  svgKey?: string;
}

export interface Topic {
  id: string;
  title: string;
  objectives: LearningObjective[];
  lessonContent: LessonContent;
}

export interface Section {
  id: string;
  title: string;
  topics: Topic[];
}
