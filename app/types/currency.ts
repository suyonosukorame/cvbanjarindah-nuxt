/**
 * Currency Types
 * For Indonesian Rupiah handling
 */

export interface CurrencyFormatOptions {
  locale?: string
  currency?: string
  showDecimal?: boolean
}

export type CurrencyInput = number | string | null | undefined
