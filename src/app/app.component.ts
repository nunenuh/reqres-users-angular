import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TelemetryService } from './core/services/telemetry.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ReqRes Users';

  constructor(
    private telemetryService: TelemetryService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    console.log('AppComponent initialized');
    // Make a test request to trigger telemetry
    this.http.get('https://reqres.in/api/users?page=1').subscribe({
      next: (response) => console.log('Test request successful'),
      error: (error) => console.error('Test request failed', error)
    });
  }
}