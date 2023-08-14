import PDFDocument from "pdfkit";

type UserCertificationData  = {
  name: string,
  cpf: string,
  ticketTypeName: string,
  startsAt: string,
  endsAt: string,
  title: string,

}

export function generateCertificationPdf(userCertificationData: UserCertificationData) {
  const doc = new PDFDocument({ layout: "landscape", size: "C3", margins: { top: 115, bottom: 0, left: 110, right: 0 } });
  doc.roundedRect(0, 0, 2*doc.page.width/10, doc.page.height, 20)
    .fillColor("#DDDDDD")
    .fill();
  doc.roundedRect(8*doc.page.width/10, 0, 2*doc.page.width/10, doc.page.height, 20)
    .fillColor("#DDDDDD")
    .fill();
  doc.rect(doc.page.width/10, 0, 9*doc.page.width/10, doc.page.height).fillColor("white").fill();
  doc.fillColor("black");
  doc.fontSize(128).text("CERTIFICADO", { align: "center" });
  doc.moveDown(0.17);
  doc.fontSize(32).text("Certificamos, para todos os devidos fins, de que a(o):", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(86).text(`${userCertificationData.name}`, { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(32).text(`Com documento ${userCertificationData.cpf.slice(0, 3)}.${userCertificationData.cpf.slice(3, 6)}.${userCertificationData.cpf.slice(6, 9)}-${userCertificationData.cpf.slice(9, 11)} participou do evento ${userCertificationData.title}, de forma ${userCertificationData.ticketTypeName}, entre os dias ${userCertificationData.startsAt} e ${userCertificationData.endsAt}.`, { align: "center" });
  doc.moveDown(2);
  doc.moveTo(500, 500);
  doc.image("./src/assets/logo.png", doc.page.width/2-8, doc.page.height*7/10);
  return doc;
}
