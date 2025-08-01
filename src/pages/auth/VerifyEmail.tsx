import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmail() {
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

        {/* Card de Verificação */}
        <Card className="shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifique seu email
                </h2>
                <p className="text-gray-600 mb-4">
                  Enviamos um link de confirmação para seu email. 
                  Clique no link para ativar sua conta.
                </p>
                <p className="text-sm text-gray-500">
                  Após confirmar, você poderá acessar todas as funcionalidades do Finance AI.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Já confirmei meu email
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

        {/* Benefícios */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            O que você pode fazer após confirmar?
          </h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Acessar o dashboard completo</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Gerenciar entradas e saídas</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Criar relatórios personalizados</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Configurar backup automático</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Usar o calendário integrado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 