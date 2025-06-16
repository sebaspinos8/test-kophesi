import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public showAlert(options: SweetAlertOptions): Promise<any> {
    return Swal.fire(options);
  }

  public showConfirmation(message: string): Promise<any> {
    return this.showAlert({
      // title: '¿Estás seguro?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });
  }

  public showSuccessMessage(message: string): Promise<any> {
    return this.showAlert({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonText: 'Genial',
    });
  }


  public showAlertMessage(message: string): Promise<any> {
    return this.showAlert({
      title: '¡Aviso!',
      text: message,
      icon: 'warning',
      iconColor: '#FA001E',
      confirmButtonText: 'Ok',
    });
  }

  public showAlertErrorMessage(message: string): Promise<any> {
    return this.showAlert({
      title: '!Error!',
      text: message,
      icon: 'error',
      iconColor: '#FA001E',
      confirmButtonText: 'Ok',
    });
  }

  public showAlertMessageWarning(message: string): Promise<any> {
    return this.showAlert({
      title: '¡Aviso!',
      text: message,
      icon: 'warning',
      iconColor: '#edc40c',
      confirmButtonText: 'Ok',
    });
  }


  public showCustomAlert(tipo: string, descripcion: string, estado: string, fecha: string): Promise<any> {
    return this.showAlert({
      html: `
        <div style="text-align: left; font-family: Arial, sans-serif; border: 1px solid #E4E4E4; padding: 15px; border-radius: 10px; background-color: #F7F7F7;">
          <h4 style="margin: 0; color: #1E4E79; border-bottom: 2px solid #E4E4E4; padding-bottom: 10px;">Excepciones</h4>
          <div style="margin-top: 10px;">
            <p style="margin: 5px 0; font-size:1rem"><strong>Tipo:</strong> ${tipo}</p>
            <p style="margin: 5px 0; text-align: justify; font-size:1rem"><strong>Descripción:</strong> <br>${descripcion}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <span style="color: #000000; background-color: #49E27C; padding: 5px 10px; border-radius: 5px;">${estado}</span>
            <span style="font-size: 12px; color: #757575;">${fecha}</span>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      customClass: {
        popup: 'custom-swal'
      }
    });
  }


  //Muestra alerta cuando los documentos obligatorios u opcionales no han sido ingresados
  public showValidationErrorMessages(messages: { [key: string]: string[] }): Promise<any> {
    let formattedMessages = '';

    for (let participante in messages) {
      formattedMessages += `<br><strong>Involucrado ${participante}:</strong><br>`;
      let categoriasConErrores: { [key: string]: string[] } = {};

      messages[participante].forEach(mensaje => {
        const match = mensaje.match(/"(.*?)" en la categoría "(.*?)"/);
        if (match) {
          const [_, documento, categoria] = match;
          if (!categoriasConErrores[categoria]) {
            categoriasConErrores[categoria] = [];
          }
          categoriasConErrores[categoria].push(documento);
        } else {
          formattedMessages += `- ${mensaje}<br>`;
        }
      });

      for (let categoria in categoriasConErrores) {
        formattedMessages += `<strong>* Errores en ${categoria}:</strong><br>`;
        categoriasConErrores[categoria].forEach(documento => {
          formattedMessages += `. ${documento} es obligatorio <br>`;
        });
      }
    }

    return this.showAlert({
      icon: 'error',
      title: 'Errores de Validación',
      html: `<div style="white-space: pre-wrap;">${formattedMessages}</div>`,
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'swal-wide' // Clase CSS en styles.css globales
      }
    });
  }


}
