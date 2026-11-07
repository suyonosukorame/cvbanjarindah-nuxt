/**
 * useCurrency Composable
 * Handle Indonesian Rupiah formatting and parsing
 */

export function useCurrency() {
  /**
   * Format number to Rupiah string
   * Example: 1500000 → "Rp 1.500.000"
   */
  function formatRupiah(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return 'Rp 0'
    
    const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : Math.floor(value)
    
    if (isNaN(num)) return 'Rp 0'
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }
  
  /**
   * Format number to display (with thousand separators, no currency)
   * Example: 1500000 → "1.500.000"
   */
  function formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '0'
    
    const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : Math.floor(value)
    
    if (isNaN(num)) return '0'
    
    return new Intl.NumberFormat('id-ID').format(num)
  }
  
  /**
   * Parse display value back to number
   * Example: "1.500.000" → 1500000
   */
  function parseRupiah(value: string | number | null | undefined): number {
    if (value === null || value === undefined || value === '') return 0
    
    // Remove all non-digit characters
    const cleaned = String(value).replace(/\D/g, '')
    
    return parseInt(cleaned) || 0
  }
  
  /**
   * Smart input handler - formats while typing
   * Handles: paste, manual typing, delete, etc.
   */
  function handleInput(event: Event): number {
    const target = event.target as HTMLInputElement
    const input = target.value
    
    // Parse the input to get numeric value
    const parsed = parseRupiah(input)
    
    // Update display (formatted)
    target.value = formatNumber(parsed)
    
    // Return the numeric value for v-model
    return parsed
  }
  
  /**
   * Format for display when leaving input
   */
  function formatOnBlur(value: number): string {
    return formatNumber(value)
  }
  
  return {
    formatRupiah,
    formatNumber,
    parseRupiah,
    handleInput,
    formatOnBlur,
  }
}
