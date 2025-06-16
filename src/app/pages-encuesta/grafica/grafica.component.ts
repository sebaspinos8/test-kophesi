import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert-service/aalert-service';
import { ApiService } from '../../services/api-service/api-service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import SpinnerComponent from "../../shared/spinner/spinner.component";
// import { BaseChartDirective } from 'ng2-charts';         // ← AÑADE ESTA LÍNEA
import { jsPDF } from 'jspdf';      // Importar jsPDF
import html2canvas from 'html2canvas';  // Importar html2canvas

export interface Resumen {
  labels: string[];
  data: number[];
  nivel: string[];
  textoRespuesta: string[];
}

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RadarChartComponent implements OnInit {


  public radarChartType: ChartType = 'radar';
  public radarData!: ChartConfiguration<'radar'>['data'];

  public titulo = 'Resultados del Test Kophesi';


  public chart!: Chart;

  //categorias
  public categorias: any = {};


  datos!: Resumen;

  secuencialParticipante: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private apiService: ApiService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.secuencialParticipante = +params.get('secuencialParticipante')!;
    });

    this.spinnerService.show()

    this.apiService.getResume({ secuencialParticipante: this.secuencialParticipante }).subscribe(
      (data: any) => {
        this.datos = data
        this.spinnerService.hide();
        this.radarData = {
          labels: this.datos.labels,
          datasets: [
            {
              label: '% Porcentajes por Categoría',
              data: this.datos.data,
              backgroundColor: 'rgba(48, 144, 207, 0.2)',
              borderColor: 'rgb(86, 148, 189)',
              pointStyle: 'circle',
              pointBackgroundColor: 'rgba(54,162,235,1)'
            }
          ]
        };

        this.chart = new Chart("chart", {
          type: 'radar',
          data: this.radarData,
          options: {
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 10
                },
                beginAtZero: true
              }
            },
            elements: {
              line: {
                borderWidth: 3
              }
            }
          },
        })


      },
      (error) => { console.log(EvalError) }
    );


  }

  ngAfterViewInit(): void {
    

    setTimeout(() => {
      this.generarPDF();
    }, 2000);
  }


  generarPDF() {
    const elemento = document.getElementById('pdfContent')!;
    html2canvas(elemento, { scale: 1, allowTaint: true, useCORS: true })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg',0.7)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
 
        // 1) Base64 (sin el prefijo 'data:...')
        const dataUri = pdf.output('datauristring');
        const base64PDF = dataUri.split(',')[1];
 
        // 2) Prepara tu payload
        const payload = {
          filename: 'reporte-encuesta.pdf',
          file: base64PDF,
        };
 
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        console.log({secuencialParticipante: this.secuencialParticipante, base64: base64PDF});
        this.apiService.sendResults({secuencialParticipante: this.secuencialParticipante, base64: base64PDF}).subscribe(
          {
              next:(data:any)=>{
                this.alertService.showSuccessMessage("Test finalizado, los resultados serán enviados a tu correo enseguida")
              },
              error:(error:any)=>{console.log(error)}  
          });

      })
      .catch(error => console.error('Error al generar PDF:', error));
  }




}
