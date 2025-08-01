import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { resetPassword } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await resetPassword({ email });
      if (result.success) {
        setIsEmailSent(true);
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-white">F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance AI</h1>
            <p className="text-gray-600">Sistema de Gestão Financeira Inteligente</p>
          </div>

          {/* Card de Sucesso */}
          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Email enviado!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Enviamos um link para redefinir sua senha para{" "}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Verifique sua caixa de entrada e siga as instruções no email.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEmailSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Enviar novamente
                  </Button>
                  
                  <Link to="/auth/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar para o login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dicas */}
          <div className="mt-8 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Não recebeu o email?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Verifique sua pasta de spam</li>
                <li>• Confirme se o email está correto</li>
                <li>• Aguarde alguns minutos</li>
                <li>• Entre em contato com nosso suporte</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">F</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance AI</h1>
          <p className="text-gray-600">Sistema de Gestão Financeira Inteligente</p>
        </div>

        {/* Card de Recuperação */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Esqueceu sua senha?
            </CardTitle>
            <CardDescription className="text-center">
              Digite seu email e enviaremos um link para redefinir sua senha
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  "Enviar link de recuperação"
                )}
              </Button>
            </form>

            {/* Links de Navegação */}
            <div className="text-center space-y-2">
              <Link
                to="/auth/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para o login
              </Link>
              
              <p className="text-xs text-gray-500">
                Não tem uma conta?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Segurança */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🔒 Segurança</h3>
            <p className="text-sm text-gray-600">
              O link de recuperação expira em 1 hora por segurança. 
              Se você não solicitou esta recuperação, ignore este email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 