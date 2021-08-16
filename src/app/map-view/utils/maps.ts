import CenterLatLong from './longLatCenter.json'
import PlacesData from './markersData.json'

/**
 * CountryCode has all countries in a two character string
 * TODO: To complete the list
 */
export enum CountryCode {
  MX =  "mx",
  AR =  "ar",
  BR =  "br"
}

/**
 * ZoomPosition has all posible ways of showing the zoom controls
 */
export enum ZoomPosition {
  TOP_LEFT = 'topleft',
  TOP_RIGHT = 'topright',
  BOTTOM_LEFT = 'bottomleft',
  BOTTOM_RIGHT = 'bottomright'
}

/**
 * Coordinates is an interface to save longitud and latitud
 */
interface Coordinates {
  GPSLatitude: number,
  GPSLongitude: number
}

/**
 * Place is an interface to map all places information
 */
export interface Place {
  GPSLatitude: number,
  GPSLongitude: number,
  place: string,
  files_count: number,
  files_first: number
}

/**
 * MapsUtils is created simulating a service layer for demonstration purpose
 */
export class MapsUtils {
  /**
   * Get country center coordinates
   * @param country user country
   * @returns
   */
  public static getCountryCenter( country: CountryCode): Coordinates {
    if(CenterLatLong[country])
      return CenterLatLong[country];
    return CenterLatLong[CountryCode.MX]
  }

  /**
   * Get all places from the service
   * @returns Place[]
   */
  public static getPlaces(): Place[]{
    let data = []

    // The data should be transformed to get coordinates as numbers and remove invalid values
    PlacesData.forEach(elem => {
      if(elem.GPSLatitude && elem.GPSLongitude)
        data.push(
          Object.assign(elem, {
            GPSLatitude: parseFloat(elem.GPSLatitude),
            GPSLongitude: parseFloat(elem.GPSLongitude)
          })
        )
    })
    return data
  }
}
