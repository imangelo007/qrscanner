import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {
  guardados: Registro[] = [];

  constructor(
    private storage: Storage, 
    private nacCtrl: NavController, 
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
    ) {
    this.cargarStorage();
  }

  async cargarStorage() {
    this.guardados = (await this.storage.get('registros')) || [];
  }

  async guardarRegistro(format: string, text: string) {
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    this.storage.set('registros', this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro(registro: Registro) {
    this.nacCtrl.navigateForward('/tabs/tab2');
    switch (registro.type) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.nacCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const titulos = 'Tipo, Formatom Creado en, Texto';

    arrTemp.push(titulos);
    this.guardados.forEach(registro => {
      const linea = `${registro.type}, ${registro.format}, ${registro.create}, ${registro.text.replace(',', '')}\n`;
      arrTemp.push(linea);
    });
    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string){
    this.file.checkFile( this.file.dataDirectory, 'registro.csv' ).then( existe => {
      return this.escribirEnArchivo(text);
    }).catch(err => {
      return this.file.createFile(this.file.dataDirectory, 'registro.csv', false).then(creado => {
        return this.escribirEnArchivo(text);
      }).catch(err2 => {
        console.log("no se pudo crear el archivo", err2);
      })
    })
  }

  async escribirEnArchivo(text: string){
    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
    const archivo = `${this.file.dataDirectory}/registro.csv`;
    console.log("archivo creado");

    const email = {
      to: 'angelo2301@hotmail.es',
      attachments: [archivo],
      subject: 'Backup de scans',
      body: 'Probando envio de correo',
      isHtml: true
    }

    this.emailComposer.open(email);
  }
}
