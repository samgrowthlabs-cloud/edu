// Script específico para a página "Cursos"

document.addEventListener('DOMContentLoaded', function() {
    // Efeito hover nos cards de curso
    const courseCards = document.querySelectorAll('.course-card:not(.coming-soon)');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const badge = this.querySelector('.course-badge');
            if (badge) {
                badge.style.transform = 'scale(1.1)';
                badge.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const badge = this.querySelector('.course-badge');
            if (badge) {
                badge.style.transform = 'scale(1)';
            }
        });
    });
    
    // Animar cards de curso em sequência
    const courseCardsAll = document.querySelectorAll('.course-card');
    
    function animateCardsOnScroll() {
        courseCardsAll.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }
    
    // Configurar estado inicial
    courseCardsAll.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Verificar na carga inicial
    animateCardsOnScroll();
    
    // Verificar durante o scroll
    window.addEventListener('scroll', animateCardsOnScroll);
    
    // Adicionar ano atual no rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // Notificação para cursos em breve
    const comingSoonButtons = document.querySelectorAll('.coming-soon .btn');
    comingSoonButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Este curso estará disponível em breve. Fique atento às nossas atualizações!');
        });
    });
});