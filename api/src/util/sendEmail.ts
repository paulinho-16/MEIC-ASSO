import nodemailer from 'nodemailer'

export async function sendEmail(email: string, subject: string, text: string) {

    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            text: text,
        }, (err, _info) => {
            if(err){
                return {status:false, message: err}
            } else {
                return {status: true, message: "Email sent with success"}
            }
        });
    } catch (err) {
        return {status:false, message: err}
    }
}