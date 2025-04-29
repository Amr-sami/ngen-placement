import { LevelCardProps } from '@/components/pages/SingleTrackPage/types';

export type Track = {
  meta_title?: string;
  meta_desc?: string;
  meta_keywords?: string[];
  name: string;
  slug: string;
  description: string;
  main_icon: string;
  certificate_image: string;
  rating: number;
  courses_number: number;
  assessments_number: number;
  price: number;
  levels_ids: string[];
  levels: LevelCardProps[];
  image: string;
  status: string;
  discountValue: string;
  numberOfLevels: string;
  skillLevel: string;
  duration: string;
};

export type Level = {
  name: string;
  slug: string;
  description: string;
  main_icon: string;
  certificate_image: string;
  rating: number;
  course_lectures: { name: string; description: string; duration: number }[];
  assessments_number: number;
  lectures_number: number;
  duration: number;
  age_group: string;
  price: number;
  cohorts: {
    title: string;
    date: string;
    age_group: string;
    duration: number;
  }[];
  instructors: { name: string; title: string; rating: number }[];
};
