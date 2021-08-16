import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './components/map-view/map-view.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';



@NgModule({
  declarations: [MapViewComponent ],
  imports: [
    CommonModule,
    LeafletModule
  ],
  exports:[MapViewComponent]
})
export class MapViewModule { }
