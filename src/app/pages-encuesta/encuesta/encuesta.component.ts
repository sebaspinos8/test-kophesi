import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertService } from '../../services/alert-service/aalert-service';
import { ApiService } from '../../services/api-service/api-service';
import SpinnerComponent from '../../shared/spinner/spinner.component';
import { SpinnerService } from '../../services/spinner/spinner.service';
//import { forEach } from 'lodash';
//import { AlertService } from '../../../services/digitalizacion-services/alert/alert.service';


export interface Pregunta {
    Secuencial: number;
    Orden: number;
    Descripcion: string;
    SecuencialCategoria: number;
    puntuacion?: number;
}

export interface TestRespuesta {
    secuencial: number;
    secuencialPregunta: number;
    secuencialParticipante: number;
    puntuacion: number;
    estaActivo: number;
}

@Component({
    selector: 'app-encuesta',
    standalone: true,
    imports: [CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './encuesta.component.html',
    styleUrl: './encuesta.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class EncuestaComponent implements OnInit {

    public submitted = false;
    public isDataLoaded = false;
    preguntas: Pregunta[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private apiService: ApiService,
        private spinnerService: SpinnerService
    ) { }

    ngOnInit(): void {
        this.spinnerService.show();
        this.route.paramMap.subscribe(params => {
            this.secuencialParticipante = +params.get('secuencialParticipante')!;
            console.log("🚀 ~ EncuestaComponent ~ ngOnInit ~ this.secuencialParticipante:", this.secuencialParticipante)
        });

        this.apiService.getQuestions().subscribe(
            (data: any) => {
                this.preguntas = data;
                this.spinnerService.hide();
            },
            (error) => { console.log(EvalError) }
        );

        

    }

    calificaciones = [1, 2, 3, 4, 5, 6];



    secuencialParticipante = this.generateRandomId();
    respuestas: TestRespuesta[] = [];

    private generateRandomId(): number {
        return Math.floor(Math.random() * 1e9);
    }

    onSubmit(): void {
        if (this.submitted) {
            return;
        }

        this.respuestas = this.preguntas.map(p => ({
            secuencial: this.generateRandomId(),
            secuencialPregunta: p.Secuencial,
            secuencialParticipante: this.secuencialParticipante,
            puntuacion: p.puntuacion ?? 0,
            estaActivo: 0
        }));


        this.respuestas.forEach(element => {
            this.apiService.saveAnswer(element).subscribe({
                 next: (data:any)=>{
                 console.log(data);},
                 error: (error:any)=>{console.log(error)}   
            });

        });

        this.alertService.showSuccessMessage("Encuesta guardada con éxito, Gracias por su colaboración")

        this.router.navigate(['/radar', this.secuencialParticipante])

        this.submitted = true;

    }

}
