import { jsPDF } from "jspdf";
import type { ApiFacture, ApiOrder } from "@/lib/api";

const LOGO_URL = "/althea-logo.png";

const COMPANY = {
  name:     "Althea Systems",
  tagline:  "Matériel médical professionnel",
  address:  "12 rue de la Santé, 75013 Paris",
  siret:    "SIRET 123 456 789 00012",
  tva:      "TVA FR12 345678901",
  email:    "contact@althea-systems.fr",
  phone:    "+33 1 23 45 67 89",
};

let cachedLogo: string | null = null;

async function loadLogo(): Promise<string | null> {
  if (cachedLogo) return cachedLogo;
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    const blob = await res.blob();
    cachedLogo = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return cachedLogo;
  } catch {
    return null;
  }
}

const fmtEUR = (n: number) =>
  n.toFixed(2).replace(".", ",") + " €";

const fmtDate = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR");
};

export async function generateInvoicePDF(
  invoice: ApiFacture,
  lineItems: ApiOrder[],
  clientEmail?: string,
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // ─── Header: logo + company ────────────────────────────────────────────
  const logo = await loadLogo();
  if (logo) {
    try {
      doc.addImage(logo, "PNG", margin, y, 30, 18, undefined, "FAST");
    } catch {
      // image decode failed — skip silently
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 60, 90);
  doc.text(COMPANY.name, margin + 35, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(COMPANY.tagline, margin + 35, y + 13);
  doc.text(COMPANY.address, margin + 35, y + 17);
  doc.text(`${COMPANY.email} · ${COMPANY.phone}`, margin + 35, y + 21);

  y += 28;

  // ─── Title bar ────────────────────────────────────────────────────────
  doc.setDrawColor(20, 60, 90);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 60, 90);
  doc.text(`FACTURE N° ${String(invoice.factures.id).padStart(6, "0")}`, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(`Date d'émission : ${fmtDate(invoice.factures.dateEmission ?? invoice.factures.dateCreation)}`, margin, y);
  y += 4;
  if (invoice.factures.commandeRef) {
    doc.text(`Référence commande : ${invoice.factures.commandeRef}`, margin, y);
    y += 4;
  }
  doc.text(
    `Statut : ${invoice.factures.statut === "payée" ? "Payée" : "En attente de paiement"}`,
    margin, y,
  );
  y += 8;

  // ─── Client block ─────────────────────────────────────────────────────
  const clientBoxY = y;
  doc.setFillColor(245, 248, 250);
  doc.rect(margin, clientBoxY, pageW - margin * 2, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20, 60, 90);
  doc.text("FACTURÉ À", margin + 3, clientBoxY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  const clientLine = clientEmail ?? invoice.factures.client ?? invoice.factures.userId ?? "Client";
  doc.text(clientLine, margin + 3, clientBoxY + 11);
  const deliveryAddr = lineItems[0]?.adresses;
  if (deliveryAddr) {
    const parts = [deliveryAddr.adress, deliveryAddr.city, deliveryAddr.country]
      .filter(Boolean)
      .join(", ");
    if (parts) doc.text(parts, margin + 3, clientBoxY + 16);
  }

  y = clientBoxY + 28;

  // ─── Line items table ─────────────────────────────────────────────────
  const colX = {
    desc:  margin,
    qty:   pageW - margin - 90,
    unit:  pageW - margin - 65,
    tva:   pageW - margin - 35,
    total: pageW - margin,
  };

  doc.setFillColor(20, 60, 90);
  doc.rect(margin, y, pageW - margin * 2, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Désignation", colX.desc + 2, y + 5);
  doc.text("Qté", colX.qty, y + 5, { align: "right" });
  doc.text("PU HT", colX.unit, y + 5, { align: "right" });
  doc.text("TVA", colX.tva, y + 5, { align: "right" });
  doc.text("Total HT", colX.total, y + 5, { align: "right" });
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);

  let totalHT = 0;
  let totalTVA = 0;

  if (lineItems.length === 0) {
    // Fallback: single line using facture montant TTC (rare case where orders weren't found)
    const ttc = parseFloat(invoice.factures.montant ?? "0");
    const ht = ttc / 1.2;
    totalHT = ht;
    totalTVA = ttc - ht;
    doc.text("Commande facturée", colX.desc + 2, y + 4);
    doc.text("1", colX.qty, y + 4, { align: "right" });
    doc.text(fmtEUR(ht), colX.unit, y + 4, { align: "right" });
    doc.text("20%", colX.tva, y + 4, { align: "right" });
    doc.text(fmtEUR(ht), colX.total, y + 4, { align: "right" });
    y += 7;
  } else {
    for (const o of lineItems) {
      const order = o.orders;
      const qty = order.quantity ?? 1;
      const unit = parseFloat(order.unitaryPrice ?? "0");
      const rate = parseFloat(order.taxRate ?? "20");
      const lineHT = qty * unit;
      const lineTVA = lineHT * (rate / 100);
      totalHT += lineHT;
      totalTVA += lineTVA;

      // Wrap product name if too long
      const name = order.productName ?? `Produit #${order.productsId ?? ""}`;
      const wrapped = doc.splitTextToSize(name, (colX.qty - colX.desc) - 8);
      const rowH = Math.max(7, wrapped.length * 4.5);

      // Zebra striping for readability
      if ((lineItems.indexOf(o) % 2) === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 3, pageW - margin * 2, rowH, "F");
      }

      doc.text(wrapped, colX.desc + 2, y + 1);
      doc.text(String(qty), colX.qty, y + 1, { align: "right" });
      doc.text(fmtEUR(unit), colX.unit, y + 1, { align: "right" });
      doc.text(`${rate.toFixed(0)}%`, colX.tva, y + 1, { align: "right" });
      doc.text(fmtEUR(lineHT), colX.total, y + 1, { align: "right" });
      y += rowH;
    }
  }

  // ─── Totals box ───────────────────────────────────────────────────────
  y += 4;
  doc.setDrawColor(220, 220, 220);
  doc.line(colX.unit - 10, y, colX.total, y);
  y += 5;

  const totalTTC = parseFloat(invoice.factures.montant ?? String(totalHT + totalTVA));

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(70, 70, 70);
  doc.text("Sous-total HT", colX.unit - 10, y, { align: "right" });
  doc.text(fmtEUR(totalHT), colX.total, y, { align: "right" });
  y += 5;
  doc.text("TVA", colX.unit - 10, y, { align: "right" });
  doc.text(fmtEUR(totalTVA), colX.total, y, { align: "right" });
  y += 5;
  doc.text("Livraison", colX.unit - 10, y, { align: "right" });
  doc.text("Offerte", colX.total, y, { align: "right" });
  y += 6;

  doc.setDrawColor(20, 60, 90);
  doc.setLineWidth(0.4);
  doc.line(colX.unit - 30, y - 2, colX.total, y - 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20, 60, 90);
  doc.text("Total TTC", colX.unit - 10, y + 4, { align: "right" });
  doc.text(fmtEUR(totalTTC), colX.total, y + 4, { align: "right" });
  y += 14;

  // ─── Payment status banner ────────────────────────────────────────────
  if (invoice.factures.statut === "payée") {
    doc.setFillColor(220, 245, 230);
    doc.setDrawColor(80, 170, 110);
    doc.roundedRect(margin, y, pageW - margin * 2, 18, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(40, 120, 70);
    doc.text("FACTURE ACQUITTÉE", margin + 4, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 100, 75);
    const p = invoice.paiements;
    const method =
      p?.methode === "cb"
        ? `Carte bancaire •••• ${p.cardLast4 ?? "----"}`
        : p?.methode === "virement"
        ? "Virement bancaire"
        : p?.methode === "cheque"
        ? "Chèque"
        : "Paiement enregistré";
    doc.text(`Payée par ${method} le ${fmtDate(p?.datePaiement)}`, margin + 4, y + 13);
    if (p?.transactionId) {
      doc.text(`Réf. transaction : ${p.transactionId}`, pageW - margin - 4, y + 13, { align: "right" });
    }
    y += 22;
  } else {
    doc.setFillColor(255, 245, 220);
    doc.setDrawColor(220, 170, 60);
    doc.roundedRect(margin, y, pageW - margin * 2, 18, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(160, 100, 20);
    doc.text("EN ATTENTE DE PAIEMENT", margin + 4, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 90, 30);
    doc.text(
      "Règlement attendu à réception. Modes acceptés : carte, virement, chèque.",
      margin + 4, y + 13,
    );
    y += 22;
  }

  // ─── Footer ───────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `${COMPANY.name} · ${COMPANY.siret} · ${COMPANY.tva}`,
    pageW / 2, footerY, { align: "center" },
  );
  doc.text(
    "Document généré électroniquement — valable sans signature manuscrite.",
    pageW / 2, footerY + 3.5, { align: "center" },
  );

  doc.save(`facture-althea-${String(invoice.factures.id).padStart(6, "0")}.pdf`);
}
