import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | boolean {
    if (!component.canDeactivate()) {
      return new Observable<boolean>(observer => {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          data: {
            title: 'Unsaved Changes',
            message: 'You have unsaved changes. Are you sure you want to leave?'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          observer.next(result);
          observer.complete();
        });
      });
    }
    return true;
  }
} 