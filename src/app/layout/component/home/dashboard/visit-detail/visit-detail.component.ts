import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Visit } from '../../../models/visit';
import { DashboardService } from '../dashboard.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-visit-detail',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, TagModule, TooltipModule],
  templateUrl: './visit-detail.component.html',
  styleUrl: './visit-detail.component.scss'
})
export class VisitDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  selectedUnit: { code: string; name: string; parent: string } | null = null;
  date: string | undefined;
  arabicDate: string | undefined;
  visitList: Visit[] = [];
  loading = false;
  previewDialog = false;
  previewUrl: string | null = null;
  safePreviewUrl: any = null;
  hasImage = { width: '90%', height: '90%' };
  noImage = { width: '500px' };
  API_FILES = environment.API_FILES;

  constructor(
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.dashboardService.selectedUnit.subscribe((data) => {
        this.selectedUnit = data;
        this.date = '';
        this.arabicDate = '';
        if (data && data.code) {
          this.loadVisits(data.code, '');
        }
      })
    );

    this.subscription.add(
      this.dashboardService.selectedUnitByDate.subscribe((data) => {
        this.date = data;
        this.arabicDate = this.convertDateRangeToArabic(data);
        if (this.selectedUnit && this.selectedUnit.code) {
          this.loadVisits(this.selectedUnit.code, this.date);
        }
      })
    );
  }

  loadVisits(id: string | undefined, date: string | undefined): void {
    this.loading = true;
    this.dashboardService.getVisitsByUnitId(id, date).subscribe({
      next: (data: Visit[]) => {
        this.visitList = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching unit visit records:', err);
      }
    });
  }

  clearDateFilter(): void {
    this.date = '';
    this.arabicDate = '';
    if (this.selectedUnit && this.selectedUnit.code) {
      this.loadVisits(this.selectedUnit.code, '');
    }
  }

  convertDateRangeToArabic(dateRange: string): string {
    const enToArMonths: { [key: string]: string } = {
      Jan: 'Jan',
      Feb: 'Feb',
      Mar: 'Mar',
      Apr: 'Apr',
      May: 'May',
      Jun: 'Jun',
      Jul: 'Jul',
      Aug: 'Aug',
      Sep: 'Sep',
      Oct: 'Oct',
      Nov: 'Nov',
      Dec: 'Dec'
    };
    return dateRange.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (en) => enToArMonths[en]);
  }

  isImage(path: string | null): boolean {
    return !!path && (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif'));
  }

  isPdf(path: string | null): boolean {
    return !!path && path.endsWith('.pdf');
  }

  previewReport(reportPath: string, id: number): void {
    this.previewUrl = this.API_FILES + reportPath;
    if (this.isPdf(reportPath)) {
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
    } else {
      this.safePreviewUrl = null;
    }
    this.previewDialog = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
