/* script.js - JavaScript único para MI_CV.html Integra las herramientas del currículum y funciones DOM adaptadas de la actividad. ENTRADA: elementos HTML, botones y datos que escribe la persona. PROCESO: eventos, creación de campos, cambios de estilos y operaciones. SALIDA: alertas, cambios visuales y contenido añadido a la página. */

document.addEventListener("DOMContentLoaded", function () {
  // Alerta cada vez que se abre o refresca la página.
  window.alert(
    "¡Bienvenido/a a mi currículum! La página se ha cargado correctamente."
  );

  // ===== Herramientas visuales =====
  const botonTema = document.querySelector("#btn-tema");
  const botonTextoMas = document.querySelector("#btn-texto-mas");
  const botonTextoMenos = document.querySelector("#btn-texto-menos");
  const botonRestablecer = document.querySelector("#btn-restablecer");
  const botonArriba = document.querySelector("#btn-arriba");
  const enlacesMenu = document.querySelectorAll(".menu-link");
  const imagenes = document.querySelectorAll("body img:not(.marca-agua)");
  const botonCambiarPresentacion = document.querySelector(
    "#btn-cambiar-presentacion"
  );
  const botonAgregarHabilidad = document.querySelector(
    "#btn-agregar-habilidad"
  );
  let tamanoTexto = 16;
  let modoOscuroActivado = false;

  if (botonTema) {
    botonTema.addEventListener("click", function () {
      modoOscuroActivado = !modoOscuroActivado;
      document.body.classList.toggle("modo-oscuro", modoOscuroActivado);
      botonTema.textContent = modoOscuroActivado
        ? "☀️ Modo claro"
        : "🌙 Modo oscuro";
      botonTema.setAttribute("aria-pressed", String(modoOscuroActivado));
    });
  }
  if (botonTextoMas)
    botonTextoMas.addEventListener("click", function () {
      tamanoTexto = Math.min(tamanoTexto + 1, 24);
      document.documentElement.style.setProperty(
        "--tamano-texto-js",
        tamanoTexto + "px"
      );
    });
  if (botonTextoMenos)
    botonTextoMenos.addEventListener("click", function () {
      tamanoTexto = Math.max(tamanoTexto - 1, 12);
      document.documentElement.style.setProperty(
        "--tamano-texto-js",
        tamanoTexto + "px"
      );
    });
  if (botonRestablecer)
    botonRestablecer.addEventListener("click", function () {
      tamanoTexto = 16;
      document.documentElement.style.removeProperty("--tamano-texto-js");
      modoOscuroActivado = false;
      document.body.classList.remove("modo-oscuro");
      if (botonTema) {
        botonTema.textContent = "🌙 Modo oscuro";
        botonTema.setAttribute("aria-pressed", "false");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  // Navegación suave a secciones.
  enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
      const selector = enlace.getAttribute("href");
      const destino = selector ? document.querySelector(selector) : null;
      if (destino) {
        evento.preventDefault();
        destino.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Botón flotante para regresar arriba.
  function actualizarBotonArriba() {
    if (botonArriba)
      botonArriba.classList.toggle("visible", window.scrollY > 300);
  }
  window.addEventListener("scroll", actualizarBotonArriba);
  actualizarBotonArriba();
  if (botonArriba)
    botonArriba.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  // Ampliar imágenes con clic (no intercepta imágenes que sean enlaces).
  imagenes.forEach(function (imagen) {
    if (imagen.closest("a")) return;
    imagen.style.cursor = "zoom-in";
    imagen.addEventListener("click", function () {
      const visor = document.createElement("div");
      visor.className = "visor-imagen-js";
      visor.setAttribute("role", "dialog");
      visor.setAttribute("aria-label", "Vista ampliada de la imagen");
      const grande = document.createElement("img");
      grande.src = imagen.src;
      grande.alt = imagen.alt || "Imagen ampliada";
      const cerrar = document.createElement("button");
      cerrar.type = "button";
      cerrar.className = "cerrar-visor-js";
      cerrar.textContent = "✕";
      cerrar.setAttribute("aria-label", "Cerrar imagen ampliada");
      function cerrarVisor() {
        visor.remove();
        document.removeEventListener("keydown", teclaEscape);
      }
      function teclaEscape(evento) {
        if (evento.key === "Escape") cerrarVisor();
      }
      cerrar.addEventListener("click", cerrarVisor);
      visor.addEventListener("click", function (evento) {
        if (evento.target === visor) cerrarVisor();
      });
      visor.append(cerrar, grande);
      document.body.appendChild(visor);
      document.addEventListener("keydown", teclaEscape);
    });
  });

  // ===== Campos dinámicos de colegios (adaptado de colegios.js) =====
  const entradaNumero = document.getElementById("numeroColegios");
  const contenedorColegios = document.getElementById("detalleEstudios");
  if (entradaNumero && contenedorColegios) {
    function crearCamposColegios() {
      let cantidad = Number.parseInt(entradaNumero.value, 10);
      contenedorColegios.replaceChildren();
      if (
        entradaNumero.value.trim() === "" ||
        !Number.isInteger(cantidad) ||
        cantidad < 0
      )
        return;
      if (cantidad > 20) {
        window.alert("Puedes ingresar como máximo 20 colegios.");
        cantidad = 20;
        entradaNumero.value = "20";
      }
      if (cantidad === 0) return;
      const titulo = document.createElement("p");
      const negrita = document.createElement("strong");
      negrita.textContent = "Detalle de estudios:";
      titulo.appendChild(negrita);
      contenedorColegios.appendChild(titulo);
      for (let i = 1; i <= cantidad; i++) {
        const fila = document.createElement("div");
        fila.className = "campo-colegio";
        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "colegio" + i;
        etiqueta.textContent = "Colegio " + i + ":";
        const campo = document.createElement("input");
        campo.type = "text";
        campo.id = "colegio" + i;
        campo.name = "colegios[]";
        campo.placeholder = "Nombre del colegio " + i;
        campo.maxLength = 100;
        fila.append(etiqueta, campo);
        contenedorColegios.appendChild(fila);
      }
    }
    entradaNumero.addEventListener("input", crearCamposColegios);
    entradaNumero.addEventListener("change", crearCamposColegios);
    crearCamposColegios();
  }

  // ===== Funciones DOM útiles adaptadas de 2008.js =====
  // Cambia el título de presentación y muestra confirmación.
  if (botonCambiarPresentacion)
    botonCambiarPresentacion.addEventListener("click", function () {
      const titulo = document.getElementById("titulo-presentacion");
      if (!titulo) return;
      const confirmar = window.confirm(
        "¿Deseas cambiar el título de presentación?"
      );
      if (confirmar) {
        titulo.textContent = "Acerca de mí: ¡siempre aprendiendo!";
        titulo.style.backgroundColor = "#d9f99d";
        titulo.style.color = "#4c1d95";
      } else window.alert("No se realizaron cambios.");
    });

  // Agrega una habilidad mediante createElement y appendChild.
  if (botonAgregarHabilidad)
    botonAgregarHabilidad.addEventListener("click", function () {
      const nombre = window.prompt("Escribe la habilidad que deseas agregar:");
      if (!nombre || !nombre.trim()) return;
      const lista = document.getElementById("lista-habilidades");
      if (!lista) return;
      const nuevaLinea = document.createElement("div");
      nuevaLinea.textContent = nombre.trim();
      nuevaLinea.className = "habilidad-agregada-js";
      lista.appendChild(nuevaLinea);
    });

  // Deja un registro de carga y demuestra operaciones matemáticas en consola.
  const valor1 = 40;
  const valor2 = 60;
  console.log("Suma de ejemplo:", valor1 + valor2);
  console.log("Resta de ejemplo:", valor1 - valor2);
  console.log("JavaScript único cargado correctamente.");
});
