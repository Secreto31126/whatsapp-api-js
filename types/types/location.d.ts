export = Location;
/**
 * Location API component
 *
 * @property {Number} latitude The latitude of the location
 * @property {Number} longitude The longitude of the location
 * @property {String} [name] The name of the location
 * @property {String} [address] The address of the location
 * @property {String} [_] The type of the object, for internal use only
 */
declare class Location {
    /**
     * Create a Location object for the API
     *
     * @param {Number} longitude Longitude of the location
     * @param {Number} latitude Latitude of the location
     * @param {String} [name] Name of the location
     * @param {String} [address] Address of the location, only displayed if name is present
     */
    constructor(longitude: number, latitude: number, name?: string, address?: string);
    longitude: number;
    latitude: number;
    name: string;
    address: string;
    _: string;
}
//# sourceMappingURL=location.d.ts.map