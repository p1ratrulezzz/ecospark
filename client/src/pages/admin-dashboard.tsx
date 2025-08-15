import { useState } from "react";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  LogOut, 
  Settings, 
  FileText, 
  Mail,
  Building,
  Calendar,
  User,
  Shield,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

function RoleCard({ role, permissions }: { role: Role; permissions: Permission[] }) {
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch role permissions
  const { data: rolePermissionsData } = useQuery({
    queryKey: [`/api/admin/roles/${role.id}/permissions`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Update role permissions when data changes
  React.useEffect(() => {
    if (rolePermissionsData?.permissions) {
      setRolePermissions(rolePermissionsData.permissions);
    }
  }, [rolePermissionsData]);

  const handlePermissionToggle = async (permission: Permission, checked: boolean) => {
    setLoading(true);
    try {
      const url = `/api/admin/roles/${role.id}/permissions/${permission.id}`;
      const method = checked ? 'POST' : 'DELETE';
      
      await fetch(url, { method });
      
      if (checked) {
        setRolePermissions(prev => [...prev, permission]);
      } else {
        setRolePermissions(prev => prev.filter(p => p.id !== permission.id));
      }
    } catch (error) {
      console.error('Failed to toggle permission:', error);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              {role.name}
            </CardTitle>
            {role.description && (
              <CardDescription>{role.description}</CardDescription>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (confirm('Удалить роль?')) {
                try {
                  await fetch(`/api/admin/roles/${role.id}`, { method: 'DELETE' });
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to delete role:', error);
                }
              }
            }}
          >
            Удалить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className="font-medium mb-3">Разрешения:</h4>
          <div className="space-y-2">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={rolePermissions.some(p => p.id === permission.id)}
                  onCheckedChange={(checked) => 
                    handlePermissionToggle(permission, !!checked)
                  }
                  disabled={loading}
                />
                <label className="text-sm">
                  <span className="font-medium">{permission.name}</span>
                  {permission.description && (
                    <span className="text-gray-500 ml-1">- {permission.description}</span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  createdAt: string;
}

interface ContactsResponse {
  success: boolean;
  contacts: Contact[];
}

interface User {
  id: string;
  username: string;
  roleId: number | null;
  role?: {
    id: number;
    name: string;
    description?: string;
  };
}

interface UsersResponse {
  success: boolean;
  users: User[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

interface RolesResponse {
  success: boolean;
  roles: Role[];
}

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface PermissionsResponse {
  success: boolean;
  permissions: Permission[];
}

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("settings");

  const { data: contactsData, isLoading: contactsLoading } = useQuery<ContactsResponse>({
    queryKey: ["/api/admin/contacts"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: activeTab === "forms" && !!user,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery<UsersResponse>({
    queryKey: ["/api/admin/users"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: activeTab === "users" && !!user,
  });

  const { data: rolesData, isLoading: rolesLoading } = useQuery<RolesResponse>({
    queryKey: ["/api/admin/roles"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: (activeTab === "roles" || activeTab === "users") && !!user,
  });

  const { data: permissionsData, isLoading: permissionsLoading } = useQuery<PermissionsResponse>({
    queryKey: ["/api/admin/permissions"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: activeTab === "roles" && !!user,
  });

  const menuItems = [
    {
      id: "settings",
      label: "Настройки",
      icon: Settings,
      permission: "view_settings",
    },
    {
      id: "forms", 
      label: "Формы",
      icon: FileText,
      permission: "view_forms",
    },
    {
      id: "users",
      label: "Пользователи", 
      icon: Users,
      permission: "manage_users"
    },
    {
      id: "roles",
      label: "Роли", 
      icon: Shield,
      permission: "manage_roles"
    },
    {
      id: "analytics",
      label: "Аналитика",
      icon: Building,
      permission: undefined
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    // Если нет требования разрешения, показываем элемент
    if (!item.permission) return true;
    
    // Если нет информации о пользователе или разрешениях, скрываем
    if (!user?.permissions) return false;
    
    // Если есть carte_blanche, показываем все
    if (user.permissions.includes("carte_blanche")) return true;
    
    // Иначе проверяем конкретное разрешение
    return user.permissions.includes(item.permission);
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Настройки</h2>
              <p className="text-gray-600 mt-1">Управление настройками системы</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Настройки будут добавлены в следующих версиях</p>
              </CardContent>
            </Card>
          </div>
        );

      case "forms":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Отправленные формы</h2>
              <p className="text-gray-600 mt-1">
                Просмотр всех заявок, отправленных через контактную форму
              </p>
            </div>

            {contactsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contactsData?.contacts && contactsData.contacts.length > 0 ? (
              <div className="space-y-4">
                {contactsData.contacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow" data-testid={`card-contact-${contact.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            {contact.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                            {contact.company && (
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {contact.company}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(contact.createdAt)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Сообщение:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap" data-testid={`text-message-${contact.id}`}>
                          {contact.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Пока нет отправленных форм</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
              <p className="text-gray-600 mt-1">Управление пользователями системы</p>
            </div>

            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : usersData?.users && usersData.users.length > 0 ? (
              <div className="space-y-4">
                {usersData.users.map((userData) => (
                  <Card key={userData.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            {userData.username}
                          </CardTitle>
                          <CardDescription>
                            Роль: {userData.role?.name || "Не назначена"}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={userData.roleId?.toString() || "0"}
                            onValueChange={async (roleId) => {
                              try {
                                await fetch(`/api/admin/users/${userData.id}/role`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ roleId: roleId === "0" ? null : parseInt(roleId) }),
                                });
                                window.location.reload();
                              } catch (error) {
                                console.error('Failed to update user role:', error);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Выберите роль" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Без роли</SelectItem>
                              {rolesData?.roles.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Пользователи не найдены</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "roles":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Роли</h2>
                <p className="text-gray-600 mt-1">Управление ролями и разрешениями</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Создать роль</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создать новую роль</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    try {
                      await fetch('/api/admin/roles', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: formData.get('name'),
                          description: formData.get('description'),
                        }),
                      });
                      window.location.reload();
                    } catch (error) {
                      console.error('Failed to create role:', error);
                    }
                  }} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Название</label>
                      <Input name="name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Описание</label>
                      <Textarea name="description" />
                    </div>
                    <Button type="submit">Создать</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {rolesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : rolesData?.roles && rolesData.roles.length > 0 ? (
              <div className="space-y-4">
                {rolesData.roles.map((role) => (
                  <RoleCard key={role.id} role={role} permissions={permissionsData?.permissions || []} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Роли не найдены</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Аналитика</h2>
              <p className="text-gray-600 mt-1">Статистика и аналитика использования</p>
            </div>
            <Card>
              <CardContent className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Аналитика будет добавлена в следующих версиях</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-semibold text-gray-900">GreenTech Energy</span>
            <span className="text-sm text-gray-500 ml-2">Админ-панель</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900" data-testid="text-username">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role?.name || "Пользователь"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-4 lg:px-6">
          <div className="flex space-x-8">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors",
                    activeTab === item.id
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  data-testid={`button-nav-${item.id}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}