// app/api/gdrive/route.js
import { NextResponse } from "next/server";
import axios from "axios"; // You might need to install axios: npm install axios

function extractFileId(driveLink) {
  if (!driveLink) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    /id=([a-zA-Z0-9-_]+)/,
    /\/d\/([a-zA-Z0-9-_]+)/,
  ];
  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request) {
  try {
    const { driveLink } = await request.json();
    const fileId = extractFileId(driveLink);

    if (!fileId) {
      return NextResponse.json(
        { error: "Invalid Google Drive link format" },
        { status: 400 }
      );
    }

    const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Make the initial request. axios will handle redirects automatically.
    // We expect a redirect for large files.
    const response = await axios
      .get(initialUrl, {
        // We limit the response size because we don't want to download the file here,
        // just the HTML of the confirmation page if it exists.
        maxContentLength: 100000, // 100kb limit
        maxRedirects: 5, // Follow redirects
      })
      .catch((error) => {
        // This is the CRUCIAL part. For large files, axios will throw an error
        // because the response is HTML (not the file) and Google serves it
        // with a 'text/html' content type which might not be what axios expects
        // for a "download". We can grab the necessary info from the error response.
        if (
          error.response &&
          error.response.status === 200 &&
          error.response.data
        ) {
          return error.response; // This is actually the successful response we want!
        }
        throw error; // Re-throw other errors
      });

    // The response data will be the HTML of the confirmation page for large files
    const html = response.data;

    // Regex to find the confirmation token in the "Download anyway" link href
    const confirmTokenMatch = html.match(
      /href="(\/uc\?export=download&confirm=([^&]+)&id=...*)"/
    );

    if (confirmTokenMatch && confirmTokenMatch[2]) {
      const confirmToken = confirmTokenMatch[2];
      // Construct the final, direct download URL
      const finalDownloadUrl = `https://drive.google.com/uc?export=download&confirm=${confirmToken}&id=${fileId}`;

      return NextResponse.json({ downloadUrl: finalDownloadUrl });
    }

    // If no confirmation token is found, it's likely a small fsile.
    // The initial URL should work directly.
    return NextResponse.json({ downloadUrl: initialUrl });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      {
        error:
          "Failed to resolve Google Drive link. The file may not be public.",
      },
      { status: 500 }
    );
  }
}
