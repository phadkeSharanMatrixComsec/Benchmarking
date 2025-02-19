// video-grid-webrtc.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-grid-webrtc',
  template: `
    <div class="video-grid">
      <div *ngFor="let stream of streams; let i = index" class="video-container">
        <video #videoElement [id]="'video-' + i" autoplay playsinline></video>
      </div>
    </div>
  `,
  styles: [`
    .video-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      padding: 8px;
      background: #000;
      width: 100%;
      height: 100vh;
    }

    .video-container {
      aspect-ratio: 16/9;
      background: #222;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `],
  standalone: true
})
export class VideoGridWebrtcComponent implements OnInit {
  readonly MAX_STREAMS = 64; // 8x8 grid
  streams: number[] = Array(this.MAX_STREAMS).fill(0).map((_, i) => i);

  ngOnInit() {
    this.initializeStreams();
  }

  async initializeStreams() {
    for (let i = 0; i < this.MAX_STREAMS; i++) {
      try {
        const videoElement = document.getElementById(`video-${i}`) as HTMLVideoElement;
        if (!videoElement) continue;

        const ws = new WebSocket(`ws${location.protocol === 'https:' ? 's' : ''}://${location.hostname}:8889/mystream${i}`);
        
        // Create WebRTC peer connection
        const pc = new RTCPeerConnection();
        
        // Handle ICE candidates
        pc.onicecandidate = event => {
          if (event.candidate) {
            ws.send(JSON.stringify({
              type: 'candidate',
              candidate: event.candidate
            }));
          }
        };

        // Handle incoming tracks
        pc.ontrack = event => {
          if (videoElement.srcObject !== event.streams[0]) {
            videoElement.srcObject = event.streams[0];
          }
        };

        // WebSocket message handling
        ws.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          
          if (message.type === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(message));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            ws.send(JSON.stringify(answer));
          } else if (message.type === 'candidate') {
            await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
          }
        };

        // Handle WebSocket open
        ws.onopen = async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            ws.send(JSON.stringify(offer));
          } catch (err) {
            console.error(`Error creating offer for stream ${i}:`, err);
          }
        };

        // Error handling
        ws.onerror = (error) => {
          console.error(`WebSocket error for stream ${i}:`, error);
        };

        // pc.oneven = (error) => {
        //   console.error(`RTCPeerConnection error for stream ${i}:`, error);
        // };

      } catch (err) {
        console.error(`Error initializing stream ${i}:`, err);
      }
    }
  }
}