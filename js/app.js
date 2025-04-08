//Selectores

const fotoInput = document.querySelector('#foto')
const nombreInput = document.querySelector('#nombre')
const emailInput = document.querySelector('#email')
const githubInput = document.querySelector('#github')


const ticketfecha = document.querySelector('#ticket-fecha')
const imagensubida = document.querySelector('#imagen-subida')
const ticketnombre = document.querySelector('#ticket-nombre')
const ticketgithub = document.querySelector('#ticket-github')

const cnall = document.querySelector('#container-all')
const cnallticket = document.querySelector('#container-all-ticket')

const formulario = document.querySelector('#formulario')

//Objeto de formulario

const formObj = {
    foto: '',
    nombre: '',
    email: '',
    github: ''
}

//Eventos

fotoInput.addEventListener('change',validarImagen);
nombreInput.addEventListener('change',datosform);
emailInput.addEventListener('change',datosform);
githubInput.addEventListener('change',datosform);

formulario.addEventListener('submit',submitForm);


function datosform(e){
    formObj[e.target.name] = e.target.value
}

function submitForm(e) {
    e.preventDefault();

    let hayError = false;

    // Limpiar todos los mensajes previos
    document.querySelectorAll('.alert').forEach(alerta => alerta.remove());

    if (formObj.nombre.trim() === '') {
        new Notificacion({
            texto: 'El campo de nombre está vacío.',
            tipo: 'error',
            campo: document.querySelector('#nombre')
        });
        hayError = true;
    }

    if (formObj.email.trim() === '') {
        new Notificacion({
            texto: 'El campo de correo no ha sido llenado.',
            tipo: 'error',
            campo: document.querySelector('#email')
        });
        hayError = true;
    }

    if (formObj.github.trim() === '') {
        new Notificacion({
            texto: 'El campo de GitHub está vacío.',
            tipo: 'error',
            campo: document.querySelector('#github')
        });
        hayError = true;
    }

    if (formObj.foto.trim() === '') {
        new Notificacion({
            texto: 'No se ha subido la foto.',
            tipo: 'error',
            campo: document.querySelector('#foto')
        });
        hayError = true;
    }

    if (hayError) return;

    // Si todo está bien
    new Notificacion({
        texto: 'Formulario enviado correctamente.',
        tipo: 'correcto',
        campo: document.querySelector('#formulario')
    });

    // Actualizar contenido del ticket
    ticketfecha.textContent = new Date().toLocaleDateString('es-PE');
    ticketnombre.textContent = formObj.nombre;
    ticketgithub.textContent = formObj.github;

    // Mostrar imagen subida en el ticket
    imagensubida.src = URL.createObjectURL(fotoInput.files[0]);


    // Continuar con el envío real

    cnall.style.display='none';

    //Muestra el ticket

    cnallticket.style.display = 'block'

}



function validarImagen(e) {
    const archivo = e.target.files[0];

    if (!archivo) return; // Si no hay archivo seleccionado, no hacer nada

    const tipoPermitido = ['image/jpeg', 'image/png'];
    const tamañoMaximo = 500 * 1024; // 500 KB en bytes

    if (!tipoPermitido.includes(archivo.type)) {
        new Notificacion({
            texto: 'Formato no permitido. Solo se aceptan imágenes JPG o PNG.',
            tipo: 'error',
            campo: fotoInput
        });
        e.target.value = '';
        formObj.foto = '';
        return;
    }

    if (archivo.size > tamañoMaximo) {
        new Notificacion({
            texto: 'La imagen supera el tamaño máximo de 500KB.',
            tipo: 'error',
            campo: fotoInput
        });
        e.target.value = '';
        formObj.foto = '';
        return;
    }

    // Si la validación es correcta, mostrar la previsualización en el área de carga
    const reader = new FileReader();
    reader.onload = function () {
        const label = fotoInput.parentElement.querySelector('label');
        const imgPreview = document.createElement('img');
        imgPreview.src = reader.result;
        imgPreview.alt = 'Imagen seleccionada';
        imgPreview.classList.add('drop-zone-image');
        
        // Reemplazar la imagen del ícono con la imagen subida
        const icon = label.querySelector('img');
        icon.style.display = 'none';  // Ocultar el ícono por defecto
        label.appendChild(imgPreview);  // Agregar la imagen subida
    };
    reader.readAsDataURL(archivo);

    // Actualiza formObj
    formObj.foto = archivo.name;
}

function mostrarPreview(src) {
    let contenedor = fotoInput.parentElement;

    // Eliminar imagen previa si existe
    const anterior = contenedor.querySelector('.preview-img');
    if (anterior) anterior.remove();

    // Crear imagen de preview
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Previsualización';
    img.classList.add('preview-img');

    contenedor.appendChild(img);
}



class Notificacion {
    constructor({ texto, tipo = 'error', campo = null }) {
        this.texto = texto;
        this.tipo = tipo;
        this.campo = campo; // El input debajo del cual se mostrará el mensaje
        this.mostrar();
    }

    mostrar() {
        if (!this.campo) return;

        // Eliminar mensajes anteriores para ese campo
        const anterior = this.campo.parentElement.querySelector('.alert');
        if (anterior) anterior.remove();

        // Crear alerta
        const alerta = document.createElement('div');
        alerta.classList.add('alert', this.tipo);
        alerta.textContent = this.texto;

        // Insertar debajo del input
        this.campo.parentElement.appendChild(alerta);
    }
}

