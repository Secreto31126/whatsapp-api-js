/**
 * Location API component
 *
 * @group Location
 */
export default class Location {
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
    get _type() {
        return "location";
    }
    /**
     * Create a Location object for the API
     *
     * @param longitude - Longitude of the location
     * @param latitude - Latitude of the location
     * @param name - Name of the location
     * @param address - Address of the location, only displayed if name is present
     */
    constructor(longitude, latitude, name, address) {
        this.longitude = longitude;
        this.latitude = latitude;
        if (name)
            this.name = name;
        if (address)
            this.address = address;
    }
    _build() {
        return JSON.stringify(this);
    }
}
//# sourceMappingURL=location.js.map