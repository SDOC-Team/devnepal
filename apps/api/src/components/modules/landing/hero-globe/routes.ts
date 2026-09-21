export type Place = { name: string; lat: number; lon: number };

/** Every arc starts or ends here. */
export const HUB: Place = { name: "Kathmandu", lat: 27.7172, lon: 85.324 };

/**
 * Decorative waypoints for the globe animation. These are deliberately not
 * presented as member or contributor data; locations require a verified data
 * source before they can be represented as such.
 */
export const DECORATIVE_WAYPOINTS: Place[] = [
  { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
  { name: "Seattle", lat: 47.6062, lon: -122.3321 },
  { name: "Austin", lat: 30.2672, lon: -97.7431 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Toronto", lat: 43.6532, lon: -79.3832 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
  { name: "London", lat: 51.5072, lon: -0.1276 },
  { name: "Berlin", lat: 52.52, lon: 13.405 },
  { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Delhi", lat: 28.6139, lon: 77.209 },
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { name: "Seoul", lat: 37.5665, lon: 126.978 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
];
