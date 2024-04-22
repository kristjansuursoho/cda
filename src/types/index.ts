export interface DigiDocument {
  documentId: string
  issued: string
  due: string
  currency: string
  subtotal: string
  VAT: string
  total: string
  refNumber: string
  suppliers: Supplier[]
  VATRows: VATRow[]
  lines: Line[]
  box?: {
    [key: string]: Box
  }
  bankAccounts: string[]
}

export interface Supplier {
  name: string
  address: string
  postalCode: string
  entityId: string
  vatId: string
}

export interface VATRow {
  subtotal: string
  VAT: string
  total: string
  VATRate: string
}

export interface Line {
  code: string
  comment: string
  unit: string
  unitPrice: string
  unitPriceWithVat: string
  amount: string
  subtotal: string
  VATRate: string
  VAT: string
  total: string
}

export interface Box {
  x: number
  y: number
  w: number
  h: number
  topLeftX: number
  topLeftY: number
  topRightX: number
  topRightY: number
  bottomRightX: number
  bottomRightY: number
  bottomLeftX: number
  bottomLeftY: number
}
