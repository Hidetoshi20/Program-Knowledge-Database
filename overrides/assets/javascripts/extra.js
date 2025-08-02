
document.addEventListener('DOMContentLoaded', function() {
    const content = document.querySelector('.md-content');
    if (!content) return;

    const links = content.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.hostname !== window.location.hostname) {
            const card = document.createElement('div');
            card.className = 'link-preview-card';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'link-preview-title';

            const previewLink = document.createElement('a');
            previewLink.href = link.href;
            previewLink.target = '_blank';
            previewLink.rel = 'noopener noreferrer';
            previewLink.textContent = link.textContent;
            titleDiv.appendChild(previewLink);

            const iframe = document.createElement('iframe');
            iframe.className = 'link-preview-iframe';
            iframe.src = link.href;
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

            card.appendChild(titleDiv);
            card.appendChild(iframe);

            link.parentNode.replaceChild(card, link);
        }
    }
});
