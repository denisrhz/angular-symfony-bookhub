import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatChipsModule
  ],
  template: `
    <div class="page-wrapper">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Книги</mat-card-title>
          <span class="spacer"></span>
          <button mat-raised-button color="primary" routerLink="/books/new">
            <mat-icon>library_add</mat-icon>
            Добавить книгу
          </button>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="books" class="full-width">
            
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef> Название </th>
              <td mat-cell *matCellDef="let book"> 
                <b>{{book.title}}</b> 
              </td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef> Описание </th>
              <td mat-cell *matCellDef="let book"> 
                <b>{{book.description}}</b> 
              </td>
            </ng-container>

            <ng-container matColumnDef="authors">
              <th mat-header-cell *matHeaderCellDef> Авторы </th>
              <td mat-cell *matCellDef="let book">
                <mat-chip-set>
                  <mat-chip *ngFor="let author of book.authors">
                    {{author.name}}
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> </th>
              <td mat-cell *matCellDef="let book">
                <div class="action-buttons">
                  
                  <a mat-icon-button color="primary" [routerLink]="['/books/edit', book.id]" matTooltip="Редактировать">
                    <mat-icon>edit</mat-icon>
                  </a>

                  <button mat-icon-button color="warn" (click)="deleteBook(book.id!)" matTooltip="Удалить">
                    <mat-icon>delete</mat-icon>
                  </button>

                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="['title', 'description', 'authors', 'actions']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['title', 'description', 'authors', 'actions'];"></tr>
          </table>

          <div *ngIf="books.length === 0" style="text-align: center; padding: 20px; color: gray;">
            Книг пока нет. Попробуйте добавить новую.
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 24px; max-width: 1000px; margin: 0 auto; }
    .full-width { width: 100%; }
    mat-card { border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
    mat-chip { --mdc-chip-label-text-size: 12px; min-height: 24px; }
    .mat-column-actions { width: 120px; text-align: right; }
    .action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
    .spacer { flex: 1 1 auto; }
    mat-card-header { display: flex; align-items: center; margin-bottom: 16px; }
  `]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAll().subscribe(data => {
      this.books = data;
      this.cdr.detectChanges();
    });
  }

  deleteBook(id: number) {
    if (confirm('Удалить книгу?')) {
      this.bookService.delete(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }
}