export type PayloadType = {
  targetAmount: string
  targetCurrency: string
  currency: string
  returnUrl: string
  notifyUrl: string
  primaryColor: string
  secondaryColor: string
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

export type FormValues = {
  targetAmount: string
  targetCurrency: string
  currency: string
  email: string
  firstName: string
  lastName: string
  countryOfResidence: string
  locale?: string
}
