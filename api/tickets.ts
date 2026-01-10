import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://purbzxxjgdumubhbjahf.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export default async function handler(req: any, res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') return res.status(200).end()

    const { action, userId, ticketId, subject, category, message } = req.body || {}

    try {
        // GET TICKETS
        if (req.method === 'GET' || action === 'list') {
            const uid = req.query?.userId || userId
            if (!uid) return res.status(400).json({ error: 'User ID required' })

            const { data, error } = await supabase
                .from('tickets')
                .select('*, ticket_messages(count)')
                .eq('user_id', uid)
                .order('created_at', { ascending: false })

            if (error) throw error
            return res.status(200).json({ success: true, tickets: data })
        }

        // CREATE TICKET
        if (action === 'create') {
            if (!userId || !subject || !message) {
                return res.status(400).json({ error: 'Missing required fields' })
            }

            // Create ticket
            const { data: ticket, error: ticketError } = await supabase
                .from('tickets')
                .insert({
                    user_id: userId,
                    subject,
                    category: category || 'general',
                    status: 'open'
                })
                .select()
                .single()

            if (ticketError) throw ticketError

            // Add first message
            const { error: msgError } = await supabase
                .from('ticket_messages')
                .insert({
                    ticket_id: ticket.id,
                    user_id: userId,
                    message,
                    is_staff: false
                })

            if (msgError) throw msgError

            return res.status(200).json({ success: true, ticket })
        }

        // GET TICKET DETAILS
        if (action === 'get') {
            if (!ticketId) return res.status(400).json({ error: 'Ticket ID required' })

            const { data: ticket, error: ticketError } = await supabase
                .from('tickets')
                .select('*')
                .eq('id', ticketId)
                .single()

            if (ticketError) throw ticketError

            const { data: messages, error: msgError } = await supabase
                .from('ticket_messages')
                .select('*, profiles(username, discord_avatar)')
                .eq('ticket_id', ticketId)
                .order('created_at', { ascending: true })

            if (msgError) throw msgError

            return res.status(200).json({ success: true, ticket, messages })
        }

        // ADD MESSAGE
        if (action === 'reply') {
            if (!ticketId || !userId || !message) {
                return res.status(400).json({ error: 'Missing required fields' })
            }

            const { error } = await supabase
                .from('ticket_messages')
                .insert({
                    ticket_id: ticketId,
                    user_id: userId,
                    message,
                    is_staff: false
                })

            if (error) throw error

            // Update ticket timestamp
            await supabase
                .from('tickets')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', ticketId)

            return res.status(200).json({ success: true })
        }

        // CLOSE TICKET
        if (action === 'close') {
            if (!ticketId) return res.status(400).json({ error: 'Ticket ID required' })

            const { error } = await supabase
                .from('tickets')
                .update({
                    status: 'closed',
                    closed_at: new Date().toISOString()
                })
                .eq('id', ticketId)

            if (error) throw error
            return res.status(200).json({ success: true })
        }

        return res.status(400).json({ error: 'Invalid action' })

    } catch (e: any) {
        console.error('Tickets API error:', e)
        return res.status(500).json({ error: 'Server error', details: e.message })
    }
}
