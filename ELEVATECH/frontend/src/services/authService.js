const API_URL =
  `${import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000"}/api/auth`;

async function request(path, options = {}, fallbackMessage = "Something went wrong") {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (networkError) {
    const error = new Error(
      "Unable to reach the server. Please check your connection and try again."
    );
    error.code = "network";
    error.status = 0;
    throw error;
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // Non-JSON body: fall back to the response status message.
    data = { message: response.ok ? fallbackMessage : `Request failed (${response.status})` };
  }

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || fallbackMessage
    );
    error.code = data.code;
    error.email = data.email;
    error.reason = data.reason;
    error.retryAfter = data.retry_after;
    error.status = response.status;
    throw error;
  }

  return data;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

const authService = {
  async login(credentials) {
    return request(
      "/login",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(credentials),
      },
      "Login failed"
    );
  },

  async register(userData) {
    return request(
      "/register",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(userData),
      },
      "Registration failed"
    );
  },

  async me(token) {
    return request("/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async verifyEmail(payload) {
    return request(
      "/verify-email",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      },
      "Email verification failed"
    );
  },

  async verifyPhone(payload) {
    return request(
      "/verify-phone",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      },
      "Phone verification failed"
    );
  },

  async resendVerification(payload) {
    return request(
      "/resend-verification",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      },
      "Could not resend the code"
    );
  },

  async verificationStatus(email) {
    return request(
      `/verification-status?email=${encodeURIComponent(email)}`,
      { method: "GET" },
      "Could not load verification status"
    );
  },

  async forgotPassword(email) {
    return request(
      "/forgot-password",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email }),
      },
      "Could not send a reset code"
    );
  },

  async resetPassword(payload) {
    return request(
      "/reset-password",
      {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      },
      "Could not reset the password"
    );
  },

  async logout() {
    return true;
  },
};

export default authService;

