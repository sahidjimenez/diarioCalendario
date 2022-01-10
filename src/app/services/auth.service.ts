import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import { AngularFireDatabase,AngularFireList   } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user:any;
  get user(){
    return {...this._user};
  }

  constructor(private router:Router, public auth:AngularFireAuth,public db:AngularFireDatabase,public fb:AngularFirestore) { }

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      this._user = fuser;
   /*    console.log(fuser);
      console.log(fuser?.email);
      console.log(fuser?.displayName);
      console.log(fuser?.uid); */
    });
  }

  crearUsuarioFacebook() {
    this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then( fbUser =>{
      console.log(fbUser);
      const uid:any = fbUser.user?.uid;
      const nombre = fbUser.user?.displayName;
      const email = fbUser.user?.email;
      const newUser = new Usuario(uid,nombre,email);
      this._user = newUser;
     /*  console.log(newUser); */

      this.router.navigate(['/']);
     /*  return this.db.list(uid).push(newUser); */
      return this.fb.doc(`${ uid }/usuario`).set(({...newUser}));
    })
    .catch(err =>console.log(err));
  }
  crearcuentacorreo(nombre:string,email:string,password:string){
    return this.auth.createUserWithEmailAndPassword(email,password)
          .then(({user})=>{
            const newUser = new Usuario(user?.uid,nombre,email);
            
            return this.fb.doc(`${ user?.uid }/usuario`)
            .set(({...newUser}));
          });

  }
  login(email:string,password:string){

     const nombre = 'nada';
    return this.auth.signInWithEmailAndPassword(email,password)
    .then(({user})=>{
      const newUser = new Usuario(user?.uid,nombre,email);
      
      return this.fb.doc(`${ user?.uid }/usuario`)
      .set(({...newUser}));
    });
  }
  logout(){
    this.auth.signOut();
    console.log('Logout')
  }
  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser=>fbUser != null)
    );
  }
  initFechas(uid:string){
    this.fb.collection(`${uid }/fechas/fechas1`)
    .snapshotChanges()
    .pipe(
      map(snapshot=>{
      /*   console.log(snapshot) */
        return snapshot.map(doc=>{
          return {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          }
        })
      })
    )
    .subscribe( algo => {
     return algo;
    })

  }
}
