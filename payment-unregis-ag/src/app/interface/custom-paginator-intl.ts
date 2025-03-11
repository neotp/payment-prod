import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Data/Page';
  override nextPageLabel = 'Next page';
  override previousPageLabel = 'Previous page';
  override firstPageLabel = 'First page';
  override lastPageLabel = 'Last page';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `Row ${start} - ${end} of ${length}`;
  };
}
