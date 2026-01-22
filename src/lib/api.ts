const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || "http://localhost:8000";

class APIClient {
  private csrfToken: string | null = null;

  constructor() {
    // Get initial CSRF token
    this.refreshCSRFToken();
  }

  private async refreshCSRFToken() {
    try {
      const response = await fetch(`${FASTAPI_URL}/api/csrf-token`, {
        method: "GET",
        credentials: "include",
      });
      
      const token = response.headers.get("X-CSRF-Token");
      if (token) {
        this.csrfToken = token;
      }
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
    }
  }

  private async makeRequest(
    endpoint: string,
    method: string = "POST",
    body?: FormData | null
  ): Promise<Response> {
    // Ensure we have a CSRF token for protected methods
    if (!this.csrfToken && ["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      await this.refreshCSRFToken();
    }

    const headers: HeadersInit = {};
    
    if (this.csrfToken) {
      headers["X-CSRF-Token"] = this.csrfToken;
    }

    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
      method,
      headers,
      body,
      credentials: "include",
    });

    // Update CSRF token from response
    const newToken = response.headers.get("X-CSRF-Token");
    if (newToken) {
      this.csrfToken = newToken;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        detail: `HTTP ${response.status}` 
      }));
      throw new Error(errorData.detail || errorData.error || `Request failed with status ${response.status}`);
    }

    return response;
  }

  async mergePDFs(files: File[]): Promise<Blob> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.makeRequest("/api/pdf/merge", "POST", formData);
    return await response.blob();
  }

  async splitPDF(file: File, pages?: string): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    if (pages) {
      formData.append("pages", pages);
    }

    const response = await this.makeRequest("/api/pdf/split", "POST", formData);
    return await response.blob();
  }

  async compressPDF(file: File, quality: "low" | "medium" | "high" = "medium"): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    const response = await this.makeRequest("/api/pdf/compress", "POST", formData);
    return await response.blob();
  }

  async pdfToImages(file: File, format: "png" | "jpg" = "png", dpi: number = 200): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);
    formData.append("dpi", dpi.toString());

    const response = await this.makeRequest("/api/pdf/to-images", "POST", formData);
    return await response.blob();
  }

  async imagesToPDF(files: File[]): Promise<Blob> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.makeRequest("/api/images/to-pdf", "POST", formData);
    return await response.blob();
  }

  async rotatePDF(file: File, angle: 90 | 180 | 270): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("angle", angle.toString());

    const response = await this.makeRequest("/api/pdf/rotate", "POST", formData);
    return await response.blob();
  }

  async docToPDF(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.makeRequest("/api/doc/to-pdf", "POST", formData);
    return await response.blob();
  }

  async pdfToDoc(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.makeRequest("/api/pdf/to-doc", "POST", formData);
    return await response.blob();
  }

  async deletePages(file: File, pages: string): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", pages);

    const response = await this.makeRequest("/api/pdf/delete-pages", "POST", formData);
    return await response.blob();
  }

  async reorderPages(file: File, order: string): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("order", order);

    const response = await this.makeRequest("/api/pdf/reorder-pages", "POST", formData);
    return await response.blob();
  }

  async testConnection(): Promise<any> {
    const response = await this.makeRequest("/api/test", "GET");
    return await response.json();
  }
}

// Export a singleton instance
export const apiClient = new APIClient();

// Helper function to download a blob
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
