document.addEventListener("DOMContentLoaded", function () {
  const content = document.querySelector(".md-content");
  if (!content) return;

  const links = content.querySelectorAll("a[href]");
  const currentHost = window.location.hostname;

  links.forEach((link) => {
    // Resolve absolute URL safely
    let url;
    try {
      url = new URL(link.getAttribute("href"), window.location.origin);
    } catch (_) {
      return; // skip invalid/anchor-only urls
    }

    const isExternal = url.hostname && url.hostname !== currentHost;
    if (!isExternal) return;

    // Always open external links in a new tab
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    // Optional preview card (opt-in via data-preview="card" or class="link-preview")
    const wantPreview =
      link.dataset.preview === "card" ||
      link.classList.contains("link-preview");

    if (!wantPreview) return;

    // Build preview card
    const card = document.createElement("div");
    card.className = "link-preview-card";

    const titleDiv = document.createElement("div");
    titleDiv.className = "link-preview-title";

    const previewLink = document.createElement("a");
    previewLink.href = url.href;
    previewLink.target = "_blank";
    previewLink.rel = "noopener noreferrer";
    previewLink.textContent = link.textContent || url.href;
    titleDiv.appendChild(previewLink);

    const iframe = document.createElement("iframe");
    iframe.className = "link-preview-iframe";
    iframe.src = url.href;
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

    card.appendChild(titleDiv);
    card.appendChild(iframe);

    // Replace original link with the card
    link.parentNode.replaceChild(card, link);
  });
});
