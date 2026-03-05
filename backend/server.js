require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/send-confirmation', (req, res) => {
    const { fullName, email, bookingId, roomType, checkIn, checkOut, guestCount, phoneNumber, siteOrigin } = req.body;

    const mailOptions = {
        from: `"The Grand Valora" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your Luxury Stay is Reserved - Ref: ${bookingId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { margin: 0; padding: 0; background-color: #f0f2f1; font-family: 'Helvetica Neue', Arial, sans-serif; }
                    .email-wrapper { width: 100%; background-color: #f0f2f1; padding: 40px 0; }
                    .email-card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 10px 30px rgba(10,42,36,0.08); overflow: hidden; }
                    
                    .header-accent { height: 4px; background-color: #c5a059; }
                    .header-content { padding: 40px 0; text-align: center; border-bottom: 1px solid #f0f0f0; }
                    .brand-logo { font-size: 20px; font-weight: 300; letter-spacing: 6px; color: #0a2a24; text-transform: uppercase; text-decoration: none; }
                    
                    .body-content { padding: 50px 50px 30px 50px; text-align: center; }
                    .status-title { font-size: 11px; letter-spacing: 3px; color: #c5a059; text-transform: uppercase; font-weight: 700; margin-bottom: 15px; }
                    .welcome-text { font-size: 24px; color: #0a2a24; margin-bottom: 25px; font-weight: 300; line-height: 1.4; }
                    .intro-para { font-size: 14px; color: #666666; line-height: 1.8; margin-bottom: 40px; }
                    
                    .details-grid { background-color: #fcfbf4; border: 1px solid #efe8d0; padding: 35px; border-radius: 2px; text-align: left; }
                    .grid-title { font-size: 10px; letter-spacing: 2px; color: #0a2a24; text-transform: uppercase; font-weight: 700; border-bottom: 1px solid #e8e1c8; padding-bottom: 12px; margin-bottom: 20px; }
                    
                    .table-row-item { border-bottom: 1px solid #f1ece1; }
                    .table-label { padding: 12px 0; font-size: 11px; color: #9a9380; text-transform: uppercase; letter-spacing: 1px; }
                    .table-value { padding: 12px 0; font-size: 14px; color: #0a2a24; font-weight: 600; text-align: right; }
                    
                    .footer { padding: 40px; text-align: center; background-color: #ffffff; border-top: 1px solid #f0f0f0; }
                    .footer-brand { font-size: 14px; color: #0a2a24; letter-spacing: 4px; margin-bottom: 15px; }
                    .footer-address { font-size: 11px; color: #999999; line-height: 1.6; letter-spacing: 0.5px; }
                    .cta-btn { display: inline-block; padding: 15px 35px; background-color: #0a2a24; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 30px; }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <div class="email-card">
                        <div class="header-accent"></div>
                        <div class="header-content">
                            <span class="brand-logo">VALORA</span>
                        </div>
                        
                        <div class="body-content">
                            <div class="status-title">Reservation Confirmed</div>
                            <h1 class="welcome-text">Your stay with us is <br>now secured, ${fullName}.</h1>
                            <p class="intro-para">We are delighted to confirm your upcoming visit to The Grand Valora. Our team is already preparing to welcome you for a stay defined by elegance and personalized service.</p>
                            
                            <div class="details-grid">
                                <h2 class="grid-title">Stay Overview</h2>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr class="table-row-item">
                                        <td class="table-label">Booking ID</td>
                                        <td class="table-value" style="color: #c5a059;">#${bookingId}</td>
                                    </tr>
                                    <tr class="table-row-item">
                                        <td class="table-label">Selected Retreat</td>
                                        <td class="table-value">${roomType}</td>
                                    </tr>
                                    <tr class="table-row-item">
                                        <td class="table-label">Arrival Date</td>
                                        <td class="table-value">${checkIn}</td>
                                    </tr>
                                    <tr class="table-row-item">
                                        <td class="table-label">Departure Date</td>
                                        <td class="table-value">${checkOut}</td>
                                    </tr>
                                    <tr class="table-row-item">
                                        <td class="table-label">Guests</td>
                                        <td class="table-value">${guestCount} Person(s)</td>
                                    </tr>
                                    <tr class="table-row-item">
                                        <td class="table-label">Phone</td>
                                        <td class="table-value">${phoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <td class="table-label">Email</td>
                                        <td class="table-value">${email}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                            <div class="qr-section" style="margin-top: 35px; padding-top: 25px; border-top: 1px dashed #efe8d0; text-align: center;">
                                <p style="font-size: 14px; color: #666; margin-bottom: 20px;">For your convenience, you can download a premium PDF copy of your confirmation for offline access.</p>
                                <a href="${siteOrigin}/?bookingId=${bookingId}" style="display: inline-block; padding: 15px 35px; background-color: #0a2a24; color: #ffffff !important; text-decoration: none; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Download Confirmation PDF</a>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <div class="footer-brand">THE GRAND VALORA</div>
                            <p class="footer-address">
                                GHGAT NO 68/1, SAPUTARA - NASHIK RD, HATGAD, NASHIK<br>
                                FOR ASSISTANCE: info@thegrandvalora.com
                            </p>
                            <a href="mailto:info@thegrandvalora.com" class="cta-btn">Concierge Assistance</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Email failed to send' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully', response: info.response });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
