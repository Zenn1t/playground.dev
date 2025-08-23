import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

interface ContactFormData {
  name: string;
  contact: string;
  message: string;
  messageHtml: string;
  contactType: 'email' | 'phone' | null;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function sendTelegramMessage(data: ContactFormData): Promise<boolean> {
  try {
    const messageText = htmlToText(data.messageHtml || data.message);
    const contactIcon = data.contactType === 'phone' ? '📱' : '📧';
    
    const telegramMessage = `
🔔 <b>New message from website!</b>

👤 <b>Name:</b> ${escapeHtml(data.name)}
${contactIcon} <b>Contact:</b> <code>${escapeHtml(data.contact)}</code>
📝 <b>Type:</b> ${data.contactType === 'phone' ? 'Phone' : 'Email'}

💬 <b>Message:</b>
${escapeHtml(messageText)}

⏰ <i>${new Date().toLocaleString('en-US', { 
      timeZone: 'Europe/Moscow',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</i>`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const result = await response.json();
    
    if (!result.ok) {
      console.error('Telegram API error:', result);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.contact || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const success = await sendTelegramMessage(data);

    if (success) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message sent successfully' 
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      status: 'Contact API is working',
      configured: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)
    },
    { status: 200 }
  );
}