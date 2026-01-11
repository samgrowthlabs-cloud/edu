// Script específico para a página "Como Funciona"

document.addEventListener('DOMContentLoaded', function() {
    // Efeito de contagem nos números das cards
    const howItWorksCards = document.querySelectorAll('.how-it-works-card');
    
    howItWorksCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.how-it-works-number');
            if (number) {
                number.style.color = 'rgba(255, 255, 255, 0.1)';
                number.style.transform = 'scale(1.1)';
                number.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.how-it-works-number');
            if (number) {
                number.style.color = 'rgba(255, 255, 255, 0.05)';
                number.style.transform = 'scale(1)';
            }
        });
    });
    
    // Animação de entrada para os itens da estrutura do curso
    const structureItems = document.querySelectorAll('.structure-item');
    
    function animateOnScroll() {
        structureItems.forEach(item => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configurar estado inicial
    structureItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar na carga inicial
    animateOnScroll();
    
    // Verificar durante o scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Adicionar ano atual no rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});