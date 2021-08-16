import CenterLatLong from './longLatCenter.json'
import PlacesData from './markersData.json'

export enum CountryCode {
  MX =  "mx",
  AR =  "ar",
  BR =  "br"
}
interface Coordinates {
  lat: number,
  long: number
}
export interface Place {
  GPSLatitude: number,
  GPSLongitude: number,
  place: string,
  files_count: number,
  files_first: number
}

export class MapsUtils {
  public static getCountryCenter( country: CountryCode): Coordinates {
    return CenterLatLong[country];
  }

  public static getPlaces(): Place[]{
    let data = []
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
