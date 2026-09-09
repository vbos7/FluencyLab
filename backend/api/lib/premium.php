<?php

function hasActivePro(PDO $pdo, ?int $userId): bool
{
    if (! $userId) return false;
    $stmt = $pdo->prepare("SELECT up.id FROM user_plan up
        JOIN plans p ON p.id = up.plan_id
        WHERE up.user_id = ? AND up.status = 'active' AND p.name = 'Pro'
        AND (up.expires_at IS NULL OR up.expires_at > NOW()) LIMIT 1");
    $stmt->execute([$userId]);
    return (bool) $stmt->fetchColumn();
}

function requirePro(PDO $pdo): void
{
    if (! hasActivePro($pdo, isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null)) {
        json_out(['error' => 'premium_required', 'message' => 'Recurso exclusivo do plano Pro.'], 403);
        exit;
    }
}
