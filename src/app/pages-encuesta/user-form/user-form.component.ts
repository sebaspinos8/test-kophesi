import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api-service/api-service';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbDropdownModule   ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default  class UserFormComponent implements OnInit{

  userForm!: FormGroup;

  selectedCountry: string | null = null;

  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino',  value: 'F' },
    { label: 'Otro',      value: 'O' }
  ];

  educationOptions = [
    'Primaria',
    'Secundaria',
    'Técnico',
    'Universitario',
    'Postgrado'
  ];

  workAreas = [
    'Tecnología',
    'Salud',
    'Educación',
    'Finanzas',
    'Marketing',
    'Otro'
  ];

  countryOptions: string[] = [
    'Afganistán', 'Albania', 'Argelia', 'Samoa Americana', 'Andorra',
    'Angola', 'Anguila', 'Antártida', 'Antigua y Barbuda', 'Argentina',
    'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaiyán',
    'Bahamas', 'Baréin', 'Bangladés', 'Barbados', 'Bielorrusia',
    'Bélgica', 'Belice', 'Benín', 'Bermudas', 'Bután',
    'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Isla Bouvet', 'Brasil',
    'Territorio Británico del Océano Índico', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Islas Caimán',
    'República Centroafricana', 'Chad', 'Chile', 'China', 'Isla de Navidad',
    'Islas Cocos', 'Colombia', 'Comoras', 'Congo', 'República Democrática del Congo',
    'Islas Cook', 'Costa Rica', 'Costa de Marfil', 'Croacia', 'Cuba',
    'Curazao', 'Chipre', 'República Checa', 'Dinamarca', 'Yibuti',
    'Dominica', 'República Dominicana', 'Ecuador', 'Egipto', 'El Salvador',
    'Guinea Ecuatorial', 'Eritrea', 'Estonia', 'Esuatini', 'Etiopía',
    'Islas Malvinas', 'Islas Feroe', 'Fiyi', 'Finlandia', 'Francia',
    'Guayana Francesa', 'Polinesia Francesa', 'Territorios Australes Franceses', 'Gabón', 'Gambia',
    'Georgia', 'Alemania', 'Ghana', 'Gibraltar', 'Grecia',
    'Groenlandia', 'Granada', 'Guadalupe', 'Guam', 'Guatemala',
    'Guernesey', 'Guinea', 'Guinea-Bisáu', 'Guyana', 'Haití',
    'Islas Heard y McDonald', 'Vaticano', 'Honduras', 'Hong Kong', 'Hungría',
    'Islandia', 'India', 'Indonesia', 'Irán', 'Iraq',
    'Irlanda', 'Isla de Man', 'Israel', 'Italia', 'Jamaica',
    'Japón', 'Jersey', 'Jordania', 'Kazajistán', 'Kenia',
    'Kiribati', 'Corea del Norte', 'Corea del Sur', 'Kuwait', 'Kirguistán',
    'Laos', 'Letonia', 'Líbano', 'Lesoto', 'Liberia',
    'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo', 'Macao',
    'Macedonia del Norte', 'Madagascar', 'Malaui', 'Malasia', 'Maldivas',
    'Malí', 'Malta', 'Islas Marshall', 'Martinica', 'Mauritania',
    'Mauricio', 'Mayotte', 'México', 'Micronesia', 'Moldavia',
    'Mónaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Marruecos',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Países Bajos', 'Nueva Caledonia', 'Nueva Zelanda', 'Nicaragua', 'Níger',
    'Nigeria', 'Niue', 'Isla Norfolk', 'Macedonia del Norte', 'Islas Marianas del Norte',
    'Noruega', 'Omán', 'Pakistán', 'Palaos', 'Palestina',
    'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Filipinas',
    'Islas Pitcairn', 'Polonia', 'Portugal', 'Puerto Rico', 'Qatar',
    'Réunion', 'Rumanía', 'Rusia', 'Ruanda', 'San Bartolomé',
    'Santa Elena', 'San Cristóbal y Nieves', 'Santa Lucía', 'San Martín', 'San Pedro y Miquelón',
    'San Vicente y las Granadinas', 'Samoa', 'San Marino', 'Santo Tomé y Príncipe', 'Arabia Saudita',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur',
    'Sint Maarten', 'Eslovaquia', 'Eslovenia', 'Islas Salomón', 'Somalia',
    'Sudáfrica', 'Georgia del Sur y las Islas Sandwich del Sur', 'España', 'Sri Lanka', 'Sudán',
    'Sudán del Sur', 'Surinam', 'Suecia', 'Suiza', 'Siria',
    'Taiwán', 'Tayikistán', 'Tanzania', 'Tailandia', 'Timor Oriental',
    'Togo', 'Tokelau', 'Tonga', 'Trinidad y Tobago', 'Túnez',
    'Turquía', 'Turkmenistán', 'Islas Turcas y Caicos', 'Tuvalu', 'Uganda',
    'Ucrania', 'Emiratos Árabes Unidos', 'Reino Unido', 'Estados Unidos', 'Uruguay',
    'Uzbekistán', 'Vanuatu', 'Venezuela', 'Vietnam', 'Islas Vírgenes Británicas',
    'Islas Vírgenes de los Estados Unidos', 'Wallis y Futuna', 'Sahara Occidental', 'Yemen', 'Zambia',
    'Zimbabue'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formService: ApiService
  ) { }


  ngOnInit(): void {
     this.userForm = this.fb.group({
      edad: [null, [Validators.required, Validators.min(0), Validators.max(120)]],
      genero: [null, Validators.required],
      nivelEstudios: [null, Validators.required],
      areaLaboral: [null, Validators.required],
      pais: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    console.log(this.userForm.value);
    this.convertToUpperCase(this.userForm.value);
    this.formService.saveParticipant(this.userForm.value).subscribe({
      next:(data:any)=>{
        this.router.navigate(['/encuesta', data.secuencialParticipante]);},
      error:(error)=>{console.log(error)}
    })
  
  }


  
convertToUpperCase(formValue: any): void {
  for (const key in formValue) {
    if (formValue.hasOwnProperty(key)) {
      const value = formValue[key];

      // Si el valor es un string, lo convertimos a mayúsculas
      if (typeof value === 'string') {
        formValue[key] = value.toUpperCase();
      }

      // Si el valor es un arreglo, aplicamos la conversión a cada elemento
      if (Array.isArray(value)) {
        formValue[key] = value.map((item) => {
          if (typeof item === 'string') {
            return item.toUpperCase();
          }
          return item;
        });
      }
    }
  }
}

 }
