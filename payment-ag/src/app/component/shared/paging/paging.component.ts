import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-paging',
  imports:[
      CommonModule
      , FormsModule
      , MatFormFieldModule
      , MatSelectModule
  ],
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.css']
})
export class PagingComponent implements OnChanges {
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 1;
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];

  @Output() pageChanged = new EventEmitter<{ pageStart: number, pageLimit: number }>();

  totalPages: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;

  ngOnChanges() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.startIndex = (this.pageIndex - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.totalRecords);
  }

  changePageSize(event: Event) {  
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected page size:', selectedValue);
    this.pageSize = Number(selectedValue);
    this.pageIndex = 1;
    this.updatePagination();
    this.emitPageChange();
  }

  goToPage(page: number) {
    if (page < 1) this.pageIndex = 1;
    else if (page > this.totalPages) this.pageIndex = this.totalPages;
    else this.pageIndex = page;
    this.updatePagination();
    this.emitPageChange();
  }

  firstPage() {
    this.pageIndex = 1;
    this.updatePagination();
    this.emitPageChange();
  }

  lastPage() {
    this.pageIndex = this.totalPages;
    this.updatePagination();
    this.emitPageChange();
  }

  prevPage() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.updatePagination();
      this.emitPageChange();
    }
  }

  nextPage() {
    if (this.pageIndex < this.totalPages) {
      this.pageIndex++;
      this.updatePagination();
      this.emitPageChange();
    }
  }

  emitPageChange() {
    this.pageChanged.emit({
      pageStart: this.pageIndex,
      pageLimit: this.pageSize
    });
  }
}
