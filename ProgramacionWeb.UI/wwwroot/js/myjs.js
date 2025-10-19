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

function consultarDetalle(idEncabezado) {
    console.log(`🔎 Consultando detalles para ID Encabezado: ${idEncabezado}`);

    fetch(`https://localhost:44343/api/encabezado/detalle/${idEncabezado}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            return response.json().then(errorData => {
                throw new Error(`Error ${response.status}: ${JSON.stringify(errorData) || 'Respuesta no exitosa'}`);
            }).catch(() => {
                throw new Error(`Error al consultar. Estado HTTP: ${response.status}`);
            });
        })
        .then(data => {
            console.log("✅ Detalle de Cotización consultado exitosamente:", data);

            const encabezado = data.encabezado || {};
            const cotizaciones = data.cotizaciones || [];

            let htmlContent = `
                <html>
                <head>
                    <title>Detalle de Cotización #${idEncabezado}</title>
                    <style>
                        /* ESTILOS CSS PARA RESTAURAR EL DISEÑO */
                        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                        h1 { border-bottom: 2px solid #ccc; padding-bottom: 10px; }
                        h2 { color: #555; }
                        .encabezado-info { 
                            margin-bottom: 30px; 
                            padding: 15px; 
                            border: 1px solid #ddd; 
                            border-radius: 8px; 
                            background-color: #f9f9f9;
                        }
                        .encabezado-info p { margin: 8px 0; }
                        .encabezado-info strong { display: inline-block; width: 90px; }
                        
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                        th { background-color: #e0f7fa; color: #00796b; font-weight: bold; } /* Color de fondo para encabezados */
                        .articulo-row:nth-child(even) { background-color: #f7f7f7; } /* Rayado para filas */
                        
                        .total { font-weight: bold; background-color: #d1c4e9; color: #311b92; }
                        .total td { text-align: right; }
                        .text-right { text-align: right; }
                    </style>
                </head>
                <body>
                    <h1>Detalle de Cotización Nro. ${idEncabezado}</h1>
                    
                    <div class="encabezado-info">
                        <h2>Información del Encabezado</h2>
                        <p><strong>Cliente:</strong> ${encabezado.Nombre || 'N/A'}</p>
                        <p><strong>Ciudad:</strong> ${encabezado.Ciudad || 'N/A'}</p>
                        <p><strong>Dirección:</strong> ${encabezado.Direccion || 'N/A'}</p>
                        <p><strong>Celular:</strong> ${encabezado.Celular || 'N/A'}</p>
                    </div>

                    <h2>Artículos Cotizados (${cotizaciones.length} items)</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nro Artículo</th>
                                <th>Producto</th>
                                <th class="text-right">Cantidad</th>
                                <th class="text-right">Precio Unitario</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            let granTotal = 0;

            // Llenar las filas de la tabla con los detalles
            cotizaciones.forEach(item => {
                const totalItem = parseFloat(item.Total) || 0;
                granTotal += totalItem;
                const precioUnit = parseFloat(item.PrecioUnit) || 0;

                htmlContent += `
                    <tr class="articulo-row">
                        <td>${item['Nro Artículo'] || 'N/A'}</td>
                        <td>${item.Producto || 'N/A'}</td>
                        <td class="text-right">${(item.Cantidad || 0).toLocaleString()}</td>
                        <td class="text-right">$${precioUnit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        <td class="text-right">$${totalItem.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                    </tr>
                `;
            });

            // Agregar la fila del Gran Total
            htmlContent += `
                            <tr class="total">
                                <td colspan="4">GRAN TOTAL:</td>
                                <td>$${granTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            // Abrir y escribir en la nueva ventana
            const nuevaVentana = window.open('', '_blank', 'width=850,height=700,scrollbars=yes');
            nuevaVentana.document.write(htmlContent);
            nuevaVentana.document.close();

        })
        .catch(error => {
            console.error("❌ Error al consultar el detalle:", error.message);
            alert(`❌ Ocurrió un error al consultar el detalle: ${error.message}`);
        });
}


function cotizacion() {
    const form = document.getElementById('quoteFormCotizacion');
    if (!form || !form.reportValidity()) {
        console.error("Formulario no encontrado o contiene campos inválidos.");
        return;
    }

    const PRODUCTS = [
        { id: 1, name: 'Arroz x 500g', price: 2800.00 },
        { id: 2, name: 'Aceite vegetal x 1L', price: 9800.00 },
        { id: 3, name: 'Pan tajado x 500g', price: 4200.00 },
        { id: 4, name: 'Leche entera x 1L', price: 3900.00 },
        { id: 5, name: 'Huevos x 12 unidades', price: 9800.00 },
        { id: 6, name: 'Café molido x 250g', price: 8900.00 },
        { id: 7, name: 'Azúcar x 1kg', price: 4500.00 },
        { id: 8, name: 'Sal x 500g', price: 1200.00 },
        { id: 9, name: 'Pasta x 500g', price: 3200.00 },
        { id: 10, name: 'Galletas surtidas x 300g', price: 5600.00 },
        { id: 11, name: 'Atún en lata x 170g', price: 5200.00 },
        { id: 12, name: 'Harina de trigo x 1kg', price: 4300.00 },
        { id: 13, name: 'Chocolate de mesa x 250g', price: 6700.00 },
        { id: 14, name: 'Avena en hojuelas x 500g', price: 3100.00 },
        { id: 15, name: 'Maíz pira x 500g', price: 2900.00 },
        { id: 16, name: 'Salsa de tomate x 400g', price: 3700.00 },
        { id: 17, name: 'Mayonesa x 400g', price: 4200.00 },
        { id: 18, name: 'Fríjoles x 500g', price: 3600.00 },
        { id: 19, name: 'Lentejas x 500g', price: 3400.00 },
        { id: 20, name: 'Gelatina en polvo x 100g', price: 1800.00 },
        { id: 21, name: 'Cereal de maíz x 300g', price: 6200.00 },
        { id: 22, name: 'Yogurt x 1L', price: 4900.00 },
        { id: 23, name: 'Queso campesino x 500g', price: 9800.00 },
        { id: 24, name: 'Mantequilla x 250g', price: 5600.00 },
        { id: 25, name: 'Crema dental x 90g', price: 3900.00 },
        { id: 26, name: 'Jabón de baño x unidad', price: 2100.00 },
        { id: 27, name: 'Shampoo x 400ml', price: 8900.00 },
        { id: 28, name: 'Papel higiénico x 4 rollos', price: 6200.00 },
        { id: 29, name: 'Detergente x 1kg', price: 7800.00 },
        { id: 30, name: 'Suavizante x 1L', price: 7400.00 },
        { id: 31, name: 'Esponja metálica x unidad', price: 1300.00 },
        { id: 32, name: 'Cloro x 1L', price: 2500.00 },
        { id: 33, name: 'Desinfectante x 1L', price: 4600.00 },
        { id: 34, name: 'Servilletas x paquete', price: 2900.00 },
        { id: 35, name: 'Bolsa de basura x 10 und', price: 3200.00 },
        { id: 36, name: 'Encendedor x unidad', price: 900.00 },
        { id: 37, name: 'Fósforos x caja', price: 700.00 },
        { id: 38, name: 'Velas x paquete', price: 2400.00 },
        { id: 39, name: 'Jugo en caja x 1L', price: 3700.00 },
        { id: 40, name: 'Agua embotellada x 600ml', price: 2100.00 },
        { id: 41, name: 'Refresco x 2L', price: 5200.00 },
        { id: 42, name: 'Gaseosa x 1.5L', price: 4900.00 },
        { id: 43, name: 'Chocolatina x unidad', price: 1800.00 },
        { id: 44, name: 'Chicles x paquete', price: 1200.00 },
        { id: 45, name: 'Caramelos x bolsa', price: 2500.00 },
        { id: 46, name: 'Helado x 120ml', price: 3100.00 },
        { id: 47, name: 'Maní salado x 100g', price: 2200.00 },
        { id: 48, name: 'Papitas fritas x 150g', price: 3300.00 },
        { id: 49, name: 'Tostacos x 150g', price: 3400.00 },
        { id: 50, name: 'Panela x 500g', price: 2700.00 }
    ];

    const datos = {
        nombre: form.querySelector('[name="fullName"]').value,
        ciudad: form.querySelector('[name="city"]').value,
        direccion: form.querySelector('[name="address"]').value,
        celular: form.querySelector('[name="phone"]').value
    };

    const selectedProducts = [];
    const checkedProducts = form.querySelectorAll('input[name="product"]:checked');

    checkedProducts.forEach(checkbox => {
        console.log("Checkbox encontrado:", checkbox.id);

        const productId = parseInt(checkbox.id, 10);
        const productInfo = PRODUCTS.find(p => p.id === productId);
        const quantityInput = form.elements[`quantity-${productId}`];

        console.log("Producto:", productInfo);
        console.log("Cantidad input:", quantityInput?.value);

        if (productInfo && quantityInput) {
            const quantity = parseInt(quantityInput.value, 10);
            if (quantity >= 1) {
                selectedProducts.push({
                    id: productId,
                    name: productInfo.name,
                    quantity: quantity,
                    unitPrice: productInfo.price
                });
            }
        }
    });


    fetch('https://localhost:44343/api/encabezado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
        .then(response => {
            if (!response.ok) throw new Error("Error al crear el encabezado");
            return response.json();
        })
        .then(encabezadoData => {
            console.log("Encabezado creado:", encabezadoData);
            const idEncabezado = encabezadoData.idEncabezado;

            // Insertar las cotizaciones con el mismo IDEncabezado
            const solicitudes = selectedProducts.map(product => {
                const cotizacion = {
                    IDEncabezado: idEncabezado,
                    IDProducto: product.id,
                    Cantidad: product.quantity
                };

                return fetch('https://localhost:44343/api/cotizacion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cotizacion)
                });
            });

            return Promise.all(solicitudes).then(responses => ({ responses, idEncabezado }));
        })
        .then(({ responses, idEncabezado }) => { // <--- Destructure responses and idEncabezado
            const todasExitosas = responses.every(r => r.ok);
            if (todasExitosas) {
                // alert("✅ Cotización registrada correctamente (Encabezado + Detalles)");
                consultarDetalle(idEncabezado);
            } else {
                alert("⚠️ Algunas cotizaciones no se pudieron registrar");
            }
        })
        .catch(error => {
            console.error("Error al enviar:", error);
            alert("❌ Ocurrió un error al registrar la cotización");
        });
}
