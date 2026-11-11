import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { savePdfReportRecord } from "./storageService";

export interface ReportData {
  crop: string;
  disease: string;
  confidence: number;
  isHealthy: boolean;
  isIdentified: boolean;
  isVerified: boolean;
  imageUri?: string;
  scanDate?: string;
  description?: string;
  symptoms: string[];
  possibleCauses: string[];
  conditions?: string[];
  prevention: string[];
  treatment: string[];
  sources?: { organization: string; title: string }[];
  safetyNote?: string;
}

// Convert local file URI to base64 for embedding in the printable HTML
async function getBase64Image(uri?: string): Promise<string | null> {
  if (!uri) return null;
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.log("Could not convert image to base64 for PDF:", error);
    return null;
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function generateAndSharePdfReport(data: ReportData): Promise<boolean> {
  try {
    const imageBase64 = await getBase64Image(data.imageUri);
    const currentDate =
      data.scanDate ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const statusBadgeText = data.isHealthy
      ? "Healthy Leaf"
      : data.disease;

    const verificationBadgeHtml = data.isVerified
      ? `<div class="badge verified">🛡️ Verified Agricultural Record</div>`
      : data.isIdentified
      ? `<div class="badge ai-unverified">ℹ️ AI Preliminary Diagnosis (Unverified)</div>`
      : "";

    const symptomsHtml =
      data.symptoms && data.symptoms.length > 0
        ? `
        <div class="section">
          <div class="section-title">🔍 Visual Observations & Symptoms</div>
          <ul>
            ${data.symptoms.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
          </ul>
        </div>`
        : "";

    const causesHtml =
      data.possibleCauses && data.possibleCauses.length > 0
        ? `
        <div class="section">
          <div class="section-title">🦠 Possible Causes</div>
          <ul>
            ${data.possibleCauses.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </div>`
        : "";

    const conditionsHtml =
      data.conditions && data.conditions.length > 0
        ? `
        <div class="section">
          <div class="section-title">🌦️ Favourable Conditions</div>
          <ul>
            ${data.conditions.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
          </ul>
        </div>`
        : "";

    const preventionHtml =
      data.prevention && data.prevention.length > 0
        ? `
        <div class="section">
          <div class="section-title">🛡️ Prevention & Cultural Practices</div>
          <ul>
            ${data.prevention.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
          </ul>
        </div>`
        : "";

    const treatmentHtml =
      data.treatment && data.treatment.length > 0
        ? `
        <div class="section">
          <div class="section-title">🌿 Safe Management & Treatment</div>
          <ul>
            ${data.treatment.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
          </ul>
        </div>`
        : "";

    const sourcesHtml =
      data.sources && data.sources.length > 0
        ? `
        <div class="section sources">
          <div class="section-title">📚 Agricultural References</div>
          <ul>
            ${data.sources
              .map(
                (src) =>
                  `<li><strong>${escapeHtml(src.organization)}:</strong> ${escapeHtml(
                    src.title
                  )}</li>`
              )
              .join("")}
          </ul>
        </div>`
        : "";

    const safetyNoteHtml = data.safetyNote
      ? `<div class="alert-box"><strong>Safety Note:</strong> ${escapeHtml(
          data.safetyNote
        )}</div>`
      : "";

    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>CropDoc Diagnosis Report</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1F2D1F;
        margin: 0;
        padding: 32px;
        background-color: #FFFFFF;
        line-height: 1.5;
        font-size: 13px;
      }
      .header-table {
        width: 100%;
        border-bottom: 2px solid #2E7D32;
        padding-bottom: 14px;
        margin-bottom: 20px;
      }
      .brand-title {
        font-size: 24px;
        font-weight: 800;
        color: #2E7D32;
        margin: 0;
      }
      .brand-subtitle {
        font-size: 11px;
        color: #6B7D6B;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 2px;
      }
      .report-meta {
        text-align: right;
        font-size: 12px;
        color: #555555;
      }
      .hero-card {
        background: #F4F8F4;
        border: 1px solid #C8DEC8;
        border-radius: 12px;
        padding: 18px;
        margin-bottom: 20px;
      }
      .hero-table {
        width: 100%;
      }
      .crop-name {
        font-size: 13px;
        font-weight: 700;
        color: #2E7D32;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .disease-name {
        font-size: 22px;
        font-weight: 800;
        color: ${data.isHealthy ? "#2E7D32" : "#C62828"};
        margin: 4px 0 10px 0;
      }
      .confidence-tag {
        display: inline-block;
        background: #2E7D32;
        color: #FFFFFF;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 12px;
      }
      .leaf-img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #DDE8DD;
      }
      .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
        margin-top: 8px;
      }
      .badge.verified {
        background: #E8F5E9;
        color: #1B5E20;
        border: 1px solid #A5D6A7;
      }
      .badge.ai-unverified {
        background: #FFF8E1;
        color: #795548;
        border: 1px solid #FFE082;
      }
      .description-box {
        margin: 14px 0 20px 0;
        font-size: 13.5px;
        color: #384638;
        line-height: 1.55;
      }
      .section {
        margin-bottom: 16px;
        background: #FAFCFA;
        border: 1px solid #E2EAE2;
        border-radius: 8px;
        padding: 12px 16px;
      }
      .section-title {
        font-size: 13.5px;
        font-weight: 800;
        color: #1A2B1A;
        margin-bottom: 8px;
        border-bottom: 1px solid #EAF0EA;
        padding-bottom: 4px;
      }
      ul {
        margin: 0;
        padding-left: 18px;
      }
      li {
        margin-bottom: 5px;
        color: #334433;
      }
      .alert-box {
        background: #FFF8E1;
        border-left: 4px solid #FFB300;
        padding: 10px 14px;
        border-radius: 4px;
        margin: 16px 0;
        font-size: 12px;
        color: #6D4C41;
      }
      .footer {
        margin-top: 30px;
        border-top: 1px solid #E0EAE0;
        padding-top: 12px;
        font-size: 10.5px;
        color: #7A8A7A;
        text-align: center;
        line-height: 1.4;
      }
    </style>
  </head>
  <body>
    <table class="header-table">
      <tr>
        <td>
          <h1 class="brand-title">🌱 CropDoc</h1>
          <div class="brand-subtitle">Smart Agricultural Disease Diagnosis Report</div>
        </td>
        <td class="report-meta">
          <div><strong>Date:</strong> ${escapeHtml(currentDate)}</div>
          <div><strong>Status:</strong> ${escapeHtml(data.isHealthy ? "Healthy" : "Diagnosis")}</div>
        </td>
      </tr>
    </table>

    <div class="hero-card">
      <table class="hero-table">
        <tr>
          <td style="vertical-align: top;">
            <div class="crop-name">🌿 Crop: ${escapeHtml(data.crop)}</div>
            <div class="disease-name">${escapeHtml(statusBadgeText)}</div>
            ${
              data.confidence > 0
                ? `<div class="confidence-tag">${data.confidence}% AI Confidence Estimate</div>`
                : ""
            }
            <div>${verificationBadgeHtml}</div>
          </td>
          ${
            imageBase64
              ? `<td style="width: 130px; text-align: right; vertical-align: top;">
                  <img src="${imageBase64}" class="leaf-img" alt="Scanned Crop Leaf" />
                </td>`
              : ""
          }
        </tr>
      </table>
    </div>

    ${
      data.description
        ? `<div class="description-box"><strong>Overview:</strong> ${escapeHtml(
            data.description
          )}</div>`
        : ""
    }

    ${symptomsHtml}
    ${causesHtml}
    ${conditionsHtml}
    ${preventionHtml}
    ${treatmentHtml}
    ${sourcesHtml}
    ${safetyNoteHtml}

    <div class="footer">
      <strong>Important Agricultural Advisory:</strong> This diagnostic report was generated using AI image analysis.
      Field conditions, weather, and soil health influence crop symptoms. Consult a certified local agricultural extension officer
      or agronomist before applying chemical treatments or purchasing pesticides.
      <br /><br />
      CropDoc Smart Agricultural System · Generated locally on device
    </div>
  </body>
</html>
`;

    // 1. Generate local PDF file
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // Save report record persistently
    try {
      const recordId = `${data.crop.trim().toLowerCase()}_${data.disease.trim().toLowerCase()}`;
      await savePdfReportRecord({
        id: recordId,
        crop: data.crop,
        disease: data.disease,
        confidence: data.confidence,
        isHealthy: data.isHealthy,
        date: currentDate,
        reportData: data,
      });
    } catch (saveErr) {
      console.log("Could not save PDF report record to storage:", saveErr);
    }

    // 2. Open native share sheet so user can save or share
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
        dialogTitle: `CropDoc Report - ${data.crop} ${data.disease}`,
      });
      return true;
    } else {
      console.log("Sharing is not available on this device/platform.");
      return false;
    }
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return false;
  }
}

