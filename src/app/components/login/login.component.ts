import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public fb: FormBuilder,public ser:AuthService,private router:Router,private route:Router) {

    this.loginForm = this.fb.group({
      nombre: new FormControl(''),
      correo: new FormControl('' , Validators.required ),
      password: new FormControl('' , Validators.required ),
    });
   }

  ngOnInit(): void {
  }

  crear(){
    this.ser.crearUsuarioFacebook();
  }
  login(algo:any){
    if(this.loginForm.invalid){return;}
    const {correo,password}= this.loginForm.value;
    this.ser.login(correo,password).
    then(credenciales =>{
      console.log(credenciales);
      this.router.navigate(['/']);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  logout(){
    this.ser.logout();
  }
  guardar(algo:any){

    if(this.loginForm.invalid){return;}

    const {nombre,correo,password}= this.loginForm.value;
    this.ser.crearcuentacorreo(nombre,correo,password).
    then(credenciales =>{
      console.log(credenciales);
      this.router.navigate(['/']);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  ir(){
    this.router.navigate(['crear']);
  }
}
