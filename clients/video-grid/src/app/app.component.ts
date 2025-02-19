import { Component } from '@angular/core';
import { VideoGridComponent } from './components/video-grid/video-grid.component';
import { VideoGridWebrtcComponent } from './components/video-grid-webrtc/video-grid-webrtc.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoGridComponent, VideoGridWebrtcComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Video Grid';
}
