export interface EventItem {
  id: string;
  name: string;
  date: string;
  timezone: string;
  venue: string;
  location: {
    city: string;
    country: string;
  };
  event_images: {
    square: string;
    landscape: string;
  };
  description: string;
  lineup: { details: string; time?: string }[];
  ticket_types: {
    name: string;
    price: { face_value: number };
    sold_out: boolean;
  }[];
  currency: string;
  apple_music_tracks?: { preview_url: string }[];
  spotify_tracks?: { preview_url: string }[];
  sale_start_date: string;
  featured: boolean;
  sold_out: boolean;
  url: string;
}
