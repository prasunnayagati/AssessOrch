"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Shield,
  Mail,
  Bell,
  Database,
  Key,
  Globe,
  Palette,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SettingsData {
  platform: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxFileUploadSize: string;
    defaultLanguage: string;
    timezone: string;
  };
  security: {
    sessionTimeout: string;
    maxLoginAttempts: string;
    twoFactorRequired: boolean;
    passwordMinLength: string;
    passwordRequireSpecial: boolean;
    passwordRequireNumber: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    slackIntegration: boolean;
    webhookUrl: string;
    alertThreshold: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (type: keyof SettingsData, newSettings: any) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          settings: newSettings,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Settings Saved",
          description: "Your settings have been updated successfully.",
        });
        // Update local state
        if (settings) {
          setSettings({
            ...settings,
            [type]: { ...settings[type], ...newSettings },
          });
        }
      } else {
        toast({
          title: "Save Failed",
          description: data.error || "Failed to save settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </div>
      </DashboardLayout>
    );
  }

  const { platform, security, email, notifications: notificationSettings } = settings;

  const updateSubSettings = (type: keyof SettingsData, field: string, value: any) => {
    setSettings({
      ...settings,
      [type]: { ...settings[type], [field]: value }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
            <p className="text-muted-foreground">Configure global platform settings</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general platform behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable access to the platform for all users except admins
                    </p>
                  </div>
                  <Switch
                    checked={settings.platform.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        platform: { ...settings.platform, maintenanceMode: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on the platform
                    </p>
                  </div>
                  <Switch
                    checked={settings.platform.registrationEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        platform: { ...settings.platform, registrationEnabled: checked }
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Max File Upload Size (MB)</Label>
                    <Input
                      type="number"
                      value={settings.platform.maxFileUploadSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          platform: {
                            ...settings.platform,
                            maxFileUploadSize: e.target.value,
                          }
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select
                      value={settings.platform.defaultLanguage}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          platform: { ...settings.platform, defaultLanguage: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select
                    value={settings.platform.timezone}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        platform: { ...settings.platform, timezone: value }
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings("platform", settings.platform)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure authentication and security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        updateSubSettings("security", "sessionTimeout", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={security.maxLoginAttempts}
                      onChange={(e) =>
                        updateSubSettings("security", "maxLoginAttempts", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin and recruiter accounts
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorRequired}
                    onCheckedChange={(checked) =>
                      updateSubSettings("security", "twoFactorRequired", checked)
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Password Requirements</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Password Length</Label>
                      <Input
                        type="number"
                        value={security.passwordMinLength}
                        onChange={(e) =>
                          updateSubSettings("security", "passwordMinLength", e.target.value)
                        }
                        className="w-[200px]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Require Special Characters</Label>
                      <Switch
                        checked={security.passwordRequireSpecial}
                        onCheckedChange={(checked) =>
                          updateSubSettings("security", "passwordRequireSpecial", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Require Numbers</Label>
                      <Switch
                        checked={security.passwordRequireNumber}
                        onCheckedChange={(checked) =>
                          updateSubSettings("security", "passwordRequireNumber", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input
                      value={email.smtpHost}
                      onChange={(e) =>
                        updateSubSettings("email", "smtpHost", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input
                      value={email.smtpPort}
                      onChange={(e) =>
                        updateSubSettings("email", "smtpPort", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SMTP Username</Label>
                  <Input
                    value={email.smtpUser}
                    onChange={(e) =>
                      updateSubSettings("email", "smtpUser", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>SMTP Password</Label>
                  <Input type="password" placeholder="Enter SMTP password" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input
                      type="email"
                      value={email.fromEmail}
                      onChange={(e) =>
                        updateSubSettings("email", "fromEmail", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>From Name</Label>
                    <Input
                      value={email.fromName}
                      onChange={(e) =>
                        updateSubSettings("email", "fromName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">Send Test Email</Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for important system events
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSubSettings("notifications", "emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to a Slack channel
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.slackIntegration}
                    onCheckedChange={(checked) =>
                      updateSubSettings("notifications", "slackIntegration", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input
                    placeholder="https://hooks.slack.com/services/..."
                    value={notificationSettings.webhookUrl}
                    onChange={(e) =>
                      updateSubSettings("notifications", "webhookUrl", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alert Threshold</Label>
                  <Select
                    value={notificationSettings.alertThreshold}
                    onValueChange={(value) =>
                      updateSubSettings("notifications", "alertThreshold", value)
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - All Events</SelectItem>
                      <SelectItem value="medium">Medium - Important Only</SelectItem>
                      <SelectItem value="high">High - Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Manage API keys and integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Production API Key</Label>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <code className="text-sm text-muted-foreground">
                    ca_prod_••••••••••••••••••••••••••••••••
                  </code>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Test API Key</Label>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <code className="text-sm text-muted-foreground">
                    ca_test_••••••••••••••••••••••••••••••••
                  </code>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Rate Limiting</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Requests per minute</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Requests per day</Label>
                      <Input type="number" defaultValue="10000" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Webhook Endpoints</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Assessment Completed Webhook</Label>
                      <Input placeholder="https://your-server.com/webhook/assessment" />
                    </div>
                    <div className="space-y-2">
                      <Label>User Registered Webhook</Label>
                      <Input placeholder="https://your-server.com/webhook/user" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
