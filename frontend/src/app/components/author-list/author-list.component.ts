import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="page-wrapper">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Авторы</mat-card-title>
          <span class="spacer"></span>
          <button mat-raised-button color="primary" routerLink="/authors/new">
            <mat-icon>add</mat-icon>
            Добавить автора
          </button>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="authors" class="full-width">

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Имя автора </th>
              <td mat-cell *matCellDef="let author"> <b>{{author.name}}</b> </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> </th>
              <td mat-cell *matCellDef="let author">
                <div class="action-buttons">
                  
                  <a mat-icon-button color="primary" [routerLink]="['/authors/edit', author.id]" matTooltip="Редактировать">
                    <mat-icon>edit</mat-icon>
                  </a>

                  <button mat-icon-button color="warn" (click)="onDelete(author.id)" matTooltip="Удалить">
                    <mat-icon>delete</mat-icon>
                  </button>

                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="['name', 'actions']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['name', 'actions'];"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 24px; max-width: 1000px; margin: 0 auto; }
    .full-width { width: 100%; }
    mat-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
    mat-chip { --mdc-chip-label-text-size: 12px; min-height: 24px; }
    .action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
    .mat-column-actions { text-align: right; width: 120px; }
    .spacer { flex: 1 1 auto; }
    mat-card-header { display: flex; align-items: center; margin-bottom: 16px; }
  `]
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];

  constructor(private authorService: AuthorService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.authorService.getAll().subscribe(data => {
      this.authors = data;
      this.cdr.detectChanges();
    });
  }

  onDelete(id: number) {
    if (confirm('Удалить автора?')) {
      this.authorService.delete(id).subscribe({
        next: () => this.load(),
        error: (err) => console.error('Ошибка при удалении:', err)
      });
    }
  }
}