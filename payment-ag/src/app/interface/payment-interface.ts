export interface SearchInv {
    customer_code: string,
    invno: string,
  }

export interface FindCusCode {
      username: string
  }

export interface GetInv {
      usrcuscode: string
  }

export interface InvoiceData {
    selected: boolean
    docType: string
    docNo: string
    docDate: string
    dueDate: string
    docAmt: string
    balAmt: string
    stat:string
}