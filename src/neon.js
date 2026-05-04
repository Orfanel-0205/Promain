// src/api/neon.js

const API_URL =
  "https://ep-flat-dew-aii6amgf.apirest.c-4.us-east-1.aws.neon.tech/neondb/rest/v1";
const API_KEY = "YOUR_NEON_API_KEY"; // <-- replace with your Neon API key

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      // "users" = your table name
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Neon API error:", error);
    throw error;
  }
}
