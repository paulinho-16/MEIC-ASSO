import nodemailer from 'nodemailer'

export async function sendEmail(email: string, subject: string, html: string) {
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        
        transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: html,
        }, (err, _info) => {
            if (err) return { status: false, message: err };
        });

        return { status: true, message: "Email sent with success" };
 
    } catch (err) {
        return { status: false, message: err }
    }
}