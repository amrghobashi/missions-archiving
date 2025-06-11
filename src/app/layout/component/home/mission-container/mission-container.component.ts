import { Component } from '@angular/core';
import { MissionComponent } from "./mission/mission.component";
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-mission-container',
  standalone: true,
  imports: [TabsModule, MissionComponent],
  templateUrl: './mission-container.component.html',
  styleUrl: './mission-container.component.scss'
})
export class MissionContainerComponent {

}
