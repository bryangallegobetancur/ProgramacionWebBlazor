// Carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function nextSlide() {   
    currentSlide = (currentSlide + 1) % slides.length;
}

setInterval(nextSlide, 4000);

// Navegación entre secciones
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Formulario
function irACuento() {
    const form = document.getElementById('quoteForm');

    if (!form || !form.reportValidity()) {
        console.error("Formulario no encontrado o contiene campos inválidos.");
        return;
    }

    const datos = {
        nombre: form.querySelector('[name="nombre"]').value,
        apodo: form.querySelector('[name="apodo"]').value,
        colorCabello: form.querySelector('[name="colorCabello"]').value,
        colorOjos: form.querySelector('[name="colorOjos"]').value,
        edad: form.querySelector('[name="edad"]').value,
        hobby: form.querySelector('[name="hobby_categoria"]').value
    };

    const params = new URLSearchParams();
    for (const key in datos) {
        params.append(key, datos[key]);
    }

    const queryString = params.toString();

    const POPUP_URL = `Cuento?${queryString}`;
    const nombreVentana = 'Cuento.razor';
    const caracteristicas = 'width=650,height=750,left=100,top=50,scrollbars=yes,resizable=yes';

    const nuevaVentana = window.open(POPUP_URL, nombreVentana, caracteristicas);

    if (!nuevaVentana) {
        alert('Parece que el navegador ha bloqueado la ventana emergente. Por favor, revísalo.');
    }
}