export interface SearchPayment {
  cuscode : string
    , payNo : string
    , bank : string
    , card : string
    , creusr : string
    , credateFrom: string
    , credateTo: string
    , status : string
    , page_start : number
    , page_limit : number
  }

export interface SearchPaymentDetail {
    hdrid : string
    , page_start : number
    , page_limit : number
  }