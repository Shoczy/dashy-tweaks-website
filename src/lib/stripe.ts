// Stripe configuration
// Replace with your actual Stripe publishable key
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_STRIPE_KEY'

// Price IDs from your Stripe Dashboard
export const PRICES = {
    monthly: 'price_monthly_id', // Replace with actual price ID
    lifetime: 'price_lifetime_id' // Replace with actual price ID
}

// Create checkout session via your backend or Stripe Payment Links
export async function createCheckoutSession(priceId: string, userId: string, email: string) {
    // Option 1: Use Stripe Payment Links (easiest - no backend needed)
    // Just redirect to your Stripe Payment Link with prefilled email

    // Option 2: Use Supabase Edge Function (recommended)
    // This creates a proper checkout session with customer metadata

    const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, email })
    })

    if (!response.ok) throw new Error('Failed to create checkout session')

    const { url } = await response.json()
    return url
}

// Stripe Payment Links
export const PAYMENT_LINKS = {
    monthly: 'https://buy.stripe.com/test_28EeVcgSO0ype5hdHjabK00',
    lifetime: 'https://buy.stripe.com/test_7sYbJ08mi0ypd1d1YBabK01'
}

export function getPaymentLink(plan: 'monthly' | 'lifetime', email?: string) {
    const baseUrl = PAYMENT_LINKS[plan]
    if (email) {
        return `${baseUrl}?prefilled_email=${encodeURIComponent(email)}`
    }
    return baseUrl
}
