import { ClientMessage } from "../types.js";
class Location extends ClientMessage {
  /**
   * The latitude of the location
   */
  longitude;
  /**
   * The longitude of the location
   */
  latitude;
  /**
   * The name of the location
   */
  name;
  /**
   * The address of the location
   */
  address;
  /**
   * @override
   * @internal
   */
  get _type() {
    return "location";
  }
  /**
   * Create a Location object for the API
   *
   * @example
   * ```ts
   * import { Location } from "whatsapp-api-js/messages";
   *
   * const location_message = new Location(0, 0);
   *
   * const location_named_message = new Location(0, 0, "My Store", "Address");
   * ```
   *
   * @param longitude - Longitude of the location
   * @param latitude - Latitude of the location
   * @param name - Name of the location
   * @param address - Address of the location, only displayed if name is present
   */
  constructor(longitude, latitude, name, address) {
    super();
    this.longitude = longitude;
    this.latitude = latitude;
    if (name) this.name = name;
    if (address) this.address = address;
  }
}
export {
  Location
};
//# sourceMappingURL=location.js.map
