import axios from 'axios'

const FRONTEND_URL = 'https://carcompare-three.vercel.app'

async function enviar({ to, subject, html }) {
  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender:   { name: 'CarCompare', email: process.env.EMAIL_USER },
    to:       [{ email: to }],
    subject,
    htmlContent: html,
  }, {
    headers: {
      'api-key':      process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    }
  })
}

export async function enviarEmailBoasVindas(email, nome) {
  await enviar({
    to:      email,
    subject: 'Bem-vindo ao CarCompare!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f8f9ff; padding: 32px; border-radius: 12px;">
        <h1 style="color: #141936; font-size: 24px; margin-bottom: 8px;">Olá, ${nome}!</h1>
        <p style="color: #46464d; font-size: 15px; line-height: 1.6;">
          Seu cadastro no <strong>CarCompare</strong> foi realizado com sucesso.
        </p>
        <p style="color: #46464d; font-size: 15px; line-height: 1.6;">
          Agora você pode buscar, comparar e salvar seus carros favoritos.
        </p>
        <div style="margin: 24px 0;">
          <a href="${FRONTEND_URL}/catalogo"
             style="background: #141936; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Explorar catálogo
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5eeff; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">CarCompare — Compare carros de forma inteligente.</p>
      </div>
    `,
  })
}

export async function enviarEmailContato(nome, email, mensagem) {
  await enviar({
    to:      process.env.EMAIL_DESTINO,
    subject: `Nova mensagem de contato — ${nome}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f8f9ff; padding: 32px; border-radius: 12px;">
        <h2 style="color: #141936;">Nova mensagem de contato</h2>
        <p style="color: #46464d;"><strong>Nome:</strong> ${nome}</p>
        <p style="color: #46464d;"><strong>Email:</strong> ${email}</p>
        <p style="color: #46464d;"><strong>Mensagem:</strong></p>
        <div style="background: white; border-radius: 8px; padding: 16px; color: #46464d; line-height: 1.6;">
          ${mensagem.replace(/\n/g, '<br/>')}
        </div>
        <hr style="border: none; border-top: 1px solid #e5eeff; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">CarCompare — mensagem enviada pelo formulário de contato.</p>
      </div>
    `,
  })
}
