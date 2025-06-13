import { Component } from '@angular/core';
import { MissionComponent } from "./mission/mission.component";
import { TabsModule } from 'primeng/tabs';
import { MissionService } from './mission/mission.service';
import { Mission } from '../../models/mission';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission-container',
  standalone: true,
  imports: [TabsModule, MissionComponent, CommonModule],
  templateUrl: './mission-container.component.html',
  styleUrl: './mission-container.component.scss'
})
export class MissionContainerComponent {
    constructor(private missionService: MissionService ) { }
    mission: Mission | undefined;
    tabsHeader = '';

    ngOnInit() {
        this.missionService.selectedMission.subscribe((mission) => {
          if(mission) {
            this.mission = mission;
            this.tabsHeader = 'مهمة رقم ' + mission.id + ' في ' + mission.zone_name + ' في الفترة من ' + mission.start_date + ' إلى ' + mission.end_date;
          } else {
            this.mission = undefined
            this.tabsHeader = '';
          }
        });
    }
    
}
