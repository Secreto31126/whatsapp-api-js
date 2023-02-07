/**
 * Location API component
 *
 * @property {number} latitude The latitude of the location
 * @property {number} longitude The longitude of the location
 * @property {string} [name] The name of the location
 * @property {string} [address] The address of the location
 * @property {"location"} [_] The type of the object, for internal use only
 */
export default class Location {
    longitude: number;
    latitude: number;
    name?: string;
    address?: string;
    _?: "location";

    /**
     * Create a Location object for the API
     *
     * @param {number} longitude Longitude of the location
     * @param {number} latitude Latitude of the location
     * @param {string} [name] Name of the location
     * @param {string} [address] Address of the location, only displayed if name is present
     */
    constructor(
        longitude: number,
        latitude: number,
        name: string,
        address: string
    ) {
        if (!longitude) throw new Error("Longitude must be specified");
        if (!latitude) throw new Error("Latitude must be specified");
        this.longitude = longitude;
        this.latitude = latitude;
        if (name) this.name = name;
        if (address) this.address = address;
        this._ = "location";
    }
}
