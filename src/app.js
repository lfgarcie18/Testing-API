// Variables globales
const formulario = document.querySelector("#formulario");
const monedaSelect = document.querySelector("#moneda");
const criptomonedasSelect = document.querySelector("#criptomonedas");
const resultado = document.querySelector("#resultado");

// aqui es el objeto de busqueda
const objBusqueda = {
    moneda: "",
    criptomoneda: ""
};

// Evento cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    formulario.addEventListener("submit", submitFormulario);
    monedaSelect.addEventListener("change", leerValor);
    criptomonedasSelect.addEventListener("change", leerValor);
});

// Leer los valores seleccionados
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

// Enviar el formulario njd
function submitFormulario(e) {
    e.preventDefault();

    // Validar
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === "" || criptomoneda === "") {
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    // Consultar la API
    consultarAPI();
}

// Mostrar alerta si hay error
function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector(".error");
    if (!existeAlerta) {
        const divAlerta = document.createElement("div");
        divAlerta.classList.add("error");
        divAlerta.textContent = mensaje;
        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
}

// Consultar la API para obtener la cotización xd
function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((cotizacion) => {
            if (cotizacion.Response === "Error") {
                mostrarAlerta("Hubo un error en la consulta. Intenta nuevamente.");
            } else {
                mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
            }
        })
        .catch((error) => console.log(error));
}

// Aca se muestran los datos de cotizacion xd 
function mostrarCotizacionHTML(datos) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE, IMAGEURL } = datos;

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `Precio: ${PRICE}`;

    const precioAlta = document.createElement("p");
    precioAlta.classList.add("precio");
    precioAlta.innerHTML = `Precio más alto del día: ${HIGHDAY}`;

    const precioBajo = document.createElement("p");
    precioBajo.classList.add("precio");
    precioBajo.innerHTML = `Precio más bajo del día: ${LOWDAY}`;

    const variacion = document.createElement("p");
    variacion.classList.add("precio");
    variacion.innerHTML = `Variación en 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement("p");
    ultimaActualizacion.classList.add("precio");
    ultimaActualizacion.innerHTML = `Última actualización: ${LASTUPDATE}`;

    // Imagen de la criptomoneda
    const img = document.createElement("img");
    img.src = `https://www.cryptocompare.com${IMAGEURL}`;
    img.alt = "Criptomoneda";
    img.classList.add("logo-crypto");

    resultado.appendChild(img);
    resultado.appendChild(precio);
    resultado.appendChild(precioAlta);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(ultimaActualizacion);
    resultado.style.display = "block";
}

// Limpiar HTML antes de mostrar nueva cotización porfavor
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
