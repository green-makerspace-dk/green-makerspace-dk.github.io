/**
 * Green Makerspace Internationalization System
 * Supports English (default), Danish, and German
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.supportedLanguages = ['en', 'da', 'de'];
        this.fallbackLanguage = 'en';
        
        // Initialize language from localStorage or browser preference
        this.initializeLanguage();
    }

    /**
     * Initialize the language system
     */
    async initializeLanguage() {
        // Try to get saved language preference
        const savedLang = localStorage.getItem('green-makerspace-language');
        
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (this.supportedLanguages.includes(browserLang)) {
                this.currentLanguage = browserLang;
            }
        }

        // Load translations
        await this.loadTranslations();
        
        // Apply translations to current page
        this.translatePage();
        
        // Update language selector
        this.updateLanguageSelector();
    }

    /**
     * Load translation files
     */
    async loadTranslations() {
        try {
            for (const lang of this.supportedLanguages) {
                const response = await fetch(`/js/translations/${lang}.json`);
                if (response.ok) {
                    this.translations[lang] = await response.json();
                }
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    /**
     * Get translated text for a key
     */
    t(key, lang = null) {
        const targetLang = lang || this.currentLanguage;
        const keys = key.split('.');
        
        let translation = this.translations[targetLang];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to default language
                translation = this.translations[this.fallbackLanguage];
                for (const k of keys) {
                    if (translation && translation[k]) {
                        translation = translation[k];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }
        
        return translation || key;
    }

    /**
     * Change language
     */
    async changeLanguage(newLang) {
        if (!this.supportedLanguages.includes(newLang)) {
            console.error(`Language ${newLang} not supported`);
            return;
        }

        this.currentLanguage = newLang;
        localStorage.setItem('green-makerspace-language', newLang);
        
        // Reload translations if needed
        if (!this.translations[newLang]) {
            await this.loadTranslations();
        }
        
        this.translatePage();
        this.updateLanguageSelector();
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: newLang } 
        }));
    }

    /**
     * Translate the current page
     */
    translatePage() {
        // Translate elements with data-i18n attribute (text content)
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate elements with data-i18n-html attribute (HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            element.innerHTML = translation;
        });

        // Translate placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Translate title attributes
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    /**
     * Update language selector active state
     */
    updateLanguageSelector() {
        const languageButtons = document.querySelectorAll('.language-selector button');
        languageButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Initialize i18n system
const i18n = new I18n();

// Global function for easy access
window.t = (key) => i18n.t(key);
window.changeLanguage = (lang) => i18n.changeLanguage(lang);

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.initializeLanguage());
} else {
    i18n.initializeLanguage();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
