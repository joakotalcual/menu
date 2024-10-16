import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjr6dBFDDPhyLp00VSM0HmSEjZLeC8V2Q",
    authDomain: "timbas-a4b91.firebaseapp.com",
    projectId: "timbas-a4b91",
    storageBucket: "timbas-a4b91.appspot.com",
    messagingSenderId: "113790179333",
    appId: "1:113790179333:web:115cdea257ffc6cd47e46c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function cargarMenu() {
    const loader = document.getElementById('loader');
    try {
        const categoriasSnapshot = await getDocs(collection(db, "categorias"));
        for (const categoriaDoc of categoriasSnapshot.docs) {
            const categoriaNombre = categoriaDoc.data().nombre;

            const categoriaId = categoriaNombre.toLowerCase().replace(/\s+/g, '-');

            const categoriaSection = document.querySelector(`section#${categoriaId} .menu-items`);
            const categoriaTitulo = document.querySelector(`section#${categoriaId} .categorias`);

            if (categoriaSection && categoriaTitulo) {
                if (categoriaTitulo.textContent.trim() === "") {
                    categoriaTitulo.textContent = categoriaNombre;
                }

                const productosRef = collection(db, "productos");
                const q = query(productosRef, where("activo", "==", true), where("categorias", "==", categoriaDoc.id));

                const productosSnapshot = await getDocs(q);
                productosSnapshot.forEach((productoDoc) => {
                    const data = productoDoc.data();
                    const menuItem = document.createElement('div');
                    menuItem.classList.add('menu-item');
                    let ruta = data.imagen;
                    let nombreArchivo = ruta.split('/').pop();
                    //nombreArchivo = nombreArchivo.replace('.png', '.svg');
                    menuItem.innerHTML = `
                        <img src="images/${nombreArchivo}" alt="${data.nombre}">
                        <h3>${data.nombre}</h3>
                        <p>${data.descripcion || ""}</p>
                        <span class="price">$${data.precio}</span>
                    `;

                    categoriaSection.appendChild(menuItem);
                });
            } else {
                console.warn(`No se encontró la sección para la categoría: ${categoriaNombre} (ID: ${categoriaId})`);
            }
        }

        loader.style.display = 'none';
    } catch (error) {
        console.error("Error al cargar el menú:", error);
        loader.textContent = "Hubo un error al cargar el menú. Por favor, inténtalo más tarde.";
    }
}

window.addEventListener('DOMContentLoaded', cargarMenu);
