const fs = require('fs');
const path = require('path');

// Tamanhos de ícones necessários para PWA
const iconSizes = [
  16, 32, 57, 60, 72, 76, 96, 114, 120, 128, 144, 152, 180, 192, 384, 512
];

// Conteúdo do SVG base
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0f23;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a3a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="url(#grad1)"/>
  
  <!-- Dollar Sign -->
  <path d="M256 96C176.5 96 112 160.5 112 240c0 47.7 23.9 89.9 60.5 115.5C208.1 371.1 256 384 256 384s47.9-12.9 83.5-28.5C376.1 329.9 400 287.7 400 240c0-79.5-64.5-144-144-144z" fill="#10b981"/>
  
  <!-- Dollar Symbol -->
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="#ffffff">$</text>
  
  <!-- AI Symbol -->
  <text x="256" y="380" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#10b981">AI</text>
</svg>`;

// Função para criar um ícone PNG simples (placeholder)
function createPNGIcon(size) {
  // Este é um placeholder - em produção você usaria uma biblioteca como sharp ou canvas
  // para converter o SVG para PNG
  console.log(`Gerando ícone ${size}x${size}...`);
  
  // Por enquanto, vamos criar um arquivo de texto como placeholder
  const placeholderContent = `# Placeholder para ícone ${size}x${size}
# Em produção, este arquivo seria um PNG real gerado a partir do SVG
# Para gerar os ícones reais, você pode usar:
# - sharp (Node.js)
# - imagemagick
# - online SVG to PNG converters
# - design tools como Figma, Sketch, etc.

SVG Base:
${svgContent}

Tamanho: ${size}x${size}
Gerado em: ${new Date().toISOString()}
`;

  return placeholderContent;
}

// Função principal
function generateIcons() {
  const iconsDir = path.join(__dirname, '../public/icons');
  
  // Criar diretório se não existir
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  console.log('🎨 Gerando ícones para PWA...');
  
  iconSizes.forEach(size => {
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    // Criar placeholder
    const content = createPNGIcon(size);
    
    // Salvar como .txt por enquanto (em produção seria .png)
    fs.writeFileSync(filepath.replace('.png', '.txt'), content);
    
    console.log(`✅ ${filename} criado`);
  });
  
  console.log('\n📝 Nota: Os arquivos foram criados como .txt como placeholders.');
  console.log('🔄 Para ícones reais, converta o SVG base para PNG nos tamanhos necessários.');
  console.log('💡 Você pode usar ferramentas online ou bibliotecas como sharp para conversão.');
}

// Executar se chamado diretamente
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons }; 