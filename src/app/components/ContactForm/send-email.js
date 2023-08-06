import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    // Create a transporter with your email provider configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "official.vrnitsolution@gmail.com",
        pass: "rfcwdohlcjutfuvi",
      },
    });

    try {
      // Send the email
      await transporter.sendMail({
        from: "official.vrnitsolution@gmail.com",
        to: email, // Replace with your recipient email
        subject: name,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });

      res.status(200).end();
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).end();
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
