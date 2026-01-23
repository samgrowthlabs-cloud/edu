/**
 * Sistema de Gerenciamento de Idiomas para Educafinance
 */
class LanguageManager {
    constructor() {
        this.currentLang = 'pt-BR';
        this.translations = {};
        this.init();
    }
    
    async init() {
        // 1. Verificar localStorage primeiro
        const savedLang = localStorage.getItem('educafinance-lang');
        if (savedLang && (savedLang === 'pt-BR' || savedLang === 'fr-FR')) {
            this.currentLang = savedLang;
        }
        // 2. Se não, detectar do navegador
        else {
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('fr')) {
                this.currentLang = 'fr-FR';
            } else {
                this.currentLang = 'pt-BR';
            }
        }
        
        // 3. Carregar traduções
        await this.loadTranslations(this.currentLang);
        
        // 4. Aplicar traduções
        this.applyTranslations();
        
        // 5. Configurar botão de troca
        this.setupLanguageSwitcher();
        
        // 6. Atualizar HTML lang
        document.documentElement.lang = this.currentLang;
        
        console.log(`Idioma carregado: ${this.currentLang}`);
    }
    
    async loadTranslations(lang) {
        try {
            // CORREÇÃO: Calcular caminho correto baseado na localização atual
            let path = 'lang/';
            
            // Verificar se estamos em uma subpasta
            const currentPath = window.location.pathname;
            if (currentPath.includes('/como_funciona/') || currentPath.includes('/solicitacao/')) {
                path = '../lang/';
            }
            
            console.log(`Carregando traduções de: ${path}${lang}.json`);
            
            const response = await fetch(`${path}${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - Não encontrado: ${path}${lang}.json`);
            }
            this.translations = await response.json();
            console.log(`Traduções carregadas com sucesso para: ${lang}`);
        } catch (error) {
            console.error(`Erro ao carregar traduções (${lang}):`, error);
            
            // Fallback para pt-BR
            if (lang !== 'pt-BR') {
                console.log(`Tentando fallback para pt-BR...`);
                await this.loadTranslations('pt-BR');
                this.currentLang = 'pt-BR';
            } else {
                // Se nem pt-BR carregar, usar traduções embutidas
                console.error('Não foi possível carregar nenhum arquivo de tradução');
                this.translations = this.getFallbackTranslations();
            }
        }
    }
    
    applyTranslations() {
        // Atualizar todos os elementos com data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        let translatedCount = 0;
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[key]) {
                element.textContent = this.translations[key];
                translatedCount++;
                
                // Placeholders (inputs, textareas)
                if (element.placeholder !== undefined) {
                    element.placeholder = this.translations[key];
                }
                
                // Placeholders específicos
                if (element.hasAttribute('data-i18n-placeholder')) {
                    const placeholderKey = element.getAttribute('data-i18n-placeholder');
                    if (this.translations[placeholderKey]) {
                        element.placeholder = this.translations[placeholderKey];
                    }
                }
                
                // Alt text para imagens
                if (element.alt !== undefined) {
                    element.alt = this.translations[key];
                }
                
                // Title attributes
                if (element.hasAttribute('title')) {
                    element.setAttribute('title', this.translations[key]);
                }
            } else {
                console.warn(`Chave de tradução não encontrada: ${key}`);
            }
        });
        
        console.log(`Traduzidos ${translatedCount} elementos`);
        
        // Atualizar botão de idioma
        const switchBtn = document.getElementById('language-switch');
        if (switchBtn) {
            switchBtn.textContent = this.currentLang === 'pt-BR' ? 'FR' : 'PT';
        }
    }
    
    setupLanguageSwitcher() {
        const switchBtn = document.getElementById('language-switch');
        if (switchBtn) {
            // Configurar texto inicial
            switchBtn.textContent = this.currentLang === 'pt-BR' ? 'FR' : 'PT';
            
            // Adicionar evento de clique
            switchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchLanguage();
            });
        }
    }
    
    async switchLanguage() {
        const newLang = this.currentLang === 'pt-BR' ? 'fr-FR' : 'pt-BR';
        console.log(`Trocando idioma para: ${newLang}`);
        
        // Salvar preferência
        localStorage.setItem('educafinance-lang', newLang);
        
        // Atualizar e recarregar traduções
        this.currentLang = newLang;
        await this.loadTranslations(newLang);
        this.applyTranslations();
        
        // Atualizar botão
        const switchBtn = document.getElementById('language-switch');
        if (switchBtn) {
            switchBtn.textContent = newLang === 'pt-BR' ? 'FR' : 'PT';
        }
        
        // Atualizar HTML lang
        document.documentElement.lang = newLang;
        
        console.log(`Idioma alterado para: ${newLang}`);
    }
    
    getTranslation(key) {
        return this.translations[key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    // Fallback caso os arquivos JSON não carreguem
    getFallbackTranslations() {
        return {
            // Navegação básica
            'logo_text': 'Educafinance',
            'logo_subtext': 'by SamGrowthLabs',
            'nav_home': 'Início',
            'nav_how': 'Como funciona',
            'nav_request': 'Solicitação',
            
            // Textos essenciais
            'hero_title': 'Educafinance',
            'hero_subtitle': 'Educação financeira para autonomia e responsabilidade',
            'hero_highlight': 'Ensinamos como não ser burro com dinheiro.',
            'footer_privacy': 'Política de Privacidade',
            'footer_copyright': 'Todos os direitos reservados.'
        };
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.langManager = new LanguageManager();
});

// Adicionar também tratamento de erro global para fetch
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' && e.target.src.includes('lang.js')) {
        console.error('Erro ao carregar lang.js:', e.error);
    }
});