import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.css']
})
export class ConfirmActionDialogComponent {
  actionName?: string;
  entityName?: string;

  constructor( public dialogRef: MatDialogRef<ConfirmActionDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) data: { actionName?: string, entityName?: string }) 
    {
      this.actionName = data.actionName
      this.entityName = data.entityName
    }

    ok() {
      this.dialogRef.close('ok');
    }
}
