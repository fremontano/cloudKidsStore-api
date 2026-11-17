import { Resend } from "resend";

const getResendClient = (): Resend => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        throw new Error("Falta configurar RESEND_API_KEY");
    }

    return new Resend(apiKey);
};

export const sendPasswordOtpEmail = async (
    to: string,
    otp: string,
): Promise<void> => {
    const resend = getResendClient();

    const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
        to,
        subject: "Código de verificación - CoolKid",
        text: `Tu código de verificación es ${otp}. Expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Código de verificación</h2>
                <p>Usa el siguiente código para cambiar tu contraseña:</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
                <p>El código expira en 10 minutos. Si no solicitaste este cambio, ignora este correo.</p>
            </div>
        `,
    });

    if (error) {
        throw new Error(error.message);
    }
};
