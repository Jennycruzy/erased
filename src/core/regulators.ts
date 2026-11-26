import type { LawId } from "./laws";

/** Where to file a complaint, with the authority's own page (each link checked to load on 26 Nov 2026). */
export interface Regulator { name: string; url: string; how: string }

const EU_BY_COUNTRY: Record<string, Regulator> = {
  IE: { name: "Data Protection Commission (Ireland)", url: "https://forms.dataprotection.ie/contact", how: "Complaint form" },
  FR: { name: "CNIL (France)", url: "https://www.cnil.fr/fr/plaintes", how: "Plaintes en ligne" },
  ES: { name: "Agencia Española de Protección de Datos", url: "https://sedeaepd.gob.es/sede-electronica/home", how: "Sede electrónica (reclamación)" },
  IT: { name: "Garante per la protezione dei dati personali (Italy)", url: "https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/4535524", how: "Modello di reclamo" },
  NL: { name: "Autoriteit Persoonsgegevens (Netherlands)", url: "https://www.autoriteitpersoonsgegevens.nl/en/submitting-a-tip-off-or-a-complaint-to-the-ap", how: "Complaint page" },
};
const EU_LIST: Regulator = { name: "your country's data protection authority", url: "https://www.edpb.europa.eu/about-edpb/our-members_en", how: "List of all EU/EEA authorities" };

export function regulatorFor(law: LawId, region: string): Regulator | null {
  switch (law) {
    case "gdpr": return EU_BY_COUNTRY[region.toUpperCase()] ?? EU_LIST;
    case "uk_gdpr": return { name: "Information Commissioner's Office", url: "https://ico.org.uk/make-a-complaint/data-protection-complaints/", how: "Data protection complaint" };
    case "ccpa": return { name: "California Privacy Protection Agency", url: "https://cppa.ca.gov/webapplications/complaint", how: "Online complaint" };
    case "pipeda": return { name: "Office of the Privacy Commissioner of Canada", url: "https://www.priv.gc.ca/en/report-a-concern/", how: "Report a concern" };
    case "ndpa": return { name: "Nigeria Data Protection Commission", url: "https://ndpc.gov.ng/contact/", how: "Contact the Commission (complaints under Article 39 GAID 2025)" };
    default: return null;
  }
}
