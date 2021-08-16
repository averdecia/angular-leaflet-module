import { Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { MapsUtils, CountryCode, Place, ZoomPosition } from '../../utils/maps'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  /**
   * @param extraOptions parameter will allow adding extra map options from outside
   */
  @Input('extraOptions') extraOptions = {}
  /**
   * @param onPlaceClick is a function that will be executed on popup click
   */
  @Input('onPlaceClick') onPlaceClick = (e) => console.log(e)
  /**
   * @param height allows to change the height on the view, the width is always 100%
   */
  @Input('height') viewHeight: string = '80vh'
  /**
   * @param country The country is necessary to set the center view
   */
  @Input('country') country: CountryCode = CountryCode.MX
  /**
   * @param zoomPosition Allow to change zoom control positions.
   * Posible values can be found in https://leafletjs.com/reference-1.7.1.html#control-position
   */
  @Input('zoomPosition') zoomPosition: ZoomPosition = ZoomPosition.BOTTOM_RIGHT

  markers: L.Marker<any>[] = []
  general: L.TileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  options:  any = {}
  zoomOptions:  any = {}

  constructor() {
    this.initMarkers()
    this.initOptions(this.country)
   }

  /**
   * Event used to show execute actions when mapsis ready on the view
   * @param e event
   */
  onMapReady(e){
    // Adding zoom controlt the bottomright
    L.control.zoom({
      position: this.zoomPosition
    }).addTo(e);

    // Openning popups by default
    this.markers.map(el => {
      el.openPopup()
    });
  }

  /**
   * Create all markers for each image
   */
  initMarkers() {
    MapsUtils.getPlaces().map((place: Place) => {

      // Generate popup with image content
      const popup = this.createPopup(place, this.onPlaceClick)

      // The marker icon is forced to be invisible
      const marker = L.marker([ place.GPSLongitude, place.GPSLatitude ], { opacity: 0 })
      .bindPopup(popup, {
        closeOnClick: false,
        autoClose: false,
        closeButton: false,
      })
      this.markers.push(marker)
    })
  }

  /**
   * Define map initial configurations
   * @param country user default contry for detect the map center
   */
  initOptions(country: CountryCode){
    this.options = Object.assign({
      layers: [this.general, ...this.markers],
      zoom: 5,
      zoomControl: false,
      center: L.latLng(
        MapsUtils.getCountryCenter(country).GPSLongitude, MapsUtils.getCountryCenter(country).GPSLatitude)
    }, this.extraOptions)
  }

  /**
   * Generate url of the image
   * @param place the data from the place
   * @returns The url to the image
   */
  buildThumbnailUrl(place: Place): string {
    // TODO: Use the right service for the photo
    return "./assets/testImage.jpeg"
  }

  /**
   * Create a Popup instance with the click listener and the template content
   * @param place the data from the place
   * @param func the listener function
   * @returns L.Popup a popup instance
   */
  createPopup(place: Place, func: (e) => void): L.Popup {
    // Create Container
    const content = L.DomUtil.create('div')

    // Create image
    const img = L.DomUtil.create('img', 'map-thumbnail-img', content)
          img.src = this.buildThumbnailUrl(place)

    // Create number element
    const strong = L.DomUtil.create('strong', 'map-thumbnail-number', content)
          strong.innerHTML = `${place.files_count}`

    // Add event listener for click
    if(func){
      L.DomEvent.addListener(content, 'click', func);
    }

    return L.popup().setContent(content)
  }
}
