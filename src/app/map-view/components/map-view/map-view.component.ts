import { Component, OnInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { MapsUtils, CountryCode, Place } from '../../../utils/maps'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @Input('extraOptions') extraOptions = {}
  @Input('onPlaceClick') onPlaceClick = (e) => console.log(e)
  @Input('height') viewHeight: string = '80vh'
  @Input('country') country: CountryCode = CountryCode.MX
  markers: L.Marker<any>[] = []
  general: L.TileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  options:  any = {}
  zoomOptions:  any = {}

  constructor() {
    this.initMarkers()
    this.initOptions(this.country)
   }

  ngOnInit(): void {
  }

  /**
   * Event used to show all popups as visible on start
   * @param e event
   */
  onMapReady(e){
    console.log(e)
    L.control.zoom({
      position: 'bottomright'
    }).addTo(e);
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
      center: L.latLng(MapsUtils.getCountryCenter(country).long, MapsUtils.getCountryCenter(country).lat)
    }, this.extraOptions)
  }

  /**
   * Generate url of the image
   * @param place the data from the place
   * @returns The url to the image
   */
  buildThumbnailUrl(place: Place): string {
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
