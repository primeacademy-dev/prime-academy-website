import { NextRequest, NextResponse } from 'next/server'

// This is a placeholder API route for handling form submissions
// You can integrate with:
// 1. Resend (recommended for production)
// 2. EmailJS (client-side alternative)
// 3. Nodemailer (if you have SMTP access)

interface EnrollmentData {
  type: 'enrollment'
  name: string
  email: string
  phone: string
  course: string
  message?: string
}

interface ContactData {
  type: 'contact'
  name: string
  email: string
  phone?: string
  course?: string
  message: string
}

type FormData = EnrollmentData | ContactData

export async function POST(request: NextRequest) {
  try {
    let data: Partial<FormData>

    try {
      data = (await request.json()) as Partial<FormData>
    } catch {
      return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 })
    }
    const email = typeof data.email === 'string' ? data.email.trim() : ''
    const name = typeof data.name === 'string' ? data.name.trim() : ''

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Nome e email válidos são obrigatórios' },
        { status: 400 }
      )
    }

    if (data.type !== 'contact' && data.type !== 'enrollment') {
      return NextResponse.json({ error: 'Tipo de formulário inválido' }, { status: 400 })
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim()
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim()
    const templateId = (
      data.type === 'enrollment'
        ? process.env.NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
        : process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    )?.trim()

    if (!serviceId || !publicKey || !templateId) {
      return NextResponse.json(
        { error: 'O serviço de email não está configurado.' },
        { status: 503 }
      )
    }

    const templateParams = {
      to_email: 'comercialprimeacademy@gmail.com',
      to_name: 'Prime Academy',
      type: data.type,
      name,
      from_name: name,
      email,
      user_email: email,
      reply_to: email,
      phone: typeof data.phone === 'string' ? data.phone.trim() : 'Não fornecido',
      course: typeof data.course === 'string' ? data.course.trim() : 'N/A',
      message: typeof data.message === 'string' ? data.message.trim() : 'Sem mensagem adicional',
    }

    const emailjsPayload: Record<string, unknown> = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }

    // Only send the private key when explicitly configured; undefined values are
    // omitted by JSON.stringify and can make EmailJS reject the request.
    if (process.env.EMAILJS_PRIVATE_KEY) {
      emailjsPayload.accessToken = process.env.EMAILJS_PRIVATE_KEY
    }

    let response: Response

    try {
      response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailjsPayload),
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      })
    } catch (error) {
      console.error('[send-email] EmailJS request failed', error)
      return NextResponse.json(
        { error: 'O serviço de email está temporariamente indisponível.' },
        { status: 502 }
      )
    }

    if (!response.ok) {
      const errorText = (await response.text()).slice(0, 500)
      console.error('[send-email] EmailJS rejected request', response.status, errorText)
      return NextResponse.json(
        { error: 'Não foi possível enviar o email. Tente novamente.' },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: data.type === 'enrollment' ? 'Inscrição recebida com sucesso!' : 'Mensagem enviada com sucesso!',
    })
  } catch (error) {
    console.error('[send-email] Unexpected error', error)
    return NextResponse.json(
      { error: 'Erro ao processar o pedido. Tente novamente.' },
      { status: 500 }
    )
  }
}
