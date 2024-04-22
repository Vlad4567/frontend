import { GalleryPhoto } from './gallery';

export interface Service {
  id: number;
  name: string | null;
  price: number | null;
  duration: number | null;
  subcategoryId: number | null;
  photo: GalleryPhoto | null;
}
