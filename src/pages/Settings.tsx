import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { useDocuments } from "@/hooks/useDocuments";
import { Loader2, Save, Download, Building2, Bell, Database } from "lucide-react";

interface CompanySettings {
  companyName: string;
  email: string;
  address: string;
  phone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
  projectUpdates: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { data: projects = [] } = useProjects();
  const { documents } = useDocuments();

  // Company settings state
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: "",
    email: "",
    address: "",
    phone: "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReports: false,
    projectUpdates: true,
  });

  // Loading states
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize with user data
  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || "TATENDA SOZA";
      setCompanySettings((prev) => ({
        ...prev,
        companyName: fullName + " Construction",
        email: user.email || "",
      }));
    }

    // Load saved settings from localStorage
    const savedCompany = localStorage.getItem("companySettings");
    const savedNotifications = localStorage.getItem("notificationSettings");

    if (savedCompany) {
      try {
        setCompanySettings(JSON.parse(savedCompany));
      } catch (e) {
        console.error("Failed to parse company settings");
      }
    }

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error("Failed to parse notification settings");
      }
    }
  }, [user]);

  const handleCompanyChange = (field: keyof CompanySettings, value: string) => {
    setCompanySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const saveCompanySettings = async () => {
    setIsSavingCompany(true);
    try {
      // Validate
      if (!companySettings.companyName.trim()) {
        throw new Error("Company name is required");
      }
      if (!companySettings.email.trim()) {
        throw new Error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companySettings.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage
      localStorage.setItem("companySettings", JSON.stringify(companySettings));

      toast.success("Company settings saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save company settings");
    } finally {
      setIsSavingCompany(false);
    }
  };

  const saveNotificationSettings = async () => {
    setIsSavingNotifications(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage
      localStorage.setItem("notificationSettings", JSON.stringify(notifications));

      toast.success("Notification preferences saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save notification settings");
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const exportAsCSV = async () => {
    setIsExporting(true);
    try {
      // Create CSV content from projects
      const headers = ["Name", "Client", "Status", "Budget", "Spent", "Progress", "Start Date", "End Date", "Manager"];
      const rows = projects.map((p) => [
        p.name,
        p.client,
        p.status,
        p.budget.toString(),
        p.spent.toString(),
        `${p.progress}%`,
        p.start_date,
        p.end_date,
        p.manager,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `projects-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Projects exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      // Create a simple text-based export (PDF generation would require a library)
      const content = projects
        .map(
          (p) =>
            `Project: ${p.name}\nClient: ${p.client}\nStatus: ${p.status}\nBudget: $${p.budget.toLocaleString()}\nSpent: $${p.spent.toLocaleString()}\nProgress: ${p.progress}%\nManager: ${p.manager}\n---`
        )
        .join("\n\n");

      const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `projects-report-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Company Information */}
        <Card className="border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>Update your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={companySettings.companyName}
                  onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => handleCompanyChange("email", e.target.value)}
                  placeholder="contact@company.com"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={companySettings.phone}
                  onChange={(e) => handleCompanyChange("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={companySettings.address}
                  onChange={(e) => handleCompanyChange("address", e.target.value)}
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
            <Separator />
            <Button onClick={saveCompanySettings} disabled={isSavingCompany}>
              {isSavingCompany ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive project updates via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when projects exceed budget</p>
              </div>
              <Switch
                checked={notifications.budgetAlerts}
                onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Updates</p>
                <p className="text-sm text-muted-foreground">Receive notifications for project changes</p>
              </div>
              <Switch
                checked={notifications.projectUpdates}
                onCheckedChange={(checked) => handleNotificationChange("projectUpdates", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
              />
            </div>
            <Separator />
            <Button onClick={saveNotificationSettings} disabled={isSavingNotifications}>
              {isSavingNotifications ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Export</CardTitle>
            </div>
            <CardDescription>Export your project data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportAsCSV} disabled={isExporting || projects.length === 0}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export as CSV
              </Button>
              <Button variant="outline" onClick={exportAsPDF} disabled={isExporting || projects.length === 0}>
                {isExporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export as Report
              </Button>
            </div>
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Create some projects first to enable data export.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-0 shadow-lg animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium">
                {user?.user_metadata?.full_name || "Tatenda Soza"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Account Status</span>
              <span className="text-sm font-medium text-green-500">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
