import { Component, OnInit,Inject } from '@angular/core';
import { CalendarOptions ,EventApi} from '@fullcalendar/angular'; // useful for typechecking
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase,AngularFireList   } from '@angular/fire/database';
import esLocale from '@fullcalendar/core/locales/es';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {


  listaDatos:any;
  fecha:any;
  fechas:any;
  itemsRef: AngularFireList<any>;
  firebaseData:any;
  todasFechas:any;
  buscar:any;
  uidFechaHoy:any;
  uidnueva:any;
  uidUsuario:any;
  htmlContent = '';
  render = false;
  calendarOptions: CalendarOptions = {
   headerToolbar: {
      left: 'prev,next today',
      right: 'dayGridMonth,timeGridWeek'
    },
    footerToolbar:{
      center: 'title',
    },
    locales: [ esLocale,],
    weekends:true,
    contentHeight:'400px',
    eventClick: this.modificar.bind(this),
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];

  
  constructor(private dialogRef: MatDialogRef<CalendarComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,public fb:AngularFirestore,public db:AngularFireDatabase,private ser:AuthService) {


      this.uidUsuario = this.ser.user.uid;
    /* console.log(this.uidUsuario); */
      setTimeout(()=>{
       /*  console.log(); */
        this.render = true;
      },500);
      this.render = false;
     
      /* Se crea un uid  */
      this.uidnueva = db.createPushId();
   

  /* si sirve pero es list */
    this.itemsRef = db.list('fechas');

/* sirve y es desde fireStore */
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
      this.fecha = data;
      this.calendarOptions.events = this.fecha;
    });

   

   }

   
  ngOnInit(): void {

  }
  
  handleDateClick(arg:any) {

    /* solo funciona cuando se selecciona un espacio vacio y se obtiene la fecha para crear un nuevo texto  */
    console.log('Agregar nuevo event')
    /* console.log(arg); */
    let fechaSeleccionado = arg.dateStr;
    let horainicio = '01:00:00';
    let horaend = '24:00:00'
    let start = fechaSeleccionado+'T'+horainicio;
    let end = fechaSeleccionado+'T'+horaend;
    const titulo= 'Titulo nuevo...';
    const textoTest = '<font face=\"Arial\">Nuevo evento</font>';
    
    alert('date click! ' + arg.dateStr);
    
    /* Aqui hay que hacer una modificacion ya que se crea en la lista y no en firestore dAtabse */
   /*  this.itemsRef.update(this.uidnueva, {title:'Titulo nuevo...', date: fechaSeleccionado,start:start,end:end ,extendedProps:{titulo:titulo,texto:textoTest,fecha:arg.dateStr}}); */
   /*  this.fb.doc(`${ this.uidUsuario }/fechas`).collection('fechas1').add({title:'Titulo nuevo...', date: fechaSeleccionado,start:start,end:end ,extendedProps:{titulo:titulo,texto:textoTest,fecha:arg.dateStr}}); */
    var valoresCalendario = {
      uid:this.uidnueva,
      texto:textoTest,
      fecha:fechaSeleccionado,
      titulo:titulo,
      inicio:start,
      final:end
    }
    this.dialogRef.close(valoresCalendario);
    
  }
  modificar(arg:any){
    
    /* Sirve para modificar el texto del dia seleccionado */
    console.log('funcion para modificar ')
    console.log(arg);
    let fechaSeleccionado = arg.event._def.extendedProps.fecha;
    let textoSeleccionado = arg.event._def.extendedProps.texto;
    let uidSeleccionado = arg.event._def.extendedProps.uid;
    let tituloSeleccionado = arg.event._def.extendedProps.titulo;

    /* console.log(fechaSeleccionado)
    console.log(textoSeleccionado)
    console.log(uidSeleccionado) */
    var valoresCalendario = {
      uid:uidSeleccionado,
      texto:textoSeleccionado,
      fecha:fechaSeleccionado,
      titulo:tituloSeleccionado

    }
    this.dialogRef.close(valoresCalendario);
  
  }
  handleEvents(events: EventApi[]) {
    this.currentEvents = events; 
  }
  close(){

   this.dialogRef.close();
    
  }


}
