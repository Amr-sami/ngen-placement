import { Url } from 'url';

export type NgenForCardType = {
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
  href: string | Url;
  preferredColor: string;
};
