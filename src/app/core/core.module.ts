import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ErrorHandlerService } from './services/error-handler.service';
import { LoadingService } from './services/loading.service';
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TelemetryService } from '../services/telemetry.service';
import { TelemetryInterceptor } from './interceptors/telemetry.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    ErrorHandlerService,
    LoadingService,
    UnsavedChangesGuard,
    TelemetryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TelemetryInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { } 