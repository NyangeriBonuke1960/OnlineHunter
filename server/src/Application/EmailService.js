const nodemailer = require('nodemailer')

class EmailService{
    transporter = nodemailer.createTransport({
       host: process.env.EMAIL_HOST,
       port: process.env.EMAIL_PORT,
       secure: false,
       auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
       }
    })

    async sendPasswordResetEmail(email, token){
        const resetUrl = `http://localhost:8000/reset-password?token=${token}`

        const mailOptions = {
            from: `"Online Hunter" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request",
            html:   `
                        <h2>Password reset</h2>
                        <p>You requested a password reset. Click the link to reset your password:</p>
                        <a href="${resetUrl}" target="_blank">Reset Password</a>
                        <p>This link will expire in 1hr</p>
                        <p>If you did not request this, please ignore this email</p>
                    `
        }

        try{
            await this.transporter.sendMail(mailOptions)
            return {success: true, message: 'Reset email sent'}
        }
        catch(error){
            throw new Error(`Email sending error: ${error.message}`)
        }
    }
}

module.exports = new EmailService