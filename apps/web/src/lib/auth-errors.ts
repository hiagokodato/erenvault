/** Mensagens amigáveis para a família (Supabase Auth). */
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos. Tente novamente.'
  }
  if (lower.includes('user already registered')) {
    return 'Este e-mail já está cadastrado. Tente entrar ou use outro e-mail.'
  }
  if (lower.includes('password') && lower.includes('6')) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
  }
  if (lower.includes('signup is disabled')) {
    return 'Novos cadastros estão temporariamente desativados.'
  }
  if (lower.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde um momento e tente de novo.'
  }
  if (lower.includes('invalid email') || lower.includes('unable to validate email')) {
    return 'E-mail inválido. Confira o endereço e tente novamente.'
  }
  if (lower.includes('redirect') || lower.includes('redirect_to')) {
    return 'URL de redirecionamento não permitida. Ajuste as Redirect URLs no Supabase.'
  }
  if (lower.includes('password') && (lower.includes('weak') || lower.includes('short'))) {
    return 'Senha fraca. Use pelo menos 6 caracteres e evite sequências simples.'
  }
  if (lower.includes('user not found')) {
    return 'Usuário não encontrado. Verifique o e-mail ou crie uma conta.'
  }

  return 'Não foi possível concluir. Verifique os dados e tente novamente.'
}
