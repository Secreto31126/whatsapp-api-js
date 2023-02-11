/**
 * Location API component
 */
export default class Location {
    /**
     * The latitude of the location
     */
    longitude: number;
    /**
     * The longitude of the location
     */
    latitude: number;
    /**
     * The name of the location
     */
    name?: string;
    /**
     * The address of the location
     */
    address?: string;
    /**
     * The type of the object
     * @internal
     */
    _?: "location";

    /**
     * Create a Location object for the API
     *
     * @param longitude - Longitude of the location
     * @param latitude - Latitude of the location
     * @param name - Name of the location
     * @param address - Address of the location, only displayed if name is present
     */
    constructor(
        longitude: number,
        latitude: number,
        name?: string,
        address?: string
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
