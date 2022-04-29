class Location {
    /**
     * Create a Location object for the API
     * 
     * @param {Number} longitude Longitude of the location
     * @param {Number} latitude Latitude of the location
     * @param {(String|Void)} name Name of the location
     * @param {(String|Void)} address Address of the location, only displayed if name is present
     */
    constructor(longitude, latitude, name, address) {
        if (!longitude) throw new Error("Longitude must be specified");
        if (!latitude) throw new Error("Latitude must be specified");
        this.longitude = longitude;
        this.latitude = latitude;
        if (name) this.name = name;
        if (address) this.address = address;
    }
}

module.exports = Location;
