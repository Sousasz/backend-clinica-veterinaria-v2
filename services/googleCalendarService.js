const { google } = require('googleapis');

/**
 * Serviço mínimo para inserir eventos no Google Calendar via Service Account (JWT)
 * Expects env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID
 */
async function createEvent({ summary, description, startDateTime, endDateTime }) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    console.warn('Google Calendar not configured (missing env). Skipping calendar event creation.');
    return null;
  }

  try {
    // private key stored in env often with \n escaped — convert to real newlines
    const key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const event = {
      summary: summary || 'Agendamento',
      description: description || '',
      start: { dateTime: new Date(startDateTime).toISOString() },
      end: { dateTime: new Date(endDateTime).toISOString() },
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
    });

    if (response && response.data && response.data.id) {
      return { id: response.data.id, htmlLink: response.data.htmlLink };
    }

    return null;
  } catch (error) {
    console.error('Erro criando evento no Google Calendar:', error.message || error);
    return null;
  }
}

module.exports = { createEvent };
