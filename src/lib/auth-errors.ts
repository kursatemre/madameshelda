/**
 * Supabase Auth'un İngilizce hata mesajlarını (client SDK'dan geldiği gibi)
 * kullanıcıya gösterilecek Türkçe metne çevirir. Tanınmayan bir mesaj
 * olduğu gibi döner — hiçbir hata sessizce yutulmaz.
 */
const KNOWN: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "E-posta veya şifre hatalı."],
  [/email not confirmed/i, "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin."],
  [/user already registered/i, "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin."],
  [/password should be at least/i, "Şifre en az 6 karakter olmalı."],
  [/unable to validate email address/i, "Geçerli bir e-posta adresi girin."],
  [/rate limit/i, "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin."],
  [/token has expired or is invalid/i, "Bağlantının süresi dolmuş veya geçersiz. Lütfen tekrar deneyin."],
  [/new password should be different/i, "Yeni şifre eskisinden farklı olmalı."],
  [/session.*missing|auth session missing/i, "Oturum bulunamadı. Lütfen bağlantıyı e-postanızdan tekrar açın."],
];

export function translateAuthError(message: string | undefined | null): string {
  if (!message) return "Beklenmeyen bir hata oluştu.";
  for (const [pattern, tr] of KNOWN) {
    if (pattern.test(message)) return tr;
  }
  return message;
}
