import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase,AngularFireObject,AngularFireList   } from '@angular/fire/database';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /* Pruebas para el desarrollo de obtener datos de firebase */
  items: Observable<any[]>;
  itemsRef: AngularFireList<any>;
  objetosFechas:any;
  algo:any;
  
  constructor(private authServices:AuthService, fb:AngularFirestore,db:AngularFireDatabase,public dialog: MatDialog){

    this.authServices.initAuthListener();
    
    this.itemsRef = db.list('fechas');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() })),
      )
    );

  
    this.itemsRef = db.list('fechas');
    this.algo = db.list('fechas'); 
    /* console.log(this.algo); */
  }
 
  openCalendario(): any{
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.width = '600px';
    dialogConfig.height = '600px';
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(CalendarComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data);
      }
    );
  }
  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
  }
  updateItem(key: string, newText: string) {
    this.itemsRef.update(key, { text: newText });
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  
}
