// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let transporter;

// Initialize transporter (Ethereal for testing OR real SMTP)
(async function initMailer() {
  try {
    if (process.env.USE_ETHEREAL === 'true') {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      console.log('Using Ethereal test account. Preview messages from the response previewUrl.');
      console.log('Ethereal user:', testAccount.user);
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: (process.env.SMTP_SECURE === 'true'),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // optional: verify connection configuration
    await transporter.verify();
    console.log('Mailer is ready');
  } catch (err) {
    console.error('Mailer initialization error:', err);
    // Do not exit; route will return error if transporter undefined
  }
})();

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// POST /contact route with server-side validation
app.post('/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be at least 10 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    if (!transporter) {
      return res.status(500).json({ success: false, error: 'Mailer not configured. Check server logs.' });
    }

    const { name, email, message } = req.body;

    const mailOptions = {
      from: `"${escapeHtml(name)}" <${escapeHtml(email)}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${escapeHtml(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
             <p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent:', info.messageId);

      const response = { success: true };
      if (process.env.USE_ETHEREAL === 'true') {
        // preview URL for Ethereal (for testing)
        const preview = nodemailer.getTestMessageUrl(info);
        response.previewUrl = preview;
        console.log('Preview URL:', preview);
      }

      return res.json(response);
    } catch (err) {
      console.error('SendMail error:', err);
      return res.status(500).json({ success: false, error: 'Failed to send message. Try again later.' });
    }
  }
);

// optional: health route
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
