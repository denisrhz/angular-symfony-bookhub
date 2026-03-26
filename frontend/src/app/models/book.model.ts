import { Author } from './author.model';

export interface Book {
  id?: number;
  title: string;
  description: string;
  authors: Author[];
  authorIds?: number[];
}