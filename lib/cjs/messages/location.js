"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var location_exports = {};
__export(location_exports, {
  Location: () => Location
});
module.exports = __toCommonJS(location_exports);
var import_types = require("../types.js");
class Location extends import_types.ClientMessage {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Location
});
//# sourceMappingURL=location.js.map
