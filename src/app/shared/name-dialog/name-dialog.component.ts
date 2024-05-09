import { Component, Inject, OnInit, inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrl: './name-dialog.component.scss'
})
export class NameDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) //passa os dados para um dialogo modal, enviando os dados do componente pai para o dialogo 
    public name: string,
    public dialogRef: MatDialogRef<NameDialogComponent>
  ) {}

  ngOnInit(): void {
    
  }
}
