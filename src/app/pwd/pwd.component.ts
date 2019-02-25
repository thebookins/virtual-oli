import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PwdService } from './pwd.service';

export interface DialogData {
  carbs: number;
  protein: number;
  fat: number;
}

@Component({
  selector: 'app-pwd',
  templateUrl: './pwd.component.html',
  styleUrls: ['./pwd.component.css']
})
export class PwdComponent implements OnInit {

  carbs: number;
  protein: number;
  fat: number;

  // reservoir: Number = null;
  status: Number = null;

  private sub: any;

  constructor(public dialog: MatDialog, private pwdService: PwdService) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(MealDialogComponent, {
      width: '250px',
      data: {carbs: this.carbs, protein: this.protein, fat: this.fat}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnInit() {
    this.sub = this.pwdService.status.subscribe(value => this.status = value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

@Component({
  selector: 'meal-dialog',
  templateUrl: 'meal-dialog.html',
})
export class MealDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MealDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
