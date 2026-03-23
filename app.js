document.addEventListener('DOMContentLoaded', () => {
    
    // 1. NAVEGACIÓN SPA (Single Page Application)
    const navLinks = document.querySelectorAll('[data-target]');
    const views = document.querySelectorAll('.view');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = 'view-' + link.getAttribute('data-target');
            
            // Actualizar estado de botones en el navbar
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            if(link.tagName === 'A') {
                link.classList.add('active');
            }
            
            // Ocultar todas las vistas y mostrar la objetivo
            views.forEach(view => {
                view.classList.remove('active-view');
                view.classList.add('hidden-view');
            });
            
            const targetView = document.getElementById(targetId);
            if(targetView) {
                targetView.classList.remove('hidden-view');
                targetView.classList.add('active-view');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 2. LÓGICA DEL CUESTIONARIO DE ELEGIBILIDAD (RapidPass)
    const questions = document.querySelectorAll('.question-step');
    let currentStep = 0;

    // Botones de respuesta predeterminada (pasar a la siguiente)
    const noBtns = document.querySelectorAll('.no-btn');
    noBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            
            // Ocultar pregunta actual
            questions[currentStep].classList.remove('active');
            questions[currentStep].classList.add('hidden');
            
            currentStep++;
            
            // Mostrar siguiente o terminar
            if(currentStep < questions.length) {
                questions[currentStep].classList.remove('hidden');
                questions[currentStep].classList.add('active');
            } else {
                showQuizResult('success');
            }
        });
    });

    // Botones de falla en elegibilidad
    const failBtns = document.querySelectorAll('[data-fail="true"]');
    failBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ocultar pregunta actual
            questions[currentStep].classList.remove('active');
            questions[currentStep].classList.add('hidden');
            showQuizResult('fail');
        });
    });

    function showQuizResult(result) {
        if(result === 'success') {
            document.getElementById('quiz-success').classList.remove('hidden');
            document.getElementById('quiz-success').classList.add('active');
        } else {
            document.getElementById('quiz-fail').classList.remove('hidden');
            document.getElementById('quiz-fail').classList.add('active');
        }
    }

    // 3. ASISTENTE IA (Burbuja)
    const aiBtn = document.querySelector('.ai-assistant-btn');
    if(aiBtn) {
        aiBtn.addEventListener('click', () => {
            alert('¡Hola! Soy Jamie, tu asistente virtual. He sido invocado, pero la lógica de mi chat estará lista en la próxima iteración. ¿Tenes alguna duda sobre donación?');
        });
    }

    // SIMULACIÓN: Animación Termómetro aleatoria en load para dar efecto de "Live Data"
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        // Obtenemos el tamaño actual por clase
        let currentWidth = 10;
        if(bar.classList.contains('fill-30')) currentWidth = 30;
        if(bar.classList.contains('fill-40')) currentWidth = 40;
        if(bar.classList.contains('fill-80')) currentWidth = 80;

        // Comienza en 0 para animar
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = currentWidth + '%';
        }, 300);
    });

});
