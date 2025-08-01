import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MissionCarService } from './mission-car.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Car, MissionCar } from '../../../models/car';
import { SelectModule } from 'primeng/select';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-mission-car',
  standalone: true,
  imports: [TableModule, ButtonModule, DialogModule, FormsModule, InputTextModule,
    SelectModule, ConfirmDialogModule, ToastModule, NgxSpinnerModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './mission-car.component.html',
  styleUrl: './mission-car.component.scss'
})
export class MissionCarComponent implements OnChanges {
  @Input() missionId: string | undefined;

  carList: MissionCar[] = [];
  displayDialog = false;
  isEditMode = false;
  newCar: MissionCar = { id: 0, mission_id: '' };
  subscription: Subscription = new Subscription;
  carOptions: { id: number; name: string; label: string }[] = [];

  constructor(private carService: MissionCarService, private confirmationService: ConfirmationService, private messageService: MessageService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    // Initial load of car options
    // this.getCarList();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['missionId'] && this.missionId) {
      this.spinner.show();
      this.loadCarsForMission(this.missionId);
    } else if (changes['missionId'] && !this.missionId) {
      this.carList = [];
    }
  }

  loadCarsForMission(missionId: string) {
    this.spinner.show();
    this.carService.getCarsByMissionId(missionId).subscribe(
      (data: MissionCar[]) => { 
        this.carList = data; 
        this.spinner.hide();
        console.log('Cars for mission loaded:', data);
      },
      (error: any) => { this.spinner.hide(); console.error('Error fetching cars for mission:', error); }
    );
  }

  getCarList() {
    this.spinner.show();
    this.subscription = this.carService.getCars().subscribe((cars: Car[]) => {
      this.carOptions = cars.map(car => ({
        id: car.id,
        name: car.name,
        label: car.name + ' (' + car.id + ')'
      }));
      this.spinner.hide();
      console.log('Cars fetched successfully:', this.carOptions);
    }, (error: any) => {
      this.spinner.hide();
      console.error('Error fetching cars:', error);
    });
  }

  getCarOptions() {
    // this.spinner.show();
    this.subscription = this.carService.getCars(this.missionId).subscribe((cars: Car[]) => {
      this.carOptions = cars.map(car => ({
        id: car.id,
        name: car.name,
        label: car.name + ' (' + car.id + ')'
      }));
      // this.spinner.hide();
    }, (error: any) => {
      this.spinner.hide();
    });
  }

  onAddCar() {
    this.isEditMode = false;
    this.displayDialog = true;
    this.newCar = { id: 0, mission_id: this.missionId };
    this.getCarOptions();
  }

  onEditCar(car: MissionCar) {
    this.getCarList();
    this.newCar = { ...car };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  saveCar() {
    if (this.isEditMode) {
      this.carService.updateCar(this.newCar).subscribe(
        () => {
          this.loadCarsForMission(this.missionId!);
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Car updated successfully' });
        },
        (error: any) => { console.error('Error updating car:', error); }
      );
    } else {
      this.carService.addCar({ ...this.newCar, mission_id: this.missionId }).subscribe(
        () => {
          this.loadCarsForMission(this.missionId!);
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Car added successfully' });
        },
        (error: any) => { console.error('Error adding car:', error); }
      );
    }
  }

  confirmDeleteCar(car: MissionCar) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Delete Confirmation',
      icon: 'pi pi-success-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => { this.onDeleteCar(car.id); },
      reject: () => {}
    });
  }

  onDeleteCar(id: number) {
    this.carService.deleteCar(id).subscribe(
      () => {
        this.loadCarsForMission(this.missionId!);
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Car deleted successfully' });
      },
      (error: any) => { console.error('Error deleting car:', error); }
    );
  }

  cancelDialog() {
    this.displayDialog = false;
  }
}
