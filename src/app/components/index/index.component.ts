import { Component, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AngularFireDatabase,AngularFireList   } from '@angular/fire/database';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { CalendarComponent } from '../calendar/calendar.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  title = 'diarioCalendario';
  titulo:string ='';
  name = 'Angular 6';
  htmlContent = '';
  itemsRef: AngularFireList<any>;
  uidFechaHoy:any;
  todasFechas:any;
  firebaseData:any;
  todasFechas2:any;
  uidUsuario:any;
  buscar:any;
  newid:any;
  fechaFCHoy:any;
  start:any;
  end:any;
  uidgenerado:any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  listaDatos:any;
  fecha:any;

  constructor( private router:Router ,public fb:AngularFirestore,private afs: AngularFirestore,public db:AngularFireDatabase,public dialog: MatDialog,private ser:AuthService) { 

    
    this.uidUsuario = this.ser.user.uid;
    /* console.log(this.uidUsuario); */
    const fechaHoy  = new Date();
    var day = fechaHoy.getDate();
    let dayMod:string ='';
    var month1 = 1 +fechaHoy.getMonth();
    let monthMod:string ='';
     this.uidgenerado = this.afs.createId();
    var cero:any = '';
    if(day<=9){
      cero=0;
    }else{
      cero='';
    }
    if(month1<=9){
      cero=0;
    }else{
      cero='';
    }
    
    const month = 1 +fechaHoy.getMonth();
    const year = fechaHoy.getFullYear();
    let fechaFCHoy = year + '-' +cero+ month + '-' + cero +day;

    this.itemsRef = db.list('fechas');
    
      
    
      /* this.ser.initAuthListener(); */
      this.firebaseData = this.fb.collection(`${this.uidUsuario }/fechas/fechas1`)
      .snapshotChanges()
      .pipe(
        map(snapshot=>{
        
          return snapshot.map(doc=>{
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data() as any
            }
          })
        })
      )
      .subscribe( data => {
        console.log(data);
        this.fecha = data;
        
        this.buscar = this.fecha.filter((date:any) =>date.date == fechaFCHoy);
        console.log(this.buscar);
        this.titulo = this.buscar[0]?.title;
        this.uidFechaHoy = this.buscar[0]?.uid;
        this.htmlContent = this.buscar[0]?.extendedProps.texto;
          
      });
      /* hacer se unsubscribe para que sea solo una vez
      this.firebaseData.unsubscribe();
       */
      this.ser.initFechas(this.uidUsuario);

      
      console.log(this.htmlContent);

  }

  ngOnInit(): void {
  }
  accion(){
    /* const uid = this.ser.user.uid; */
   
    const fechaHoy  = new Date();
    const day = fechaHoy.getDate();
    let dayMod:string ='';
    const month = 1 +fechaHoy.getMonth();
    let monthMod:string ='';
    const year = fechaHoy.getFullYear();
    var cero:any = '';
    if(day<=9){
      dayMod='0'+day;
    }else{
      dayMod='';
    }
    if(month<=9){
      monthMod='0'+month;
    }else{
      monthMod='';
    }
    
    let fechaFCHoy = year + '-' + monthMod + '-'+ dayMod;
    let horainicio = '00:00:00';
    let horaend = '24:00:00'
    let start = fechaFCHoy+'T'+horainicio;
    let end = fechaFCHoy+'T'+horaend;

    /* El uid del evento se debe generar para que se vayan guardando uno por uno */

    if(this.htmlContent){
      if(this.uidFechaHoy){

  
        console.log(this.uidFechaHoy)
       
        this.afs.doc(`${ this.uidUsuario }/fechas`).collection('fechas1').doc(`${ this.uidFechaHoy }`).update({title:this.titulo,extendedProps:{texto:this.htmlContent,titulo:this.titulo,fecha:this.fechaFCHoy }})
        .then((ref)=>console.log('exito',ref))
        .catch(err=>this.afs.doc(`${ this.uidUsuario }/fechas`).collection('fechas1').add({title:this.titulo, date: this.fechaFCHoy,start:this.start,end:this.end,extendedProps:{texto:this.htmlContent,titulo:this.titulo,fecha:this.fechaFCHoy } }));


      }else{

       
        this.afs.doc(`${ this.uidUsuario }/fechas`).collection('fechas1').add({title:this.titulo, date: this.fechaFCHoy,start:start,end:end,extendedProps:{texto:this.htmlContent,titulo:this.titulo,fecha:this.fechaFCHoy } })
        .then((ref)=>console.log('Exito!',ref))
        .catch( err=> console.log(err));
      }
    }else{
      console.log('no hay datos')
    }
  }
  
  openCalendario(): any{
    /* console.log(this.ser.user.uid); */
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.width = '400px';
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(CalendarComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data != undefined){
          console.log(data);
          if(data.uid && data.titulo && data.texto){
            this.uidFechaHoy = data.uid;
            this.titulo = data.titulo;
            this.htmlContent = data.texto;
            this.fechaFCHoy = data.fecha;
            this.start=data.inicio;
            this.end= data.final;
          }else{

          }
        }
     }
    );
  }

  login(){
    this.ser.crearUsuarioFacebook();
   
  }
  logout(){
    this.ser.logout();
    this.router.navigate(['login']);
  }



}
