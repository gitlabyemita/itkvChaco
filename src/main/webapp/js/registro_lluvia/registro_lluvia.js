/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
function ir_registro_lluvia() {
    const fecha = new Date().toISOString().split('T')[0];
    $.ajax({
        type: "post",
        url: 'contenedores/registro_lluvia/contenedor_registro_lluvia.jsp',
        success: function (res) {
            $("#contenedor_principal").html("");
            $("#contenedor_principal").html(res);
            $("#fecha").val(fecha);
            generar_grilla_registros_lluvias(fecha);
            // Seleccionar ambos elementos usando sus atributos únicos
            const $fechaAnchor = $('#btnTableVis');
            const $fechaExportAnchor = $('#btnTableInvis');
        }
    });
}

function generar_grilla_registros_lluvias() {
    let fecha = $("#fecha").val();
    $.ajax({
        type: "POST",
        url: "consultas/registro_lluvia/consulta_gen_grilla_registro_lluvias.jsp",
        data: {fecha: fecha},
        dataType: "json",
        beforeSend: function () {
            cargar_load();
        },
        success: function (response) {
            cerrar_load();
            let tablaHTML = `
                <table class="table table-striped table-bordered table-hover table-xs compact w-100" id="tabla_registro_lluvias">
                    <thead class="bg-primary">
                        <tr>
                            <th class="text-center" rowspan="2" width="100">Estancias/Retiro</th>
                            <th class="text-center" rowspan="2" width="100">Fecha</th>
                            <th class="text-center" colspan="2" width="100">06:00</th>
                            <th class="text-center" colspan="2" width="100">18:00</th>
                            <th class="text-center" rowspan="2" width="100">Total</th>
                        </tr>
                        <tr>
                            <th class="text-center" width="80">mm</th>
                            <th class="text-center" width="80">obs</th>
                            <th class="text-center" width="80">mm</th>
                            <th class="text-center" width="80">obs</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (response.data && response.data.length > 0) {
                $("#div_registro_lluvia").html(''); // Limpiar el contenedor antes de agregar la tabla

                response.data.forEach((row, index) => {
                    // Determinar si los selects deben tener un valor seleccionado
                    const selectedSC_06 = row.observacion_06 === 'S/C' ? 'selected' : '';
                    const selectedSR_06 = row.observacion_06 === 'S/R' ? 'selected' : '';
                    const selectedSC_18 = row.observacion_18 === 'S/C' ? 'selected' : '';
                    const selectedSR_18 = row.observacion_18 === 'S/R' ? 'selected' : '';
                    // Usar $("#fecha").val() si row.fecha está vacío o es null
                    const fechaFila = row.fecha && row.fecha.trim() !== '' ? row.fecha : fecha;
                    tablaHTML += `
                        <tr data-id-estancia="${row.id_estancia}" data-fecha="${fechaFila}">
                            <td>${row.estancia}</td>
                            <td>${row.fecha || ''}</td>
                            <td contenteditable="true" data-cantidad="${row.lluvia_mm_06 || ''}" class="contenteditablepd lluvia-mm-06" onfocus="selectValDet(this)" onblur="handleBlurLluvia(this, '06:00')" tabindex="${index * 6 + 1}">
                                ${row.lluvia_mm_06 || ''}
                            </td>
                            <td>
                                <select class="form-control form-control-sm observacion-06" data-observacion="${row.observacion_06 || ''}" onchange="handleChangeObservacion(this, '06:00')">
                                    <option value="" ${!row.observacion_06 ? 'selected' : ''}></option>
                                    <option value="S/C" ${selectedSC_06}>S/C</option>
                                    <option value="S/R" ${selectedSR_06}>S/R</option>
                                </select>
                            </td>
                            <td contenteditable="true" data-cantidad="${row.lluvia_mm_18 || ''}" class="contenteditablepd lluvia-mm-18" onfocus="selectValDet(this)" onblur="handleBlurLluvia(this, '18:00')" tabindex="${index * 6 + 3}">
                                ${row.lluvia_mm_18 || ''}
                            </td>
                            <td>
                                <select class="form-control form-control-sm observacion-18" data-observacion="${row.observacion_18 || ''}"  onchange="handleChangeObservacion(this, '18:00')">
                                    <option value="" ${!row.observacion_18 ? 'selected' : ''}></option>
                                    <option value="S/C" ${selectedSC_18}>S/C</option>
                                    <option value="S/R" ${selectedSR_18}>S/R</option>
                                </select>
                            </td>
                            <td class="text-right total-lluvia" data-cantidad="${row.total_lluvia_mm || '0'}">
                                ${row.total_lluvia_mm || '0'}
                            </td>
                        </tr>`;
                });
            }

            tablaHTML += `</tbody></table>`;
            $("#div_registro_lluvia").html(tablaHTML);
            let tablaExportHTML = `
                <table id="tabla_registro_lluvias_export">
                    <thead>
                        <tr>
                            <th>ESTANCIAS/RETIROS</th>
                            <th>06:00</th>
                            <th>18:00</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            response.data.forEach((row) => {
                const mm06 = row.lluvia_mm_06?.trim() || "";
                const obs06 = row.observacion_06?.trim() || "";
                const mm18 = row.lluvia_mm_18?.trim() || "";
                const obs18 = row.observacion_18?.trim() || "";
                const val06 = mm06 || obs06 || "";
                const val18 = mm18 || obs18 || "";
                //const fechaFila = row.fecha && row.fecha.trim() !== '' ? row.fecha : fecha;
                tablaExportHTML += `
        <tr>
            <td>${row.estancia}</td>
            <td>${val06}</td>
            <td>${val18}</td>
            <td>${row.total_lluvia_mm || '0'}</td>
        </tr>`;
            });
            tablaExportHTML += `</tbody></table>`;
            $('#div_registro_lluvia_export').html(tablaExportHTML);
            // Asegurarse de que los campos de lluvia_mm estén deshabilitados si hay una observación
            $("#tabla_registro_lluvias tbody tr").each(function () {
                const $row = $(this);
                const observacion06 = $row.find(".observacion-06").val();
                const observacion18 = $row.find(".observacion-18").val();
                if (observacion06) {
                    $row.find(".lluvia-mm-06")
                            .attr("contenteditable", "false")
                            .text("")
                            .addClass("not-editable")
                            .removeClass("contenteditablepd");
                    $row.find(".lluvia-mm-06").data("cantidad", ""); // Actualizar el valor original
                }
                if (observacion18) {
                    $row.find(".lluvia-mm-18")
                            .attr("contenteditable", "false")
                            .text("")
                            .addClass("not-editable")
                            .removeClass("contenteditablepd");
                    $row.find(".lluvia-mm-18").data("cantidad", ""); // Actualizar el valor original
                }
            });
            $("#tabla_registro_lluvias").DataTable({

                paging: false,
                ordering: false,
                dom: "Bflrtip",
                destroy: true,
                language: {
                    sSearch: "Buscar:",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ning&uacute;n dato disponible en esta tabla",
                    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sInfoThousands: ",",
                    sLoadingRecords: "Cargando...",
                    oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"},
                    buttons: {copyTitle: "DATOS COPIADOS", copySuccess: {_: "%d FILAS COPIADAS"}}
                },
                buttons: [
                    {
                        extend: 'colvis',
                        text: 'MOSTRAR / OCULTAR'
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'EXCEL'
                    }
                ],
                initComplete: function () {
                    $("#tabla_registro_lluvias").removeClass("dataTable");
                    const btnVisible = $('.buttons-excel[aria-controls="tabla_registro_lluvias"]');

                    // Interceptar su clic y redirigir a la tabla oculta
                    btnVisible.off('click').on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Disparar el botón de la tabla oculta (el que sí exporta bien)
                        $('.buttons-excel[aria-controls="tabla_registro_lluvias_export"]').click();

                        // 👉 Actualizar y exportar
                        const tablaExport = $('#tabla_registro_lluvias_export').DataTable();
                        tablaExport.draw(false);
                        tablaExport.button('.buttons-excel').trigger();
                        console.log("se intentó exportar la tabla actualizada");
                    });
                    // Selecciona el primer botón y le asigna ID
                    $('button[aria-controls="tabla_registro_lluvias"].buttons-colvis')
                            .attr('id', 'btnTableVis');
                }
            });
            $('#tabla_registro_lluvias_export').DataTable({
                dom: 'Bfrtip',
                paging: false,
                searching: false,
                ordering: false,
                info: false,
                buttons: [
                    {
                        extend: 'colvis',
                        text: 'MOSTRAR / OCULTAR'
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'EXCEL',
                        title: function () {
                            let fecha = $('#fecha').val();
                            let fechaFormateada;
                            if (fecha.includes('-')) {
                                let [y, m, d] = fecha.split('-');
                                fechaFormateada = `${d}/${m}/${y}`;
                            } else if (fecha.includes('/')) {
                                let [d, m, y] = fecha.split('/');
                                fechaFormateada = `${d}/${m}/${y}`;
                            } else {
                                fechaFormateada = "Fecha no válida";
                            }

                            let now = new Date();
                            let formattedDate = now.toLocaleString("es-ES", {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            }).replace(',', '');
                            return `INFORME REGISTRO DE LLUVIAS: - ${fechaFormateada} - REP: ${formattedDate}`;
                        }
                    }
                ],
                initComplete: function () {
                    // Selecciona el segundo botón y le asigna ID
                    $('button[aria-controls="tabla_registro_lluvias_export"].buttons-colvis')
                            .attr('id', 'btnTableInvis');
                    /*                    
                     const tablaVisible = $('#tabla_registro_lluvias').DataTable();
                     const tablaOculta = $('#tabla_registro_lluvias_export').DataTable();
                     // Sincronizar cambios de visibilidad
                     sincronizarColumnVisibility(tablaVisible, tablaOculta);
                     tablaVisible.columns().every(function (index) {
                     const isVisible = this.visible();
                     tablaOculta.column(index).visible(isVisible);
                     });
                     */

                    /*
                     $('.buttons-excel[aria-controls="tabla_registro_lluvias"]').off('click').on('click', function (e) {
                     console.log('se intento actualizar cambios');
                     e.preventDefault();
                     e.stopPropagation();
                     
                     // 👉 Actualizar y exportar
                     const tablaExport = $('#tabla_registro_lluvias_export').DataTable();
                     tablaExport.draw(false);
                     tablaExport.button('.buttons-excel').trigger();
                     });
                     */
                }
            });
        }
        ,
        error: function (error) {
            toastr.error("Error al obtener los datos:", error);
            cerrar_load();
        }
    }
    );
}

function sincronizarColumnVisibility(tablaOrigen, tablaDestino) {
    tablaOrigen.on('column-visibility.dt', function (e, settings, column, state) {
// Aplicar la misma visibilidad en la tabla destino
        tablaDestino.column(column).visible(state);
    });
}

// Manejar el cambio en el select de observación
function handleChangeObservacion(selectElement, hora) {
    const $select = $(selectElement);
    const $row = $select.closest("tr");
    const observacion = $select.val();
    const originalObservacion = $select.data("observacion") || ''; // Valor original almacenado en data-observacion
    const $lluviaField = hora === "06:00" ? $row.find(".lluvia-mm-06") : $row.find(".lluvia-mm-18");
    // Comparar el valor actual con el valor original
    if (observacion === originalObservacion) {
        return; // No ha cambiado, no hacemos nada
    }

// Si se selecciona una observación (S/C o S/R), deshabilitar el campo de lluvia_mm y establecerlo en vacío
    if (observacion) {
        $lluviaField
                .attr("contenteditable", "false") // Deshabilitar edición
                .text("") // Limpiar el valor
                .addClass("not-editable")
                .removeClass("contenteditablepd"); // Agregar clase para resaltar visualmente
        $lluviaField.data("cantidad", ""); // Actualizar el valor original a vacío
    } else {
        $lluviaField
                .attr("contenteditable", "true") // Habilitar edición
                .removeClass("not-editable")
                .addClass("contenteditablepd"); // Quitar clase de no editable
    }

// Actualizar el total
    updateTotal($row);
    // Actualizar el valor original en data-observacion
    $select.data("observacion", observacion);
    // Guardar el cambio en el backend
    saveRegistro($row, hora, $select);
}

// Manejar el evento blur en los campos de lluvia_mm
function handleBlurLluvia(cellElement, hora) {
    const $cell = $(cellElement);
    const $row = $cell.closest("tr");
    const newValue = $cell.text().trim();
    const originalValue = $cell.data("cantidad") || ''; // Valor original almacenado en data-cantidad
    const $observacionSelect = hora === "06:00" ? $row.find(".observacion-06") : $row.find(".observacion-18");
    // Comparar el valor actual con el valor original
    if (newValue === originalValue) {
        return; // No ha cambiado, no hacemos nada
    }

// Validar que el valor sea un número válido
    const parsedValue = parseFloat(newValue);
    if (newValue !== "" && (isNaN(parsedValue) || parsedValue < 0)) {
        toastr.error("Por favor, ingrese un valor numérico válido mayor o igual a 0.");
        $cell.text($cell.data("cantidad") || "");
        return;
    }

// Si se ingresa un valor en lluvia_mm, asegurarse de que no haya observación
    if (newValue !== "") {
        const observacion = $observacionSelect.val();
        if (observacion) {
            toastr.error("No se puede ingresar un valor de lluvia si hay una observación seleccionada.");
            $cell.text("");
            return;
        }
    }

// Actualizar el total
    updateTotal($row);
    // Actualizar el valor original en data-cantidad
    $cell.data("cantidad", newValue);
    // Guardar el cambio en el backend
    saveRegistro($row, hora, $cell);
}

// Recalcular el total de lluvia en la fila
function updateTotal($row) {
    const lluvia06 = parseFloat($row.find(".lluvia-mm-06").text()) || 0;
    const lluvia18 = parseFloat($row.find(".lluvia-mm-18").text()) || 0;
    const total = lluvia06 + lluvia18;
    $row.find(".total-lluvia").text(total.toFixed(2));
}

// Guardar el registro en el backend
function saveRegistro($row, hora, element) {
    const idEstancia = $row.data("id-estancia");
    const fecha = $("#fecha").val();
    const estancia = $row.find("td:eq(0)").text();
    const lluvia_mm = hora === "06:00" ? $row.find(".lluvia-mm-06").text() : $row.find(".lluvia-mm-18").text();
    const observacion = hora === "06:00" ? $row.find(".observacion-06").val() : $row.find(".observacion-18").val();
    // Validar que no haya valores en ambos campos
    if (lluvia_mm && observacion) {
        toastr.error("No se pueden especificar valores para observación y lluvia_mm al mismo tiempo.");
        return;
    }


    const $tdElement = $(element).closest('td');
    $.ajax({
        type: "POST",
        url: "cruds/registro_lluvia/upsert_registro_lluvias.jsp", // Ajusta la URL según tu backend
        data: {
            fecha: fecha,
            id_estancia: idEstancia,
            estancia: estancia,
            lluvia_mm: lluvia_mm || null,
            observacion: observacion || null,
            hora: hora
        },
        dataType: "json",
        beforeSend: function () {
            //cargar_load();
            $tdElement.addClass('update-pending');
        },
        success: function (response) {
            //cerrar_load();
            if (response.tipo === 1) {
                toastr.success(response.mensaje);

                // Obtener índice de fila actual en la tabla visible
                const filaIndex = $row.index();

                // Buscar la misma fila en la tabla export
                const $rowExport = $('#tabla_registro_lluvias_export tbody tr').eq(filaIndex);

                // Determinar nuevo valor a colocar (mm o obs)
                const nuevoValor = lluvia_mm || observacion || "";

                // Insertar en la columna correspondiente (1 para 06:00, 2 para 18:00)
                if (hora === "06:00") {
                    $rowExport.find('td').eq(1).text(nuevoValor);
                } else if (hora === "18:00") {
                    $rowExport.find('td').eq(2).text(nuevoValor);
                }

                // Recalcular TOTAL (solo si hay al menos un mm)
                let mm06 = parseFloat($row.find('.lluvia-mm-06').text().trim().replace(',', '.'));
                let mm18 = parseFloat($row.find('.lluvia-mm-18').text().trim().replace(',', '.'));

                // Si no es número, poner como 0
                mm06 = isNaN(mm06) ? 0 : mm06;
                mm18 = isNaN(mm18) ? 0 : mm18;

                // Calcular y actualizar total
                const nuevoTotal = (mm06 + mm18).toFixed(2);
                $row.find('.total-lluvia').text(nuevoTotal);
                $rowExport.find('td').eq(3).text(nuevoTotal);

                $tdElement.addClass('update-success').removeClass('update-pending');
                setTimeout(function () {
                    $tdElement.removeClass('update-success');
                }, 800);
            } else {
                toastr.error("Error al guardar el registro:", response.mensaje);
                $tdElement.addClass('update-error').removeClass('update-pending');
                setTimeout(function () {
                    $tdElement.removeClass('update-error');
                }, 800);
                toastr.error(response.mensaje);
                // Revertir los cambios en la interfaz si hay un error
                generar_grilla_registros_lluvias(); // Recargar la grilla para reflejar el estado actual
            }
        },
        error: function (error) {
            toastr.error("Error al guardar el registro:", error);
            $tdElement.addClass('update-error').removeClass('update-pending');
            setTimeout(function () {
                $tdElement.removeClass('update-error');
            }, 800);
            //cerrar_load();
            generar_grilla_registros_lluvias(); // Recargar la grilla en caso de error
        }
    });
}

/*informe registro lluvias por rango de fecha*/

function ir_informe_registro_lluvias() {
    $.ajax({
        type: "post",
        url: 'contenedores/registro_lluvia/contenedor_informe_registro_lluvia.jsp',
        success: function (res) {
            $("#contenedor_principal").html("");
            $("#contenedor_principal").html(res);
            $('.selectpicker').selectpicker();
            cargar_estilo_calendario_global("dd/mm/yyyy");
        }
    });
}

function traer_grilla_informe_registro_lluvias() {
    let fecha_inicio = $("#desde").val();
    let fecha_fin = $("#hasta").val();
    $.ajax({
        type: "POST",
        url: "consultas/registro_lluvia/consulta_gen_grilla_registro_lluvias_informe.jsp",
        data: {
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin
        },
        dataType: "json",
        beforeSend: function () {
            cargar_load();
        },
        success: function (response) {
            cerrar_load();
            let tablaHTML = `
                <table class="table table-striped table-bordered table-hover table-xs compact w-100" id="tabla_informe_registro_lluvias">
                    <thead class="bg-primary">
                        <tr>
                            <th class="text-center" width="100">ID</th>
                            <th class="text-center" width="100">ESTANCIAS / RETIROS</th>
                            <th class="text-center" width="100">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            if (response.data && response.data.length > 0) {
                $("#div_informe_registro_lluvia").html(''); // Limpiar el contenedor antes de agregar la tabla

                response.data.forEach((row, index) => {
                    tablaHTML += `
                        <tr data-id-estancia="${row.id_estancia}">
                            <td>${row.id_estancia}</td>
                            <td>${row.estancia}</td>
                            <td>${row.total_lluvia_mm || ''}</td>
                        </tr>`;
                });
            }

            tablaHTML += `</tbody></table>`;
            $("#div_informe_registro_lluvia").html(tablaHTML);
            $("#tabla_informe_registro_lluvias").DataTable({

                paging: false,
                ordering: false,
                dom: "Bflrtip",
                destroy: true,
                language: {
                    sSearch: "Buscar:",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ning&uacute;n dato disponible en esta tabla",
                    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sInfoThousands: ",",
                    sLoadingRecords: "Cargando...",
                    oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"},
                    buttons: {copyTitle: "DATOS COPIADOS", copySuccess: {_: "%d FILAS COPIADAS"}}
                },
                buttons: [
                    {
                        extend: 'colvis',
                        text: 'MOSTRAR / OCULTAR',
                        exportOptions: {
                            columns: ":visible"
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'EXCEL',
                        title: function () {
                            let fecha_inicio = $('#desde').val();
                            let fechaInicioFormateada;
                            if (fecha_inicio.includes('-')) {
                                let [y, m, d] = fecha_inicio.split('-');
                                fechaInicioFormateada = `${d}/${m}/${y}`;
                            } else if (fecha_inicio.includes('/')) {
                                let [d, m, y] = fecha_inicio.split('/');
                                fechaInicioFormateada = `${d}/${m}/${y}`;
                            } else {
                                fechaInicioFormateada = "Fecha no válida";
                            }

                            let fecha_fin = $('#hasta').val();
                            let fechaFinFormateada;
                            if (fecha_fin.includes('-')) {
                                let [y, m, d] = fecha_fin.split('-');
                                fechaFinFormateada = `${d}/${m}/${y}`;
                            } else if (fecha_fin.includes('/')) {
                                let [d, m, y] = fecha_fin.split('/');
                                fechaFinFormateada = `${d}/${m}/${y}`;
                            } else {
                                fechaFinFormateada = "Fecha no válida";
                            }

                            let now = new Date();
                            let formattedDate = now.toLocaleString("es-ES", {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            }).replace(',', '');
                            return `INFORME REGISTRO DE LLUVIAS: DESDE ${fechaInicioFormateada} HASTA ${fechaFinFormateada} - REP: ${formattedDate}`;
                        },
                        exportOptions: {
                            columns: ":visible"
                        }
                    }
                ],
                initComplete: function () {
                    $("#tabla_informe_registro_lluvias").removeClass("dataTable");
                }
            });
        }
        ,
        error: function (error) {
            toastr.error("Error al obtener los datos:", error);
            cerrar_load();
        }
    }
    );
}

function ir_informe_registro_lluvias_anual() {
    const anioActual = new Date().getFullYear();

    $.ajax({
        type: "post",
        url: 'contenedores/registro_lluvia/contenedor_registro_lluvias_informe_anual.jsp',
        success: function (res) {
            $("#contenedor_principal").html("");
            $("#contenedor_principal").html(res);
            $("#anio").val(anioActual);
            traer_grilla_informe_registro_lluvias_anual();
        }
    });
}

function traer_grilla_informe_registro_lluvias_anual() {
    let anio = $("#anio").val();
    $.ajax({
        type: "POST",
        url: "consultas/registro_lluvia/consulta_gen_grilla_registro_lluvias_anual.jsp",
        data: {
            anio: anio
        },
        dataType: "json",
        beforeSend: function () {
            cargar_load();
        },
        success: function (response) {
            cerrar_load();
            let tablaHTML = `
        <table class="table info-anual table-striped table-bordered table-hover table-xs compact w-100" id="tabla_informe_registro_lluvias_anual">
            <thead class="bg-primary">
                <tr>
                    <th class="text-center" rowspan="2">Campos</th>
                    ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(mes => `
                        <th class="text-center" colspan="32">${mes}</th>
                    `).join('')}
                    <th class="text-center" rowspan="2">Total Anual</th> <!-- Nueva columna -->
                </tr>
                <tr>
                    ${['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(mes => `
                        ${Array.from({length: 31}, (_, i) => `<th class="text-center">${i + 1}</th>`).join('')}
                        <th class="text-center">Total</th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
    `;

            if (response.data && response.data.length > 0) {
                $("#div_informe_anual_registro_lluvias").html(''); // Limpiar el contenedor antes de agregar la tabla

                response.data.forEach((row, index) => {
                    tablaHTML += `
                <tr data-id-estancia="${row.id_estancia}">
                    <td>${row.estancia}</td>
            `;

                    // Iterar sobre los meses
                    ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].forEach(mes => {
                        const mesData = row.meses[mes];
                        const dias = mesData.dias;
                        // Agregar los 31 días del mes
                        for (let dia = 0; dia < 31; dia++) {
                            tablaHTML += `<td>${dias[dia]}</td>`;
                        }
                        // Agregar el total del mes
                        tablaHTML += `<td class="text-right">${mesData.total}</td>`;
                    });

                    // Agregar el total anual
                    tablaHTML += `<td class="text-right">${row.total_anual}</td>`;

                    tablaHTML += `</tr>`;
                });
            }

            tablaHTML += `</tbody></table>`;
            $("#div_informe_anual_registro_lluvias").html(tablaHTML);

            // Inicializar DataTable
            $("#tabla_informe_registro_lluvias_anual").DataTable({
                paging: false,
                ordering: false,
                dom: "Bflrtip",
                destroy: true,
                language: {
                    sSearch: "Buscar:",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ningún dato disponible en esta tabla",
                    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sInfoThousands: ",",
                    sLoadingRecords: "Cargando...",
                    oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"},
                    buttons: {copyTitle: "DATOS COPIADOS", copySuccess: {_: "%d FILAS COPIADAS"}}
                },
                buttons: [
                    {
                        extend: 'colvis',
                        text: 'MOSTRAR / OCULTAR'
                    },
                    {
                        extend: 'excelHtml5',
                        text: 'EXCEL',
                        title: function () {
                            let now = new Date();
                            let anio = $("#anio").val();
                            let formattedDate = now.toLocaleString("es-ES", {
                                year: 'numeric', month: '2-digit', day: '2-digit',
                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                            }).replace(',', '');
                            return `INFORME REGISTRO DE LLUVIAS ANUAL ${anio} - REP: ${formattedDate}`;
                        },
                        exportOptions: {
                            columns: ':visible' // Exportar solo las columnas visibles
                        },
                        customize: function (xlsx) {
                            function getExcelColumnName(colIndex) {
                                let dividend = colIndex;
                                let columnName = '';
                                while (dividend > 0) {
                                    let modulo = (dividend - 1) % 26;
                                    columnName = String.fromCharCode(65 + modulo) + columnName;
                                    dividend = Math.floor((dividend - modulo) / 26);
                                }
                                return columnName;
                            }

                            var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            var $sheet = $(sheet);

                            var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                            var totalCols = (months.length * 32) + 2;

                            // Ahora desplazamos filas existentes a partir de la fila 2 hacia abajo
                            $sheet.find('row').each(function () {
                                var $row = $(this);
                                var rowNum = parseInt($row.attr('r'));
                                if (rowNum >= 2) {  // Importante: NO TOCAR LA FILA 1 (tu título original)
                                    var newRowNum = rowNum + 2;
                                    $row.attr('r', newRowNum);
                                    $row.find('c').each(function () {
                                        var $cell = $(this);
                                        var cellRef = $cell.attr('r');
                                        var newCellRef = cellRef.replace(/\d+/, newRowNum);
                                        $cell.attr('r', newCellRef);
                                    });
                                }
                            });

                            // Ajustar referencias de mergeCells existentes
                            $sheet.find('mergeCell').each(function () {
                                var $mergeCell = $(this);
                                var ref = $mergeCell.attr('ref');
                                if (ref) {
                                    var newRef = ref.replace(/\d+/g, function (match) {
                                        var num = parseInt(match);
                                        return (num >= 2) ? (num + 2) : num; // Solo ajusta filas desde la segunda hacia abajo
                                    });
                                    $mergeCell.attr('ref', newRef);
                                }
                            });

                            // Ajustar etiqueta dimension
                            var dimension = $sheet.find('dimension');
                            if (dimension.length && dimension.attr('ref')) {
                                var ref = dimension.attr('ref');
                                var newRef = ref.replace(/\d+/g, function (match) {
                                    var num = parseInt(match);
                                    return (num >= 2) ? (num + 2) : num; // Solo ajusta desde la segunda fila hacia abajo
                                });
                                dimension.attr('ref', newRef);
                            }

                            // ----- Insertar fila nueva con los meses (fila 2 en Excel) -----
                            var filaMeses = '<row r="2">';
                            filaMeses += '<c r="A2"/>'; // celda vacía sobre Campos
                            var colIndex = 2;

                            months.forEach(function (mes) {
                                var startCell = getExcelColumnName(colIndex) + "2";
                                var endCell = getExcelColumnName(colIndex + 31) + "2";

                                filaMeses += `<c t="inlineStr" r="${startCell}" s="2"><is><t>${mes}</t></is></c>`;
                                for (var j = 1; j < 32; j++) {
                                    filaMeses += `<c r="${getExcelColumnName(colIndex + j)}2"/>`;
                                }

                                var mergeCells = $sheet.find('mergeCells');
                                if (mergeCells.length === 0) {
                                    $sheet.find('worksheet').append('<mergeCells></mergeCells>');
                                    mergeCells = $sheet.find('mergeCells');
                                }
                                mergeCells.append(`<mergeCell ref="${startCell}:${endCell}"/>`);

                                colIndex += 32;
                            });

                            // Total Anual en fila 2
                            var totalAnualCell = getExcelColumnName(colIndex) + "2";
                            filaMeses += `<c t="inlineStr" r="${totalAnualCell}" s="2"><is><t></t></is></c>`;
                            filaMeses += '</row>';
                            $sheet.find('sheetData').find('row[r="1"]').after(filaMeses);

                            // ----- Insertar fila con "Campos", días, total mensual (fila 3 en Excel) -----
                            var filaDias = '<row r="3">';
                            filaDias += `<c t="inlineStr" r="A3"><is><t>Campos</t></is></c>`;
                            colIndex = 2;

                            months.forEach(function () {
                                for (var dia = 1; dia <= 31; dia++) {
                                    filaDias += `<c t="inlineStr" r="${getExcelColumnName(colIndex)}3"><is><t>${dia}</t></is></c>`;
                                    colIndex++;
                                }
                                filaDias += `<c t="inlineStr" r="${getExcelColumnName(colIndex)}3"><is><t>Total</t></is></c>`;
                                colIndex++;
                            });

                            filaDias += `<c t="inlineStr" r="${getExcelColumnName(colIndex)}3"><is><t>Total Anual</t></is></c>`;
                            filaDias += '</row>';
                            $sheet.find('sheetData').find('row[r="2"]').after(filaDias);

                            // ----- Estilo para centrar meses -----
                            var styles = xlsx.xl['styles.xml'];
                            var $styles = $(styles);
                            var xfCount = $styles.find('cellXfs xf').length;
                            $styles.find('cellXfs').append('<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>');
                            $sheet.find('row[r="2"] c[s="2"]').attr('s', xfCount);

                            // ----- Ajustar ancho columnas -----
                            var cols = '<cols>';
                            for (var c = 1; c <= totalCols; c++) {
                                cols += `<col min="${c}" max="${c}" width="15" customWidth="1"/>`;
                            }
                            cols += '</cols>';
                            $sheet.find('worksheet').prepend(cols);

                            // Ocultar la fila 3
                            $sheet.find('row[r="3"]').attr('hidden', '1');

                        }


                    }
                ],
                initComplete: function () {
                    $("#tabla_informe_registro_lluvias_anual").removeClass("dataTable");

                }
            });
        }
        ,
        error: function (error) {
            toastr.error("Error al obtener los datos:", error);
            cerrar_load();
        }
    }
    );
}