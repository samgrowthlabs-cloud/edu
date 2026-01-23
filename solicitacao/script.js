// Script específico para a página de Solicitação
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar menu mobile
        initMobileMenu();
        
        // Atualizar ano no rodapé
        updateCurrentYear();
        
        // Inicializar máscaras
        initMasks();
        
        // Inicializar validação do formulário
        initFormValidation();
    });
    
    function initMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
    
    function updateCurrentYear() {
        const currentYear = document.getElementById('current-year');
        if (currentYear) {
            currentYear.textContent = new Date().getFullYear();
        }
    }
    
    function initMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.substring(0, 11);
                }
                
                if (value.length > 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                } else if (value.length > 3) {
                    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                }
                
                e.target.value = value;
            });
        }
        
        // Máscara para telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.substring(0, 11);
                }
                
                if (value.length > 10) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{1,4})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/(\d{1,2})/, '($1');
                }
                
                e.target.value = value;
            });
        }
    }
    
    function initFormValidation() {
        const form = document.getElementById('request-form');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                sendToWhatsApp();
            }
        });
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
    
    function validateForm() {
        const form = document.getElementById('request-form');
        let isValid = true;
        
        // Validar nome
        const nameInput = document.getElementById('full-name');
        if (!validateField(nameInput)) isValid = false;
        
        // Validar CPF
        const cpfInput = document.getElementById('cpf');
        if (!validateField(cpfInput)) isValid = false;
        
        // Validar telefone
        const phoneInput = document.getElementById('phone');
        if (!validateField(phoneInput)) isValid = false;
        
        // Validar checkbox
        const privacyCheckbox = document.getElementById('privacy');
        if (!privacyCheckbox.checked) {
            showError(privacyCheckbox, 'É necessário aceitar a política de privacidade');
            isValid = false;
        } else {
            clearError(privacyCheckbox);
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch (field.id) {
            case 'full-name':
                if (value.length < 3) {
                    errorMessage = 'Nome deve ter pelo menos 3 caracteres';
                    isValid = false;
                } else if (!/^[a-zA-ZÀ-ÿ\s]{3,}$/.test(value)) {
                    errorMessage = 'Nome deve conter apenas letras';
                    isValid = false;
                }
                break;
                
            case 'cpf':
                const cpfNumbers = value.replace(/\D/g, '');
                if (cpfNumbers.length !== 11) {
                    errorMessage = 'CPF deve ter 11 dígitos';
                    isValid = false;
                }
                break;
                
            case 'phone':
                const phoneNumbers = value.replace(/\D/g, '');
                if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
                    errorMessage = 'Telefone deve ter 10 ou 11 dígitos';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            showError(field, errorMessage);
        } else {
            clearError(field);
        }
        
        return isValid;
    }
    
    function showError(field, message) {
        const errorId = field.id + '-error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.add('error');
            field.classList.remove('success');
        }
    }
    
    function clearError(field) {
        const errorId = field.id + '-error';
        const errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
            
            if (field.value.trim() !== '') {
                field.classList.add('success');
            }
        }
    }
    
    function sendToWhatsApp() {
        // Coletar dados do formulário
        const name = document.getElementById('full-name').value;
        const cpf = document.getElementById('cpf').value;
        const phone = document.getElementById('phone').value;
        
        // Formatar mensagem para WhatsApp
        const message = `*Nova Solicitação - Educafinance*\n\n` +
                       `*Nome:* ${name}\n` +
                       `*CPF:* ${cpf}\n` +
                       `*Telefone:* ${phone}\n\n` +
                       `Solicitação enviada através do site edu.samgrowthlabs.com`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Número do WhatsApp 
        const whatsappNumber = '5544999062446'; //
        
        // Criar link do WhatsApp
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp em nova aba
        window.open(whatsappURL, '_blank');
        
        // Limpar formulário
        document.getElementById('request-form').reset();
        
        // Remover classes de validação
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('success');
        });
        
        // Mostrar mensagem de sucesso (opcional)
        alert('Solicitação enviada! Você será redirecionado para o WhatsApp.');
    }
})();