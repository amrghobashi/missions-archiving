import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MissionVisitService } from '../../mission-container/mission-visit/mission-visit.service';
import { Visit } from '../../../models/visit';
import { DashboardService } from '../dashboard.service';
import { Subscription } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-visit-detail',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule],
  templateUrl: './visit-detail.component.html',
  styleUrl: './visit-detail.component.scss'
})
export class VisitDetailComponent implements OnInit {
  // @Input() unitId!: string;
  // @Input() date?: string;
  subscription: Subscription = new Subscription();
  selectedUnit!: {'code': string, 'name': string, 'parent': string};
  date: string | undefined;
  arabicDate: string | undefined;
  visitList: Visit[] = [];
  loading = false;
  previewDialog = false;
  previewUrl: string | null = null;
  safePreviewUrl: any = null;
  hasImage = { 'width': '90%', 'height': '90%' };
  noImage = { 'width': '500px' };
  API_FILES = environment.API_FILES;

  constructor(private dashboardService: DashboardService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.subscription = this.dashboardService.selectedUnit.subscribe(data => {
      this.selectedUnit = data;
      this.date = '';
      this.arabicDate = '';
      this.loadVisits(this.selectedUnit.code,'');
    });
    this.subscription = this.dashboardService.selectedUnitByDate.subscribe(data => {
      this.date = data;
      this.arabicDate = this.convertDateRangeToArabic(data);
      this.loadVisits(this.selectedUnit.code, this.date);
    });
    // if (!this.unitId) {
    //   throw new Error('unitId is required');
    // }
    // this.loadVisits();
  }

  loadVisits(id: string | undefined, date: string | undefined) {
    this.loading = true;
    this.dashboardService.getVisitsByUnitId(id, date).subscribe(
      (data: Visit[]) => {
        this.visitList = data;
        console.log(data)
        this.loading = false;
      },
      () => { this.loading = false; }
    );
  }

  convertDateRangeToArabic(dateRange: string): string {
    const enToArMonths: { [key: string]: string } = {
      'Jan': 'يناير',
      'Feb': 'فبراير',
      'Mar': 'مارس',
      'Apr': 'أبريل',
      'May': 'مايو',
      'Jun': 'يونيو',
      'Jul': 'يوليو',
      'Aug': 'أغسطس',
      'Sep': 'سبتمبر',
      'Oct': 'أكتوبر',
      'Nov': 'نوفمبر',
      'Dec': 'ديسمبر'
    };
    return dateRange.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (en) => enToArMonths[en]);
}

isImage(path: string | null): boolean {
  return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
}

isPdf(path: string | null): boolean {
  return !!path && path.endsWith('.pdf');
}

  previewReport(reportPath: string, id: number) {
    this.previewUrl = this.API_FILES + reportPath;
    // this.visitId = id;
    if (this.isPdf(reportPath)) {
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
    } else {
      this.safePreviewUrl = null; // Clear if not a PDF
    }
    // this.uploadedFiles = []; // Clear previous uploaded files
    // this.filePreviewUrl = null; // Clear any previous preview
    this.previewDialog = true;
  }
}
