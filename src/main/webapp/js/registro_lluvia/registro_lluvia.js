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
                            <td contenteditable="true" data-cantidad="${row.lluvia_mm_06 || ''}" class="contenteditablepd lluvia-mm-06" onfocus="selectValDet(this)" onkeydown="navigateCellsCol5(event, this)" onblur="handleBlurLluvia(this, '06:00')" tabindex="${index * 6 + 1}">
                                ${row.lluvia_mm_06 || ''}
                            </td>
                            <td>
                                <select class="form-control form-control-sm observacion-06" data-observacion="${row.observacion_06 || ''}" onchange="handleChangeObservacion(this, '06:00')">
                                    <option value="" ${!row.observacion_06 ? 'selected' : ''}></option>
                                    <option value="S/C" ${selectedSC_06}>S/C</option>
                                    <option value="S/R" ${selectedSR_06}>S/R</option>
                                </select>
                            </td>
                            <td contenteditable="true" data-cantidad="${row.lluvia_mm_18 || ''}" class="contenteditablepd lluvia-mm-18" onfocus="selectValDet(this)" onkeydown="navigateCellsCol5(event, this)" onblur="handleBlurLluvia(this, '18:00')" tabindex="${index * 6 + 3}">
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
        },
        error: function (error) {
            toastr.error("Error al obtener los datos:", error);
            cerrar_load();
        }
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