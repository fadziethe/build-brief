import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";

const teamMembers = [
  { name: "Sarah Chen", role: "Project Manager", projects: 2, email: "sarah@buildtrack.com", phone: "+1 555-0101", status: "active" },
  { name: "Michael Torres", role: "Senior Engineer", projects: 1, email: "michael@buildtrack.com", phone: "+1 555-0102", status: "active" },
  { name: "Emily Rodriguez", role: "Project Manager", projects: 1, email: "emily@buildtrack.com", phone: "+1 555-0103", status: "active" },
  { name: "James Wilson", role: "Site Supervisor", projects: 1, email: "james@buildtrack.com", phone: "+1 555-0104", status: "on-leave" },
  { name: "Lisa Park", role: "Project Manager", projects: 1, email: "lisa@buildtrack.com", phone: "+1 555-0105", status: "active" },
  { name: "David Kim", role: "Cost Analyst", projects: 1, email: "david@buildtrack.com", phone: "+1 555-0106", status: "active" },
];

const Team = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your construction team members
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card
              key={member.email}
              className="border-0 shadow-lg animate-slide-up hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      member.status === "active"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {member.status === "active" ? "Active" : "On Leave"}
                  </Badge>
                </div>

                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{member.role}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Active Projects: </span>
                    <span className="font-semibold text-foreground">{member.projects}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;
