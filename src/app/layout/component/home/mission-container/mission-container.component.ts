import { Component } from '@angular/core';
import { MissionComponent } from "./mission/mission.component";

@Component({
  selector: 'app-mission-container',
  imports: [MissionComponent],
  templateUrl: './mission-container.component.html',
  styleUrl: './mission-container.component.scss'
})
export class MissionContainerComponent {

}
