import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoliticaPrivacidade = () => {
  return (
    <Layout title="Política de Privacidade">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="finance-card">
          <CardHeader>
            <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">1. Coleta de Informações</h3>
              <p>
                O FinanceAI coleta informações que você nos fornece diretamente, como dados de cadastro,
                informações financeiras e dados de clientes que você inserir no sistema.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">2. Uso das Informações</h3>
              <p>
                Utilizamos suas informações para fornecer nossos serviços de gestão financeira,
                melhorar a experiência do usuário e garantir a segurança da plataforma.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">3. Segurança dos Dados</h3>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas
                informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">4. Compartilhamento de Dados</h3>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros,
                exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">5. Seus Direitos</h3>
              <p>
                Você tem o direito de acessar, corrigir, excluir ou transferir suas informações pessoais.
                Entre em contato conosco para exercer esses direitos.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground mb-3">6. Contato</h3>
              <p>
                Para questões sobre esta política, entre em contato através da página de contato
                ou pelo email: privacidade@financeai.com
              </p>
            </section>

            <div className="mt-8 p-4 bg-background/60 rounded-lg border border-border/20">
              <p className="text-sm">
                Última atualização: Janeiro de 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PoliticaPrivacidade;