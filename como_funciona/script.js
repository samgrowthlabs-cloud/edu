// Script específico para a página Como Funciona
(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar menu mobile
        initMobileMenu();
        
        // Atualizar ano no rodapé
        updateCurrentYear();
        
        // Animar elementos ao scroll
        initScrollAnimations();
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
    
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.step-card, .differentiator-card');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
})();