const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL;

export async function callFastAPI(endpoint: string, formData: FormData) {
  const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}
