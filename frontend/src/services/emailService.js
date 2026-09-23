/**
 * Email Dispatch Service for Aryan Thakor Portfolio
 * Handles real-time client inquiries and admin passcode OTP verification.
 * Target Email: thakoraryan2002@gmail.com
 */

const ADMIN_NOTIFICATION_EMAIL = 'thakoraryan2002@gmail.com';
const FORMSUBMIT_AJAX_URL = `https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`;

/**
 * Dispatches a client inquiry from the Contact page directly to Aryan's email.
 */
export async function sendInquiryEmail({ name, email, phone, subject, message }) {
  try {
    const payload = {
      _subject: `🌟 New Portfolio Inquiry from ${name || 'Client'} - Aryan Thakor`,
      "Client Name": name || "Anonymous",
      "Client Email": email || "Not provided",
      "Client Phone": phone || "Not provided",
      "Inquiry Subject": subject || "Project Discussion",
      "Message": message || "",
      "Submitted On": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",
      "Source": "Aryan Thakor Portfolio - Contact Page",
      _replyto: email || ADMIN_NOTIFICATION_EMAIL,
      _captcha: "false",
      _template: "table"
    };

    const res = await fetch(FORMSUBMIT_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: res.ok ? "Inquiry email sent successfully" : (data.message || "Failed to send inquiry email")
    };
  } catch (err) {
    console.warn("[EmailService] Client inquiry dispatch warning:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches a 6-digit security OTP code to Aryan's email for passcode change verification.
 */
export async function sendPasscodeOtpEmail({ otpCode, targetEmail = ADMIN_NOTIFICATION_EMAIL }) {
  try {
    const payload = {
      _subject: `🔐 Aryan Portfolio Admin Passcode OTP: [${otpCode}]`,
      "Security Alert": "Admin Passcode Change Request",
      "Verification Code (OTP)": `${otpCode}`,
      "Code Validity": "10 Minutes",
      "Requested At": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",
      "Recipient Email": targetEmail,
      "Instruction": "Enter this 6-digit code in your Admin Security Settings to verify your identity and finalize your new admin passcode.",
      "Warning": "If you did NOT request to change your passcode, please ignore this email or review your site security.",
      _captcha: "false",
      _template: "box"
    };

    const res = await fetch(FORMSUBMIT_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      message: res.ok ? "Security OTP email dispatched successfully" : (data.message || "Failed to send OTP email")
    };
  } catch (err) {
    console.warn("[EmailService] Passcode OTP dispatch warning:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches a confirmation email when the admin passcode has been successfully updated.
 */
export async function sendPasscodeSuccessEmail({ targetEmail = ADMIN_NOTIFICATION_EMAIL }) {
  try {
    const payload = {
      _subject: `✅ Admin Passcode Successfully Updated - Aryan Portfolio`,
      "Status": "Passcode Changed Successfully",
      "Account": targetEmail,
      "Updated On": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " (IST)",
      "Notice": "Your master admin passcode was successfully changed via OTP verification. You can now use your new passcode to access the Admin Panel.",
      _captcha: "false",
      _template: "box"
    };

    await fetch(FORMSUBMIT_AJAX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
