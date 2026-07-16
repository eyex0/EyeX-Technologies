import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, Kpi } from "@/components/common/primitives";
import { useQuery } from "@tanstack/react-query";
import { DatabaseService } from "@/services/database.service";
import { useAuth } from "@/hooks/use-auth";

export function SettingsPage() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => (user ? DatabaseService.getProfile(user.id) : null),
    enabled: !!user,
  });

  const { data: organization } = useQuery({
    queryKey: ["organization", profile?.active_org_id],
    queryFn: () =>
      profile?.active_org_id ? DatabaseService.getOrganization(profile.active_org_id) : null,
    enabled: !!profile?.active_org_id,
  });

  const { data: orgMembers } = useQuery({
    queryKey: ["organizationMembers", profile?.active_org_id],
    queryFn: () => DatabaseService.getOrganizationMembers(),
    enabled: !!profile?.active_org_id,
  });

  const currentUserRole = orgMembers?.find((m: any) => m.user_id === user?.id)?.role || "Owner";

  const memberRows =
    orgMembers && orgMembers.length > 0
      ? orgMembers.map((mem: any) => ({
          name: mem.profiles?.full_name || "Anonymous",
          email: mem.profiles?.email || "N/A",
          role: mem.role.charAt(0).toUpperCase() + mem.role.slice(1),
          status: "Active",
        }))
      : [];

  return (
    <ModulePage
      title="Settings"
      subtitle="Workspace & account"
      tabs={[
        {
          key: "profile",
          label: "Profile",
          render: () => (
            <Card title="Profile">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Name" value={profile?.full_name || "Admin User"} />
                <Field label="Email" value={profile?.email || user?.email || "admin@eyex.io"} />
                <Field
                  label="Role"
                  value={currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
                />
                <Field label="Timezone" value="America/Los_Angeles" />
              </div>
            </Card>
          ),
        },
        {
          key: "org",
          label: "Organization",
          render: () => (
            <Card title="Organization">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Company" value={organization?.name || "EyeX Technologies"} />
                <Field label="Plan" value="Enterprise" />
                <Field label="Members" value={`${orgMembers?.length || 0}`} />
                <Field label="Region" value="US-West" />
              </div>
            </Card>
          ),
        },
        {
          key: "users",
          label: "Users",
          render: () => (
            <Card title={`Team members (${memberRows.length})`} icon="group">
              {memberRows.length > 0 ? (
                <div className="p-2">
                  {memberRows.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/40"
                    >
                      <div>
                        <div className="text-sm text-white">{m.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{m.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          {m.role}
                        </span>
                        <Badge tone="success">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No team members found
                </div>
              )}
            </Card>
          ),
        },
        {
          key: "billing",
          label: "Billing",
          render: () => (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Kpi label="Plan" value="Enterprise" icon="workspace_premium" />
              <Kpi label="Members" value={orgMembers?.length.toString() || "0"} icon="people" />
              <Kpi label="Next invoice" value="Dec 15" icon="event" />
            </div>
          ),
        },
        {
          key: "sec",
          label: "Security",
          render: () => (
            <Card title="Security">
              <div className="p-5 space-y-3 text-sm">
                {[
                  "Two-factor authentication",
                  "SSO (SAML)",
                  "Session timeout",
                  "IP allowlist",
                  "Audit log",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex justify-between border-b border-border pb-3 last:border-0"
                  >
                    <span className="text-white">{s}</span>
                    <span className="text-muted-foreground text-xs">Configured</span>
                  </div>
                ))}
              </div>
            </Card>
          ),
        },
      ]}
    />
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
        {label}
      </div>
      <div className="border border-border rounded-md px-3 py-2 text-sm text-white bg-background">
        {value}
      </div>
    </div>
  );
}
