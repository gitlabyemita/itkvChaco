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