export type PayloadType = {
  targetAmount: string
  targetCurrency: string
  currency: string
  returnUrl: string
  notifyUrl: string
  primaryColor: string
  secondaryColor: string
  format: string
  email: string
  externalId: string
  firstName: string
  lastName: string
  countryOfResidence: string
  nameType: string
}

export type SignatureResponse = {
  message?: string
  signature?: string
}
