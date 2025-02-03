const fs = require("fs");
const { google } = require("googleapis");
const {
  GOOGLE_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_CERT_URL,
  GOOGLE_CLIENT_CERT_URL,
  GOOGLE_UNIVERSE_DOMAIN,
} = require("../config/index");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: GOOGLE_PROJECT_ID,
    private_key_id: GOOGLE_PRIVATE_KEY_ID,
    private_key: GOOGLE_PRIVATE_KEY,
    client_email: GOOGLE_CLIENT_EMAIL,
    client_id: GOOGLE_CLIENT_ID,
    auth_uri: GOOGLE_AUTH_URI,
    token_uri: GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: GOOGLE_CLIENT_CERT_URL,
    universe_domain: GOOGLE_UNIVERSE_DOMAIN,
  },
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

const uploadFile = async (filePath, fileName, folderId) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const fileUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    console.log("File uploaded successfully:", fileUrl);

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw createError(500, "Failed to upload file to Google Drive");
  }
};

module.exports = { uploadFile };
