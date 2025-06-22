import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car',
  imports: [ToggleSwitch, CommonModule, FormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent {
checked = true;
}
