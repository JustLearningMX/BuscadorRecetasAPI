import '../css/header.css'
import '../css/search.css'
import '../css/random.css'
import '../css/acercade.css'

//ABRIR-CERRAR MENÚ HAMBURGUESA
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".menu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("nav-menu_visible");

    if (navMenu.classList.contains("nav-menu_visible")) {
        navToggle.setAttribute("aria-label", "Abrir menú");
    } else {
        navToggle.setAttribute("aria-label", "Cerrar menú");
    }
});  //HACER QUE CAMBIE EL AMARILLO DE LA OPCIÓN DEL MENÚ

window.addEventListener("click", (event) =>{//Moverse entre secciones
    const nodoAnterior = event.path[1].previousSibling.previousSibling;
    const nodoActual = event.path[1];
    const nodoSiguiente = event.path[1].nextSibling.nextSibling;

    if(nodoActual.getAttribute('id') ==="menu-items"){//Si se eligió una opción del menú
        navMenu.classList.toggle("nav-menu_visible");//Se oculta el menú

        if (!nodoAnterior && nodoSiguiente){//Buscar
            if(nodoActual.className === "" && nodoSiguiente.className === "selected"){
                nodoActual.classList.toggle("selected");
                nodoSiguiente.classList.toggle("selected");
            }else if(nodoActual.className === "" && nodoSiguiente.className === ""){
                nodoActual.classList.toggle("selected");
                nodoSiguiente.nextSibling.nextSibling.classList.toggle("selected");
            }
        } else if(nodoAnterior && nodoSiguiente){//Aleatorio
            if(nodoActual.className === "" && nodoAnterior.className === "selected"){
                nodoActual.classList.toggle("selected");
                nodoAnterior.classList.toggle("selected");
            }else if(nodoActual.className === "" && nodoSiguiente.className === "selected"){
                nodoActual.classList.toggle("selected");
                nodoSiguiente.classList.toggle("selected");
            }
        }else if(nodoAnterior && !nodoSiguiente){//Acerca de
            if(nodoActual.className === "" && nodoAnterior.className === "selected"){
                nodoActual.classList.toggle("selected");
                nodoAnterior.classList.toggle("selected");
            }else if(nodoActual.className === "" && nodoAnterior.className === ""){
                nodoActual.classList.toggle("selected");
                nodoAnterior.previousSibling.previousSibling.classList.toggle("selected");
            }
        }
        console.log(nodoActual);
        console.log(nodoAnterior);
        console.log(nodoAnterior.previousSibling.previousSibling);
    }
});


/**BÚSQUEDA RANDOM */
function busquedaAleatoria() {
    const randomBtn = document.querySelector(".random-button");/*Botón de Comida Random*/

    randomBtn.addEventListener("click", () => {//Escuchamos al botón, si se clickea
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')/*Accede al API random */
            .then(res => res.json())//Obtiene el JSON
            .then(data => despliegaComidaAleatoria(data.meals))//Envía solo la comida a la función que mostrará la info
    });
}

function despliegaComidaAleatoria(meal) {//Función que muestra la receta random
    const randomFood = document.querySelector(".random-food_container");//Contenedor de los DIVS
    randomFood.style.height = "100%"

    const randomShowMeal = document.querySelector(".random-food_showMeal"); /*Contenedor donde irán los datos */
    randomShowMeal.style.display = "flex";/*Muestra el contenedor*/
    const thumb = meal[0].strMealThumb + "/preview";
    const titulo = meal[0].strMeal;
    randomShowMeal.children[1].setAttribute("src", thumb);
    randomShowMeal.children[0].textContent = titulo;//Coloca el nombre de la comida random      

    //Borramos los nodos previos en la sección imagenes de los ingredientes
    while (randomShowMeal.children[3].firstChild) {
        randomShowMeal.children[3].removeChild(randomShowMeal.children[3].firstChild);
    }

    let auxiliar = false;
    let contador = 0;

    //console.log(meal);
    for (const propiedad in meal[0]) {
        if (propiedad === "strIngredient1") {
            auxiliar = true;
        }

        if (meal[0][propiedad] === "" || meal[0][propiedad] === null) {
            auxiliar = false;
            contador = 0;
        }

        if (auxiliar) {
            contador++;
            const imgIngrediente = document.createElement("img");
            const imgSrc = "https://www.themealdb.com/images/ingredients/" + meal[0][propiedad] + "-Small.png";
            imgIngrediente.setAttribute("src", imgSrc);
            //randomShowMeal.children[3].appendChild(imgIngrediente);

            const nomIngrediente = document.createElement("h6");
            nomIngrediente.textContent = meal[0][propiedad];
            //randomShowMeal.children[3].appendChild(nomIngrediente);

            const cantIngrediente = document.createElement("p");
            cantIngrediente.textContent = meal[0]["strMeasure" + contador];

            const divIngrediente = document.createElement("div");
            divIngrediente.setAttribute("class", "divIngrediente");
            divIngrediente.appendChild(imgIngrediente);
            divIngrediente.appendChild(nomIngrediente);
            divIngrediente.appendChild(cantIngrediente);
            randomShowMeal.children[3].appendChild(divIngrediente);
        }
    }

    if (randomFood.children[3]) {//Si xiste un nodo 4 en el contenedor de las comidas random
        const nodo2 = randomFood.children[3];
        randomFood.removeChild(nodo2);//Se borra el nodo del video
    }

    if (randomFood.children[2]) {//Si xiste un nodo 3 en el contenedor de las comidas random
        const nodo = randomFood.children[2];
        randomFood.removeChild(nodo);//Se borra el nodo de las instrucciones
    }

    //Div para las instrucciones
    const divInstrucciones = document.createElement("div");
    const tituloInst = document.createElement("h5");
    const parrafo = document.createElement("p");
    divInstrucciones.setAttribute("class", "random-food_receta");
    tituloInst.textContent = "Instrucciones";
    parrafo.textContent = meal[0]["strInstructions"];

    divInstrucciones.appendChild(tituloInst);
    divInstrucciones.appendChild(parrafo);
    randomFood.appendChild(divInstrucciones);

    const oldLink = meal[0]["strYoutube"];//Link sin embebido
    const newLink = () => {//Link con el embebido
        let i= 0
        for (i = 1; i <= oldLink.length; i++) {
            if (oldLink.slice(i - 1, i) === '=') {
                break;               
            }
        }
        return "https://www.youtube.com/embed/"+oldLink.slice(i);
    }

    if (meal[0]["strYoutube"]) {//Si existe un video
        //Div para las instrucciones
        const divVideo = document.createElement("div");
        const tituloVideo = document.createElement("h5");
        const videoYoutube = document.createElement("iframe");

        tituloVideo.textContent = "Ver preparación";
        videoYoutube.setAttribute("src", newLink());
        videoYoutube.setAttribute("frameborder", "0");

        divVideo.setAttribute("class", "random-food_video");


        divVideo.appendChild(tituloVideo);
        divVideo.appendChild(videoYoutube);
        randomFood.appendChild(divVideo);
    }
}

busquedaAleatoria();