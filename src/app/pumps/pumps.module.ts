import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button'


import { PumpListComponent } from './pump-list/pump-list.component';



@NgModule({
  declarations: [PumpListComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule
  ],
  exports: [PumpListComponent]
})
export class PumpsModule { }
