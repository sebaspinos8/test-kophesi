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


  async generarPDF() {
    const elemento = document.getElementById('pdfContent')!;
 
    // 1) Configuración jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidthMM  = pdf.internal.pageSize.getWidth();
    const pageHeightMM = pdf.internal.pageSize.getHeight();
 
    // 2) Convierte ancho A4 a px (asumiendo 96dpi)
    const pxPerMm    = 96 / 25.4;
    const pageWidthPX = pageWidthMM * pxPerMm;
 
    // 3) Ancho real del elemento en px
    const elementWidthPX = elemento.scrollWidth;
 
    // 4) Scale para que html2canvas devuelva imagen de ancho ≃ pageWidthPX
    const scale = pageWidthPX / elementWidthPX;
 
    // 5) Captura con html2canvas usando ese scale
    const canvas = await html2canvas(elemento, {
      scale: scale,
      useCORS: true,
      scrollY: -window.scrollY
    });
 
    // 6) Prepara la imagen y propiedades
    const imgData  = canvas.toDataURL('image/jpeg', 0.7);
    const imgProps = (pdf as any).getImageProperties(imgData);
    const imgWidthMM  = pageWidthMM;
    const imgHeightMM = (imgProps.height * imgWidthMM) / imgProps.width;
 
    // 7) Dibuja la primera página
    let positionYMM   = 0;
    pdf.addImage(imgData, 'JPEG', 0, positionYMM, imgWidthMM, imgHeightMM);
 
    // 8) Si la imagen sobrepasa la altura, añade páginas sucesivas
    let heightLeftMM = imgHeightMM - pageHeightMM;
    while (heightLeftMM > 0) {
      positionYMM  -= pageHeightMM;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, positionYMM, imgWidthMM, imgHeightMM);
      heightLeftMM -= pageHeightMM;
    }
 
    // 9) Obtén el Base64 sin prefijo
    const dataUri    = pdf.output('datauristring');
    const base64PDF  = dataUri.split(',')[1];
 
    // 10) Envía al servidor
    this.apiService.sendResults({
      secuencialParticipante: this.secuencialParticipante,
      base64: base64PDF
    }).subscribe({
      next: (resp: any) => {
        this.alertService.showSuccessMessage(
          "Test finalizado, los resultados serán enviados a tu correo enseguida"
        );
      },
      error: (err: any) => {
        console.error('Error enviando PDF al servidor', err);
      }
    });
 
    // 11) (Opcional) abrir en nueva pestaña
    const blobUrl = pdf.output('bloburl');
    window.open(blobUrl, '_blank');
  }




}
