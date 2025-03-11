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

export interface paymentForm {
    merchantId: string
    amount: string
    orderRef: string
    currCode: string
    successUrl: string
    failUrl: string
    cancelUrl: string
    payType: string
    lang: string
    TxType: string
    Term: string
    promotionType: string
    supplierId: string
    productId: string
    serialNo: string
    model: string
    itemTotal: string
    redeemPoint: string
    paymentSkip: string
    memberPay_service: string
    memberPay_memberId: string
    secureHash: string
}