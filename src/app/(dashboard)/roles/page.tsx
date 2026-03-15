"use client";

import { Save, ShieldAlert, Trash2, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

// Dummy Data for display only without real logic
const initialRoles = [
  { id: "1", name: "System Admin", description: "Full access to the system" },
  { id: "2", name: "Super Visor", description: "Access to medications and sales" },
  { id: "3", name: "Pharmacist", description: "Very limited access" },
];

const permissionModules = [
  {
    id: "pos",
    name: "Point of Sale (POS)",
    description: "Control cash and credit sales",
    permissions: [
      { id: "pos.access", name: "Access POS Screen", defaultEnabled: true },
      { id: "pos.discount", name: "Apply Discounts", defaultEnabled: false },
      { id: "pos.void", name: "Cancel Sales Invoices", defaultEnabled: false },
    ],
  },
  {
    id: "products",
    name: "Products & Inventory",
    description: "Manage medication data and quantities",
    permissions: [
      { id: "products.view", name: "View Products List", defaultEnabled: true },
      { id: "products.create", name: "Add New Products", defaultEnabled: true },
      { id: "products.edit", name: "Edit Product Data", defaultEnabled: false },
      { id: "products.delete", name: "Delete Products", defaultEnabled: false },
    ],
  },
  {
    id: "users",
    name: "Users & Roles Management",
    description: "Control employees and their permissions",
    permissions: [
      { id: "users.view", name: "View Users", defaultEnabled: false },
      { id: "users.manage", name: "Add/Edit Users", defaultEnabled: false },
      { id: "roles.manage", name: "Edit Roles & Permissions", defaultEnabled: false },
    ],
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    description: "View profits and sales reports",
    permissions: [
      { id: "reports.sales", name: "View Sales Reports", defaultEnabled: true },
      { id: "reports.inventory", name: "View Inventory Reports", defaultEnabled: true },
      { id: "reports.financial", name: "View Financial & Profit Reports", defaultEnabled: false },
    ],
  },
];

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0].id);
  const [activeRoleName, setActiveRoleName] = useState(initialRoles[0].name);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions Management</h2>
          <p className="text-muted-foreground mt-2">
            Create roles and assign appropriate permissions to each role.
          </p>
        </div>
      </div>
      <Separator className="my-4" />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Roles Sidebar */}
        <aside className="w-full md:w-1/3 flex flex-col gap-4 ">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Roles
                </CardTitle>
              </div>
              <CardDescription>Select a role to edit its permissions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {initialRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRoleId(role.id);
                      setActiveRoleName(role.name);
                    }}
                    className={`flex flex-col items-start px-6 py-4 text-start transition-colors hover:bg-background/50 ${
                      selectedRoleId === role.id
                        ? "bg-background/50 border-l-4 border-primary"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <span className="font-semibold text-sm">{role.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {role.description}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Permissions Main Content */}
        <main className="w-full md:w-2/3 flex flex-col gap-4">
          <Card className="flex-1 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  Permissions ({activeRoleName})
                </CardTitle>
                <CardDescription>
                  Select the modules and actions this role is allowed to access.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="destructive" size="icon" className="h-9 w-9">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button className="gap-2 h-9">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {permissionModules.map((module) => (
                <div key={module.id} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium tracking-tight mb-1">
                      {module.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {module.permissions.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm"
                      >
                        <div className="space-y-0.5">
                          <Label className="text-base cursor-pointer">
                            {perm.name}
                          </Label>
                        </div>
                        <Switch
                          defaultChecked={
                            selectedRoleId === "1" ? true : perm.defaultEnabled
                          }
                          aria-label={perm.name}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Separator between sections except the last one */}
                  {module.id !== permissionModules[permissionModules.length - 1].id && (
                    <Separator className="mt-8" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
