<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../env.php';

function enviarEmail(string $destinatario, string $assunto, string $corpoHtml): bool {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = env('GMAIL_USER');          // seu Gmail completo
        $mail->Password   = env('GMAIL_APP_PASSWORD');              // senha de app (16 chars, sem espaços)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(env('GMAIL_USER'), 'FluencyLab');
        $mail->addAddress($destinatario);

        $mail->isHTML(true);
        $mail->Subject = $assunto;
        $mail->Body    = $corpoHtml;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Erro ao enviar email: ' . $mail->ErrorInfo);
        return false;
    }
}

function templateEmailCodigo(string $nome, string $codigo): string {
    return "
    <div style='font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; background: #f8faff;'>
        <div style='background: linear-gradient(135deg, #1d4ed8, #2563eb); padding: 32px 24px; text-align: center; border-radius: 16px 16px 0 0;'>
            <div style='display: inline-flex; align-items: center; gap: 8px; margin-bottom: 4px;'>
                <span style='font-size: 22px;'>⏳</span>
                <span style='color: #ffffff; font-size: 20px; font-weight: 800;'>FluencyLab</span>
            </div>
        </div>

        <div style='background: #ffffff; padding: 32px 28px; border-radius: 0 0 16px 16px; border: 1px solid #dce8ff; border-top: none;'>
            <p style='color: #1e293b; font-size: 16px; margin: 0 0 4px;'>Olá, {$nome}!</p>
            <p style='color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;'>
                Recebemos um pedido para redefinir sua senha. Use o código abaixo para continuar:
            </p>

            <div style='background: #eff6ff; border: 1px solid #dbeafe; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;'>
                <span style='font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;'>
                    {$codigo}
                </span>
            </div>

            <p style='color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;'>
                Esse código expira em <strong style='color: #64748b;'>15 minutos</strong>.
                Se você não pediu essa recuperação, pode ignorar este email com segurança.
            </p>
        </div>

        <p style='text-align: center; color: #cbd5e1; font-size: 12px; margin-top: 20px;'>
            © FluencyLab — Aprenda inglês no seu ritmo
        </p>
    </div>
    ";
}