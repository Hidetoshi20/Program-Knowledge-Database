# Hidetoshi Program Knowledge Database

This is a personal knowledge base for programming, networking, databases, and other related topics. It is built using MkDocs and the Material for MkDocs theme.

## View the Knowledge Base

The knowledge base is automatically deployed to GitHub Pages and can be viewed at:

[https://hidetoshidekisugi.github.io/Hidetoshi-Program-Knowledge-Database/](https://hidetoshidekisugi.github.io/Hidetoshi-Program-Knowledge-Database/)

## Development

To run the knowledge base locally, you will need to have Python and pip installed. Then, you can install the required dependencies:

```bash
pip install mkdocs mkdocs-material
```

Once the dependencies are installed, you can start the local development server:

```bash
mkdocs serve
```

This will start a local server at `http://127.0.0.1:8000` that will automatically reload when you make changes to the documentation.

## Deployment

Deployment is handled automatically by a GitHub Actions workflow. When changes are pushed to the `main` branch, the workflow will build the site and deploy it to the `gh-pages` branch.
