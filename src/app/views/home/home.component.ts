import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from '@microsoft/signalr';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NameDialogComponent } from '../../shared/name-dialog/name-dialog.component';

interface Message { //exibir os dados de forma visual
  userName: string,
  text: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  messages: Message[] = []
  messageControl = new FormControl('');
  userName!: string;
  connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44381/chat").build(); //faz a conexão do SignalR com o projeto feito em ASP.NET na port definida no Startup.cs

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.openDialog();
   }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(NameDialogComponent, {
      width: '250px',
      data: this.userName,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.userName = result;
      this.startConnection();
      this.openSnackBar(result);
    });
  }

  openSnackBar(userName: string) { // mostra no canto superior quando um usuário entra
    const message = userName == this.userName ? 'Você entrou na sala' : `${userName} acabou de entrar`;

    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    })
  }

  startConnection() { //escuta o método newMessage criado no Hub
    this.connection.on("newMessage", (userName: string, text: string) => {
      this.messages.push({
        text: text,
        userName: userName
      }); //acrescenta item ao final do array (nova msg)
    });

    this.connection.on("newUser", (userName: string) => {
      this.openSnackBar(userName); //ativar snackbar
    });
    
    this.connection.on("previousMessages", (messages: Message[]) => {
      this.messages = messages; //mostrar mensagens antigas
    });
    
    this.connection.start() //iniciar conexão
    .then(() => {
      this.connection.send("newUser", this.userName, this.connection.connectionId);
    });
  }

  sendMessage() {
    this.connection.send("newMessage", this.userName, this.messageControl.value)
    .then(()=> {
      this.messageControl.setValue(''); //zerar o texto de input ao enviar uma mensagem nova
    })
  }
}
