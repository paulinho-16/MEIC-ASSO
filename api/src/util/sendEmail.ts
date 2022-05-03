import nodemailer from 'nodemailer'

export async function sendEmail(email: string, subject: string, text: string) {

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: "Uni4All",
            to: email,
            subject: subject,
            text: text,
        });
        
        return info.response
    } catch (error) {
        throw Error(`Couldn't send email: ${error}`)
    }
}