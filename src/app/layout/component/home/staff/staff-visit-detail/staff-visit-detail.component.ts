import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { StaffService } from '../staff.service';
import { Visit } from '../../../models/visit';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-staff-visit-detail',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './staff-visit-detail.component.html',
  styleUrl: './staff-visit-detail.component.scss'
})
export class StaffVisitDetailComponent implements OnChanges {
  @Input() staffId: number | null = null;

  visitList: Visit[] = [];
  loading = false;
  previewDialog = false;
  previewUrl: string | null = null;
  safePreviewUrl: any = null;
  hasImage = { width: '90%', height: '90%' };
  noImage = { width: '500px' };
  API_FILES = environment.API_FILES;

  constructor(private staffService: StaffService, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['staffId']) {
      if (this.staffId) {
        this.loadVisits(this.staffId);
      } else {
        this.visitList = [];
      }
    }
  }

  loadVisits(staffId: number | null) {
    if (!staffId) {
      this.visitList = [];
      return;
    }

    this.loading = true;
    this.staffService.getVisitsByStaffId(staffId).subscribe(
      (data: Visit[]) => {
        this.visitList = data.map(visit => ({
          ...visit,
          visit_date: this.parseDate(visit.visit_date)
        }));
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.visitList = [];
      }
    );
  }

  formatDate(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return this.formatDateObject(value);
    }

    const parsed = this.parseDate(value);
    return parsed instanceof Date ? this.formatDateObject(parsed) : value.toString();
  }

  parseDate(value: string | Date | undefined): Date | string | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    const normalized = value.trim();
    const ddmmyyyy = /^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/;
    const match = normalized.match(ddmmyyyy);

    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      return new Date(year, month, day);
    }

    const date = new Date(normalized);
    return isNaN(date.getTime()) ? value : date;
  }

  formatDateObject(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatTime(value: string | Date | undefined): string {
    if (!value) {
      return '';
    }

    if (value instanceof Date) {
      return value.toTimeString().slice(0, 5);
    }

    return value.toString().slice(0, 5);
  }

  isImage(path: string | null): boolean {
    return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
  }

  isPdf(path: string | null): boolean {
    return !!path && path.endsWith('.pdf');
  }

  previewReport(reportPath: string) {
    this.previewUrl = this.API_FILES + reportPath;

    if (this.isPdf(reportPath)) {
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
    } else {
      this.safePreviewUrl = null;
    }

    this.previewDialog = true;
  }
}
