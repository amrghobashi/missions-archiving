import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MissionBattelionService } from './mission-battelion.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MissionBattelion, Battelion } from '../../../models/battelion';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-mission-battelion',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule, SelectModule, ConfirmDialogModule, ToastModule, NgxSpinnerModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mission-battelion.component.html',
  styleUrl: './mission-battelion.component.scss'
})
export class MissionBattelionComponent implements OnChanges {
  @Input() missionId: string | undefined;
  @ViewChild('selectRef') selectRef!: Select;

  battelionList: MissionBattelion[] = [];
  displayDialog = false;
  isEditMode = false;
  newBattelion: MissionBattelion = { id: 0, mission_id: '' };
  battelionOptions: { id: number; name: string; label: string }[] = [];

  constructor(private battelionService: MissionBattelionService, private confirmationService: ConfirmationService, private messageService: MessageService, private spinner: NgxSpinnerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['missionId'] && this.missionId) {
      this.spinner.show();
      this.loadBattelionsForMission(this.missionId);
    } else if (changes['missionId'] && !this.missionId) {
      this.battelionList = [];
    }
  }

  loadBattelionsForMission(missionId: string) {
    this.spinner.show();
    this.battelionService.getBattelionsByMissionId(missionId).subscribe(
      (data: MissionBattelion[]) => { this.battelionList = data; this.spinner.hide(); },
      (error: any) => { this.spinner.hide(); console.error('Error fetching battelions for mission:', error); }
    );
  }

  getBattelionOptions() {
    // this.spinner.show();
    this.battelionService.getBattelions(this.missionId).subscribe((battelions: Battelion[]) => {
      this.battelionOptions = battelions.map(bat => ({
        id: bat.id,
        name: bat.name,
        label: bat.name + ' (' + bat.id + ')'
      }));
      this.selectRef.show();
      // this.spinner.hide();
    }, (error: any) => { this.spinner.hide(); });
  }

  onAddBattelion() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.newBattelion = { id: 0, mission_id: this.missionId };
    this.getBattelionOptions();
  }

  onEditBattelion(battelion: MissionBattelion) {
    this.isEditMode = true;
    this.displayDialog = true;
    this.newBattelion = { ...battelion };
    this.getBattelionOptions();
  }

  saveBattelion() {
    if (this.isEditMode) {
      this.battelionService.updateBattelion(this.newBattelion).subscribe(
        () => {
          this.loadBattelionsForMission(this.missionId!);
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم تعديل الكتيبة بنجاح' });
        },
        (error: any) => { console.error('Error updating battelion:', error); }
      );
    } else {
      this.battelionService.addBattelion({ ...this.newBattelion, mission_id: this.missionId }).subscribe(
        () => {
          this.loadBattelionsForMission(this.missionId!);
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تمت إضافة الكتيبة بنجاح' });
        },
        (error: any) => { console.error('Error adding battelion:', error); }
      );
    }
  }

  confirmDeleteBattelion(battelion: MissionBattelion) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد أنك تريد حذف هذه الكتيبة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-info-circle',
      rejectLabel: 'إلغاء',
      rejectButtonProps: { label: 'إلغاء', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'حذف', severity: 'danger' },
      accept: () => { this.onDeleteBattelion(battelion.id); },
      reject: () => {}
    });
  }

  onDeleteBattelion(id: number) {
    this.battelionService.deleteBattelion(id).subscribe(
      () => {
        this.loadBattelionsForMission(this.missionId!);
        this.messageService.add({ severity: 'success', summary: 'تم', detail: 'تم حذف الكتيبة' });
      },
      (error: any) => { console.error('Error deleting battelion:', error); }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
