import * as M from "../index.js";

export function Location({
  longitude,
  latitude,
  name,
  address,
}: {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
}) {
  return new M.Location(longitude, latitude, name, address);
}
