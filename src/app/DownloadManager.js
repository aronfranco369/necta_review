const extractFileId = (driveLink) => {
  if (!driveLink) return null;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard sharing link
    /id=([a-zA-Z0-9-_]+)/, // Old format with id parameter
    /\/d\/([a-zA-Z0-9-_]+)/, // Short format
  ];

  for (const pattern of patterns) {
    const match = driveLink.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

export const downloadGoogleDriveFile = async (driveLink) => {
  const fileId = extractFileId(driveLink);

  if (!fileId) {
    throw new Error("Invalid Google Drive link format");
  }

  // This is the initial URL that might lead to the warning page for large files.
  const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    console.log("Attempting to fetch download info...");
    // 1. Fetch the initial URL to see what we get back.
    const response = await fetch(initialUrl);

    // 2. Check if the response is an HTML page (the warning page).
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      console.log(
        "Warning page detected. Parsing to find direct download link..."
      );

      // 3. Get the HTML content of the warning page.
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      // 4. Find the 'Download anyway' form.
      const downloadForm = doc.getElementById("download-form");
      if (!downloadForm) {
        // This can happen if the file is private, deleted, or another error occurs.
        const errorElement = doc.querySelector(".uc-error-message");
        if (errorElement) {
          throw new Error(
            `Google Drive error: ${errorElement.textContent.trim()}`
          );
        }
        throw new Error(
          "Could not find the download confirmation form on the page."
        );
      }

      // 5. Construct the final download URL from the form's action and hidden inputs.
      const formAction = downloadForm.getAttribute("action");
      const formData = new URLSearchParams();
      const inputs = downloadForm.querySelectorAll("input");
      inputs.forEach((input) => {
        if (input.name) {
          formData.append(input.name, input.value);
        }
      });

      const finalDownloadUrl = `${formAction}?${formData.toString()}`;

      console.log("Bypass successful. Initiating direct download.");
      // 6. Trigger the download with the final, direct URL.
      window.location.href = finalDownloadUrl;
    } else {
      // If it's not HTML, it's a direct download (for smaller files).
      console.log("Direct download available (small file). Initiating...");
      window.location.href = initialUrl;
    }
  } catch (error) {
    console.error("Download failed:", error);
    console.log(
      "Fallback: Opening the download page in a new tab for manual confirmation."
    );

    // Fallback: Open the initial URL in a new tab so the user can click manually.
    const newTab = window.open(initialUrl, "_blank");
    if (!newTab) {
      // If a popup blocker prevents the new tab, redirect the current page.
      window.location.href = initialUrl;
    }
  }
};
