import { LAWS, type LawId, type RequestKind } from "./laws";

export interface RequestFill {
  kind: RequestKind;
  law: LawId;
  company: string;
  fullName: string;
  accountEmail: string;
  /** Short reference so replies and the sent copy can be matched. */
  ref: string;
  sentAt: number;
  /** Letter language; English unless the person lives where another language is spoken (GDPR countries only). */
  lang?: Lang;
}

export type Lang = "en" | "es" | "fr" | "de";

/** The language of the letter for a GDPR country; English everywhere else. */
export function letterLanguage(region: string, law: LawId): Lang {
  if (law !== "gdpr") return "en";
  const r = region.toUpperCase();
  return r === "ES" ? "es" : r === "FR" || r === "LU" ? "fr" : r === "DE" || r === "AT" ? "de" : "en";
}

/** GDPR letters in Spanish, French and German: fixed text, citing the regulation as it is named in each language. */
const GDPR_LETTERS: Record<Exclude<Lang, "en">, { del: (f: RequestFill, due: string) => { subject: string; body: string[] }; obj: (f: RequestFill, due: string) => { subject: string; body: string[] } }> = {
  es: {
    del: (f, due) => ({ subject: `Solicitud de supresión de mis datos personales [${f.ref}]`, body: [
      `Estimado equipo de privacidad de ${f.company}:`, ``,
      `Les solicito que supriman todos los datos personales que tratan sobre mí, conforme al artículo 17 del Reglamento General de Protección de Datos (RGPD).`,
      `Esto incluye mi cuenta registrada con ${f.accountEmail} y cualquier registro, copia o copia de seguridad relacionados.`, ``,
      `Les pido también que dejen de enviarme comunicaciones comerciales de cualquier tipo y que trasladen esta solicitud a cualquier tercero con quien hayan compartido mis datos.`, ``,
      `Les ruego que me confirmen por escrito cuando la supresión se haya completado. Conforme al artículo 12, apartado 3, del RGPD deben responder en el plazo de un mes, prorrogable dos meses más con aviso y motivos; espero su respuesta antes del ${due}.`,
      `Si necesitan verificar mi identidad, indíquenme exactamente qué necesitan. Este correo se envía desde la dirección asociada a la cuenta.`, ``,
      `Referencia: ${f.ref}`, ``, `Atentamente,`, f.fullName] }),
    obj: (f, due) => ({ subject: `Oposición al marketing directo [${f.ref}]`, body: [
      `Estimado equipo de privacidad de ${f.company}:`, ``,
      `Me opongo a cualquier tratamiento de mis datos personales con fines de marketing directo, conforme al artículo 21, apartados 2 y 3, del RGPD.`,
      `Esto se refiere a mi cuenta registrada con ${f.accountEmail}. Dejen de enviarme correos comerciales y de elaborar perfiles con fines comerciales, y mantengan mi cuenta abierta.`, ``,
      `Les ruego que me lo confirmen por escrito. Conforme al artículo 12, apartado 3, del RGPD deben responder en el plazo de un mes; espero su respuesta antes del ${due}.`, ``,
      `Referencia: ${f.ref}`, ``, `Atentamente,`, f.fullName] }),
  },
  fr: {
    del: (f, due) => ({ subject: `Demande d'effacement de mes données personnelles [${f.ref}]`, body: [
      `Madame, Monsieur, équipe chargée de la protection des données de ${f.company},`, ``,
      `Je vous demande d'effacer l'ensemble des données personnelles que vous détenez me concernant, en application de l'article 17 du Règlement général sur la protection des données (RGPD).`,
      `Cela comprend mon compte enregistré avec l'adresse ${f.accountEmail} ainsi que tous les enregistrements, copies et sauvegardes associés.`, ``,
      `Je vous demande également de cesser tout envoi de prospection commerciale et de transmettre cette demande à tout tiers à qui vous avez communiqué mes données.`, ``,
      `Merci de me confirmer par écrit lorsque l'effacement sera effectué. En application de l'article 12, paragraphe 3, du RGPD, vous devez répondre dans un délai d'un mois, prolongeable de deux mois avec information et motifs ; j'attends votre réponse au plus tard le ${due}.`,
      `Si vous devez vérifier mon identité, merci de m'indiquer précisément ce dont vous avez besoin. Ce courriel est envoyé depuis l'adresse associée au compte.`, ``,
      `Référence : ${f.ref}`, ``, `Cordialement,`, f.fullName] }),
    obj: (f, due) => ({ subject: `Opposition à la prospection commerciale [${f.ref}]`, body: [
      `Madame, Monsieur, équipe chargée de la protection des données de ${f.company},`, ``,
      `Je m'oppose à toute utilisation de mes données personnelles à des fins de prospection, en application de l'article 21, paragraphes 2 et 3, du RGPD.`,
      `Cela concerne mon compte enregistré avec l'adresse ${f.accountEmail}. Merci de cesser tout courriel de prospection et tout profilage à des fins commerciales, et de conserver mon compte ouvert.`, ``,
      `Merci de me le confirmer par écrit. En application de l'article 12, paragraphe 3, du RGPD, vous devez répondre dans un délai d'un mois ; j'attends votre réponse au plus tard le ${due}.`, ``,
      `Référence : ${f.ref}`, ``, `Cordialement,`, f.fullName] }),
  },
  de: {
    del: (f, due) => ({ subject: `Antrag auf Löschung meiner personenbezogenen Daten [${f.ref}]`, body: [
      `Sehr geehrtes Datenschutzteam von ${f.company},`, ``,
      `hiermit beantrage ich die Löschung aller personenbezogenen Daten, die Sie über mich verarbeiten, gemäß Artikel 17 der Datenschutz-Grundverordnung (DSGVO).`,
      `Dies umfasst mein unter ${f.accountEmail} registriertes Konto sowie alle zugehörigen Datensätze, Kopien und Sicherungen.`, ``,
      `Bitte stellen Sie außerdem jegliche Werbung an mich ein und leiten Sie diesen Antrag an alle Dritten weiter, an die Sie meine Daten übermittelt haben.`, ``,
      `Bitte bestätigen Sie mir schriftlich, sobald die Löschung abgeschlossen ist. Nach Artikel 12 Absatz 3 DSGVO müssen Sie innerhalb eines Monats antworten, verlängerbar um zwei weitere Monate mit Mitteilung und Begründung; ich erwarte Ihre Antwort bis zum ${due}.`,
      `Falls Sie meine Identität prüfen müssen, teilen Sie mir bitte genau mit, was Sie benötigen. Diese E-Mail wird von der Adresse des Kontos gesendet.`, ``,
      `Referenz: ${f.ref}`, ``, `Mit freundlichen Grüßen`, f.fullName] }),
    obj: (f, due) => ({ subject: `Widerspruch gegen Direktwerbung [${f.ref}]`, body: [
      `Sehr geehrtes Datenschutzteam von ${f.company},`, ``,
      `hiermit widerspreche ich jeder Verarbeitung meiner personenbezogenen Daten zum Zweck der Direktwerbung gemäß Artikel 21 Absatz 2 und 3 DSGVO.`,
      `Dies betrifft mein unter ${f.accountEmail} registriertes Konto. Bitte stellen Sie alle Werbe-E-Mails und jedes Profiling zu Werbezwecken ein; mein Konto soll bestehen bleiben.`, ``,
      `Bitte bestätigen Sie dies schriftlich. Nach Artikel 12 Absatz 3 DSGVO müssen Sie innerhalb eines Monats antworten; ich erwarte Ihre Antwort bis zum ${due}.`, ``,
      `Referenz: ${f.ref}`, ``, `Mit freundlichen Grüßen`, f.fullName] }),
  },
};

const fmt = (t: number) => new Date(t).toISOString().slice(0, 10);

/** Fixed legal text. The model never writes or edits a request. */
export function buildRequest(f: RequestFill): { subject: string; body: string } {
  const law = LAWS[f.law];
  const due = fmt(law.deadline(f.sentAt));
  if (f.lang && f.lang !== "en" && f.law === "gdpr") {
    const l = (f.kind === "delete" ? GDPR_LETTERS[f.lang].del : GDPR_LETTERS[f.lang].obj)(f, due);
    return { subject: l.subject, body: l.body.join("\n") };
  }
  if (f.kind === "delete") {
    return {
      subject: `Request to delete my personal data [${f.ref}]`,
      body: [
        `Dear ${f.company} privacy team,`,
        ``,
        `I am writing to request that you erase all personal data you hold about me, under ${law.deleteArticle}.`,
        `This includes my account registered to ${f.accountEmail} and any related records, copies and backups.`,
        ``,
        `Please also stop sending me marketing of any kind, and pass this request on to any third party you have shared my data with.`,
        ``,
        `Please confirm in writing once the erasure is complete. Under ${law.name} you must respond within ${law.deadlineText}; I expect your reply by ${due}.`,
        `If you need to verify my identity, please tell me exactly what you need. This email is sent from the address on the account.`,
        ``,
        `Reference: ${f.ref}`,
        ``,
        `Kind regards,`,
        f.fullName,
      ].join("\n"),
    };
  }
  return {
    subject: `Objection to direct marketing [${f.ref}]`,
    body: [
      `Dear ${f.company} privacy team,`,
      ``,
      `I object to any use of my personal data for direct marketing, under ${law.objectArticle}.`,
      `This covers my account registered to ${f.accountEmail}. Please stop all marketing emails and any profiling for marketing, and keep my account open.`,
      ``,
      `Please confirm in writing. Under ${law.name} you must respond within ${law.deadlineText}; I expect your reply by ${due}.`,
      ``,
      `Reference: ${f.ref}`,
      ``,
      `Kind regards,`,
      f.fullName,
    ].join("\n"),
  };
}

/** Reminder sent when the legal deadline has passed without a proper answer. */
export function buildFollowUp(f: RequestFill & { originalSentAt: number }): { subject: string; body: string } {
  const law = LAWS[f.law];
  const what = f.kind === "delete" ? "erase my personal data" : "stop using my personal data for direct marketing";
  return {
    subject: `Follow-up: overdue privacy request [${f.ref}]`,
    body: [
      `Dear ${f.company} privacy team,`,
      ``,
      `On ${fmt(f.originalSentAt)} I asked you to ${what} (reference ${f.ref}). Under ${law.name} you had ${law.deadlineText} to respond, and that time has passed without a complete answer.`,
      ``,
      `Please complete the request and confirm in writing within 14 days. If I do not hear from you, I will file a complaint with ${law.complaintTo}.`,
      ``,
      `Reference: ${f.ref}`,
      ``,
      `Kind regards,`,
      f.fullName,
    ].join("\n"),
  };
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
/** "ER-7Q2K9" style reference. */
export function newRef(rand: () => number = Math.random): string {
  let s = "ER-";
  for (let i = 0; i < 5; i++) s += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return s;
}

/** Gmail compose link with everything filled in; the user presses Send. */
export function composeUrl(to: string, subject: string, body: string): string {
  const q = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${q.toString()}`;
}
