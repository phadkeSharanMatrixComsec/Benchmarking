import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class VideoGridComponent implements OnInit, OnDestroy {
  gridSize: number = 6;
  currentPage: number = 0;
  viewsPerPage: number = this.gridSize * this.gridSize;
  totalPages: number = 40;
  videos: any[] = [];
  players: Hls[] = [];

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.initializeGrid();
  }

  initializeGrid() {
    // Clear existing players
    this.destroyPlayers();

    // Create video array based on grid size  
    const totalVideos = this.gridSize * this.gridSize;
    this.videos = Array(totalVideos).fill(null).map((_, index) => ({
      id: `video-${this.currentPage*this.viewsPerPage + index}`,
      latencyId: `latency-${this.currentPage*this.viewsPerPage + index}`,
      stream: `http://192.168.27.79:8888/mystream${this.currentPage*this.viewsPerPage + index}/index.m3u8`
      // stream: `http://13.201.192.140:8888/mystream${index}/index.m3u8`
      // stream: `http://ec2-13-232-28-91.ap-south-1.compute.amazonaws.com:8888/mystream${index}/index.m3u8`
    }));

    // Initialize players after view is rendered
    setTimeout(() => this.initializePlayers(), 0);
  }

  initializePlayers() {
    this.videos.forEach(video => {
      this.initializePlayer(video.id, video.stream, video.latencyId);
    });
  }

  initializePlayer(videoId: string, streamUrl: string, latencyId: string) {
    const videoElement = this.elementRef.nativeElement.querySelector(`#${videoId}`);
    const latencyElement = this.elementRef.nativeElement.querySelector(`#${latencyId}`);

    if (Hls.isSupported()) {
      // const hls = new Hls({
      //   liveSyncDurationCount: 1,
      //   liveMaxLatencyDurationCount: 2,
      //   liveDurationInfinity: true,
      //   lowLatencyMode: true,
      //   maxBufferLength: 1,
      //   maxMaxBufferLength: 2,
      //   backBufferLength: 0,
      //   enableWorker: true,
      // });

      const hls = new Hls({
        // liveSyncDurationCount: 3,  // Increase to reduce flickering
        // liveMaxLatencyDurationCount: 5,  // Slightly higher buffer for stability
        // liveDurationInfinity: true,
        // lowLatencyMode: true,
        // maxBufferLength: 3,  // Increase buffer to reduce rebuffering
        // maxMaxBufferLength: 5,  // Allow more buffer for stability
        // backBufferLength: 0,
        // enableWorker: true,
      });
      

      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.muted = true;
        videoElement.play();
        // videoElement.play().catch(error: ErrorEvent => {
        //   console.log(`${videoId} autoplay failed:`, error);
        // });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      // Monitor latency
      // setInterval(() => {
      //   if (!videoElement.paused && hls.latency !== undefined) {
      //     const currentLatency = hls.latency * 1000;
      //     latencyElement.textContent = `Latency: ${currentLatency.toFixed(0)}ms`;


      //     // if (currentLatency > 1000) {
      //     //     console.log(`${videoId} latency too high, seeking to live edge...`);
      //     //     if (videoElement.buffered.length) {
      //     //         videoElement.currentTime = videoElement.buffered.end(videoElement.buffered.length - 1);
      //     //     }
      //     // }
      //   }
      // }, 1000);

      this.players.push(hls);
    }
  }

  changeGridSize(size: number) {
    this.gridSize = size;
    this.initializeGrid();
  }

  destroyPlayers() {
    this.players.forEach(hls => hls.destroy());
    this.players = [];
  }

  ngOnDestroy() {
    this.destroyPlayers();
  }

  nextPage() {
    this.currentPage = this.currentPage + 1;
    this.initializeGrid();
  }

  previousPage() {
    this.currentPage = this.currentPage - 1;
    this.initializeGrid();
  }

  gotoPage() {
    this.initializeGrid();
  }

} 