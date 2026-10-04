import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const recipient = 'comercialprimeacademy@gmail.com'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function textValue(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 5000) : fallback
}

function senderAddress() {
  const domain = process.env.RESEND_EMAIL_DOMAIN?.trim()
  return domain ? `Prime Academy <noreply@${domain}>` : ''
}

function makeIdempotencyKey() {
  // Cada envio do formulário é uma nova intenção. O conteúdo não pode compor
  // a chave, porque duas submissões legítimas iguais causariam conflito 409.
  return `form-submission/${crypto.randomUUID()}`
}

function emailHtml(data: FormData) {
  const phone = textValue(data.phone, 'Não fornecido')
  const course = textValue(data.course, 'N/A')
  const message = textValue(data.message, 'Sem mensagem adicional')

  return `
    <h2>${data.type === 'enrollment' ? 'Nova inscrição' : 'Nova mensagem de contacto'}</h2>
    <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Curso:</strong> ${escapeHtml(course)}</p>
    <p><strong>Mensagem:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
  `
}

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

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const from = senderAddress()
    if (!process.env.RESEND_API_KEY || !from) {
      return NextResponse.json(
        { error: 'O serviço de email não está configurado.' },
        { status: 503 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const formData = {
      type: data.type,
      name,
      email,
      phone: textValue(data.phone, 'Não fornecido'),
      course: textValue(data.course, 'N/A'),
      message: textValue(data.message, 'Sem mensagem adicional'),
    } as FormData

    const { data: sentEmail, error } = await resend.emails.send(
      {
        from,
        to: [recipient],
        replyTo: email,
        subject: formData.type === 'enrollment'
          ? `Nova inscrição — ${formData.course}`
          : `Novo contacto — ${formData.name}`,
        html: emailHtml(formData),
        text: [
          `Nome: ${formData.name}`,
          `Email: ${formData.email}`,
          `Telefone: ${formData.phone}`,
          `Curso: ${formData.course}`,
          `Mensagem: ${formData.message}`,
        ].join('\n'),
      },
      { idempotencyKey: makeIdempotencyKey(formData) },
    )

    if (error) {
      console.error('[send-email] Resend rejected request', error.name, error.message)
      return NextResponse.json(
        { error: 'Não foi possível enviar o email. Tente novamente.' },
        { status: 502 }
      )
    }

    console.info('[send-email] Email sent', sentEmail?.id)

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
