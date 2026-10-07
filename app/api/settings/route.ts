import { NextRequest, NextResponse } from "next/server";

// In-memory storage for settings (in production, use a database)
let platformSettings = {
  maintenanceMode: false,
  registrationEnabled: true,
  maxFileUploadSize: "10",
  defaultLanguage: "en",
  timezone: "UTC",
};

let securitySettings = {
  sessionTimeout: "60",
  maxLoginAttempts: "5",
  twoFactorRequired: false,
  passwordMinLength: "8",
  passwordRequireSpecial: true,
  passwordRequireNumber: true,
};

let emailSettings = {
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUser: "apikey",
  fromEmail: "noreply@codeassess.io",
  fromName: "CodeAssess",
};

let notificationSettings = {
  emailNotifications: true,
  slackIntegration: false,
  webhookUrl: "",
  alertThreshold: "high",
};

// GET /api/settings - Get all settings
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      settings: {
        platform: platformSettings,
        security: securitySettings,
        email: emailSettings,
        notifications: notificationSettings,
      }
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST /api/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, settings } = body;

    if (!type || !settings) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type and settings" },
        { status: 400 }
      );
    }

    switch (type) {
      case "platform":
        platformSettings = { ...platformSettings, ...settings };
        break;
      case "security":
        securitySettings = { ...securitySettings, ...settings };
        break;
      case "email":
        emailSettings = { ...emailSettings, ...settings };
        break;
      case "notifications":
        notificationSettings = { ...notificationSettings, ...settings };
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid settings type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully"
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}