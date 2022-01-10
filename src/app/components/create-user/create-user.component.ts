import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public fb: FormBuilder,public ser:AuthService,private router:Router,private route:Router) {
    this.loginForm = this.fb.group({
      nombre: new FormControl('', Validators.required),
      correo: new FormControl('' , Validators.required ),
      password: new FormControl('' , Validators.required ),
    });
   }

  ngOnInit(): void {
  }
  crear(){
    this.ser.crearUsuarioFacebook();
  }
  login(correo:string,pass:string){
    this.ser.login(correo,pass);
  }
  logout(){
    this.ser.logout();
  }
  guardar(algo:any){

    if(this.loginForm.invalid){return;}

    const {nombre,correo,password}= this.loginForm.value;
    this.ser.crearcuentacorreo(nombre,correo,password).
    then(credenciales =>{
      /* console.log(credenciales); */
      this.router.navigate(['/']);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  ir(){
    this.router.navigate(['login']);
  }

}
