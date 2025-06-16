import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export default class SpinnerComponent {

  constructor(
    public spinnerService: SpinnerService,
  ) { }

}
