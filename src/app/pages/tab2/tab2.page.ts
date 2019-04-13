import { Component } from '@angular/core';
import { DataLocalService } from 'src/app/services/data-local.service';
import { Registro } from 'src/app/models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public dataLocal: DataLocalService){}
  enviarCorreo(){
    console.log("neviando correo");
  }

  abrirRegistro(registro: Registro){
    this.dataLocal.abrirRegistro(registro);
  }
}
