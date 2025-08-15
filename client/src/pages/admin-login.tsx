import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Lock } from "lucide-react";
import { Redirect } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, "Введите имя пользователя"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { user, loginMutation } = useAuth();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/admin" />;
  }

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">GreenTech Energy</h1>
          <p className="text-gray-600">Админ-панель</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>
              Введите ваши учетные данные для доступа к админ-панели
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  {...form.register("username")}
                  data-testid="input-username"
                  className="mt-1"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  data-testid="input-password"
                  className="mt-1"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Вход..." : "Войти"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Демо-доступ:</p>
              <p>Логин: <code className="bg-gray-100 px-1 rounded">admin</code></p>
              <p>Пароль: <code className="bg-gray-100 px-1 rounded">admin</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}