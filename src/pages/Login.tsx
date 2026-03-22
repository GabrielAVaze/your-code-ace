import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isRegister) {
        await signUpWithEmail(form.email, form.password, form.name);
        toast.success("Conta criada! Verifique seu email.");
      } else {
        await signInWithEmail(form.email, form.password);
        toast.success("Login realizado!");
        navigate("/");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Erro ao entrar com Google.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">{isRegister ? "Criar conta" : "Entrar"}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          {isRegister ? "Preencha os dados para criar sua conta." : "Acesse sua conta para continuar."}
        </p>

        <Button onClick={handleGoogle} variant="outline" className="w-full mb-4 gap-2">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
          Continuar com Google
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-card px-2">ou</span>
          </div>
        </div>

        <div className="space-y-3">
          {isRegister && (
            <div>
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="seu@email.com" />
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
          {loading ? "Carregando..." : isRegister ? "Criar conta" : "Entrar"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-foreground underline">
            {isRegister ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;