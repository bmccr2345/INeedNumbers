from weasyprint import HTML, CSS, default_url_fetcher

def local_only_fetcher(url):
    """Secure URL fetcher that disallows remote URLs"""
    # Disallow remote URLs for security
    if url.startswith("http://") or url.startswith("https://"):
        raise ValueError("Remote fetching disabled for security")
    return default_url_fetcher(url)

def render_html_to_pdf(html: str) -> bytes:
    """Render HTML to PDF with secure configuration"""
    try:
        return HTML(
            string=html, 
            url_fetcher=local_only_fetcher
        ).write_pdf()
    except Exception as e:
        raise ValueError(f"PDF rendering failed: {str(e)}")