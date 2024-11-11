/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

let tablaBidones;
let tablaInformeBidones;
/*ir contenedor control bidones */
function irControlMovimientosBidones() {
    $.ajax({
        type: "post",
        url: "contenedores/control_bidones_itkv/contenedor_control_bidones.jsp",
        beforeSend: function () {
            cargar_load("....Cargando");
            $("#contenedor_principal").html("");
        },
        success: function (res) {
            cerrar_load();
            $("#contenedor_principal").html(res);
            tablaBidones = $("#tabla-bidones").DataTable({
                destroy: true,
                lengthMenu: [[10, 25, 50, 100, -1], ["10 registros", "25 registros", "50 registros", "100 registros", "Mostrar todos"]],
                dom: "Bflrtip",
                paging: true,
                searching: true,
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
                    oPaginate: {sFirst: "Primero", sLast: "&uacute;ltimo", sNext: "Siguiente", sPrevious: "Anterior"}
                },
                buttons: [
                    {
                        extend: 'colvis',
                        text: 'MOSTRAR / OCULTAR',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'copy',
                        text: 'COPIAR GRILLA',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                keys: {clipboard: !1}
            });

            $('.selectpicker').selectpicker({size: '10'
            });

            cargar_estilo_calendario_global("dd/mm/yyyy");

            traerSelectArticulo();
        }
    });
}

function traerSelectArticulo() {
    return new Promise((resolve, reject) => {  // Agregamos el return para que efectivamente devuelva la promesa
        $.ajax({
            type: "post",
            url: "consultas/control_bidones_itkv/consulta_select_articulos.jsp",
            success: function (res) {
                $("#articulo").html(''); // Limpiar el select

                // Verificamos si hay una lista de artículos
                if (res.articulos && res.articulos.length > 0) {
                    let newOption = "";

                    res.articulos.forEach(lote => {
                        let lote_content = lote.lote_content;
                        if (!lote.pres_unica && !lote.lote_content) {
                            newOption += `<option disabled value="${lote.art_id}" name="${lote.art_name}" pres_unica="${lote.pres_unica}" lote_content="${lote.lote_content}" factor_multip="${lote.factor_multip}" name_factor_multip="${lote.name_factor_multip}" cantidad="${parseFloat(lote.OnHand).toFixed(2)}">Verificar datos | ${lote.art_id} | ${lote.art_name}</option>`;
                        } else if (lote_content === "Y") {
                            newOption += `<option value="${lote.art_id}" name="${lote.art_name}" pres_unica="${lote.pres_unica}" lote_content="${lote.lote_content}" factor_multip="${lote.factor_multip}" name_factor_multip="${lote.name_factor_multip}" cantidad="${parseFloat(lote.OnHand).toFixed(2)}">${lote.art_id} | ${lote.art_name} | Stock Total: ${parseFloat(lote.OnHand).toFixed(2)} | TIENE LOTE</option>`;
                        } else {
                            newOption += `<option value="${lote.art_id}" name="${lote.art_name}" pres_unica="${lote.pres_unica}" lote_content="${lote.lote_content}" factor_multip="${lote.factor_multip}" name_factor_multip="${lote.name_factor_multip}" cantidad="${parseFloat(lote.OnHand).toFixed(2)}">${lote.art_id} | ${lote.art_name} | Stock Total: ${parseFloat(lote.OnHand).toFixed(2)} | SIN LOTE</option>`;
                        }
                    });

                    $("#articulo").html("<option value=''>Seleccione art&iacute;culo</option>" + newOption);
                    $("#articulo").selectpicker('refresh');
                } else {
                    $("#articulo").html("<option value=''>No hay art&iacute;culos disponibles</option>");
                    $("#articulo").selectpicker('refresh');
                }

                resolve(); // Llamamos a resolve para indicar que la operación se ha completado
            },
            error: function (err) {
                console.error("Error al obtener los lotes: ", err);
                reject(err); // Llamamos a reject si hay un error
            }
        });
    });
}


function resetForm() {
    $("#ot, #dev_estimada, #cant, #bidon, #cod_barra, #cant_unit").val('');
    $("#articulo, #pres, #responsable, #lote").val('').selectpicker('refresh');
    $("#btnConfirBidon").prop("disabled", true);
}

function clearTable() {
    tablaBidones.clear().draw();
}

function isEmpty(...fields) {
    return fields.some(field => field === "" || field === null || field === undefined);
}

function handleArticuloChange(element) {
    let pres_unica = $(element).find(':selected').attr('pres_unica');
    let lote_content = $(element).find(':selected').attr('lote_content');
    let cod_art = $(element).val(); // Obtener el código del artículo

    // Validar que pres_unica y lote_content no estén vacíos
    if (isEmpty(pres_unica) && isEmpty(lote_content)) {
        toastr.warning("El art&iacute;culo seleccionado no posee presentaci&oacute;n &uacute;nica ni lote asociado, favor verificar", "Advertencia:");
        return;
    }

    // Ejecutar funciones necesarias en secuencia usando promesas
    return traerSelectPresentacion(cod_art)
            .then(() => traerLoteArticulo(cod_art))
            .then(() => {
                optionArticulo(element); // Pasamos el elemento como parámetro a esta función
            })
            .catch(error => {
                console.error("Error al actualizar los selects:", error);
                toastr.error("Hubo un error al actualizar los datos del artículo.");
            });
}



/* Mostrar/ocultar opciones de acuerdo al artículo seleccionado */
function optionArticulo(element) {
    let pres_unica = $(element).find(':selected').attr('pres_unica');
    let lote_content = $(element).find(':selected').attr('lote_content');

    if (isEmpty(pres_unica) && isEmpty(lote_content)) {
        toastr.warning("El art&iacute;culo seleccionado no posee presentaci&oacute;n &uacute;nica ni lote asociado, favor verificar", "Advertencia: ");
        return;
    }

    // Mostrar/Ocultar elementos según tipo
    function toggleParameters(showSelector, hideSelector) {
        $(showSelector).show();
        $(hideSelector).hide();
    }

    // Crear una combinación de valores para evaluar en el switch
    let combination = pres_unica + "_" + lote_content;

    // Evaluar la combinación de pres_unica y lote_content
    switch (combination) {
        /*usos en caso que sea presentación única*/
        case "1_Y":
            toggleParameters("#row_lote, #row_cant_unit", "");
            break;
        case "1_N":
            toggleParameters("#row_cant_unit", "#row_lote");
            break;
            /*usos en caso que NO sea presentación única */
        case "0_Y":
            toggleParameters("#row_lote, #row_cant_unit", "");
            break;
        case "0_N":
            toggleParameters("#row_lote, #row_cant_unit", "");
//            toggleParameters("#row_cant_unit", "#row_lote");
            break;
            /*en caso que la presentación única es igual a null se trata como el caso anterior*/
        case "null_Y":
            toggleParameters("#row_lote, #row_cant_unit", "");
            break;
        case "null_N":
            toggleParameters("#row_cant_unit", "#row_lote");
            break;
        default:
            toggleParameters("", "#row_cant_unit, #row_lote");
            break;
    }
}

function traerSelectPresentacion(cod_art) {

    if (cod_art !== "") {
        return new Promise((resolve, reject) => {

            let name_art = $("#articulo").find(':selected').attr('name');
            $.ajax({
                type: "post",
                url: "consultas/control_bidones_itkv/consulta_select_presentacion.jsp",
                data: {cod_art: cod_art},
                dataType: "json", // Aseguramos que la respuesta se trate como JSON
                success: function (res) {
                    $("#pres").html(''); // Limpiar el select

                    // Verificamos si hay una lista de presentaciones
                    if (res.presentacion && res.presentacion.length > 0) {
                        let newOption = ""; // Inicializamos correctamente como cadena vacía

                        // Iteramos sobre las opciones recibidas y las agregamos al select
                        res.presentacion.forEach(option => {
                            newOption += `<option value="${option.pre_id}" u_medida="${option.pre_und}" cantidad="${option.pre_cantidad}" name="${option.pre_name}">${option.pre_name} - ${option.pre_cantidad} ${option.pre_und}</option>`;
                        });

                        // Insertamos las nuevas opciones en el select
                        $("#pres").html("<option value=''>Seleccione presentaci&oacute;n para el art&iacute;culo " + name_art + "</option>" + newOption);
                        $("#pres").selectpicker('refresh');
                    } else {
                        $("#pres").html("<option value=''>No hay presentaciones disponibles para el art&iacute;culo " + name_art + "</option>");
                        $("#pres").selectpicker('refresh');
                    }
                    resolve(); // Indicar que la función ha terminado

                },
                error: function (err) {
                    console.error("Error al obtener las presentaciones: ", err);
                    reject(err); // Manejar el error en caso de que ocurra
                }
            });
        });
    } else {
        $("#pres").html(''); // Limpiar el select
        $("#pres").html("<option value=''>Seleccione previamente un art&iacute;culo</option>");
        $("#pres").selectpicker('refresh');
    }
}

function traerLoteArticulo(cod_art) {

    if (cod_art !== "") {
        return new Promise((resolve, reject) => {
            let name_art = $("#articulo").find(':selected').attr('name');

            $.ajax({
                type: "post",
                url: "consultas/control_bidones_itkv/consulta_select_lote.jsp",
                data: {cod_art: cod_art},
                dataType: "json", // Aseguramos que la respuesta se trate como JSON
                success: function (res) {
                    $("#lote").html(''); // Limpiar el select

                    // Verificamos si hay una lista de presentaciones
                    if (res.lotes && res.lotes.length > 0) {
                        let newOption = ""; // Inicializamos correctamente como cadena vacía

                        // Iteramos sobre las opciones recibidas y las agregamos al select
                        res.lotes.forEach(option => {
                            newOption += `
                                        <option value="${option.lote_id}" codigo="${option.itemcode}" cantidad="${option.StockRemaining}" name="${option.lote_name}">
                                            ItemName: ${option.itemname} - DistNumber: ${option.lote_name} - Stock: ${option.StockRemaining}
                                        </option>
                                     `;
                        });

                        // Insertamos las nuevas opciones en el select
                        $("#lote").html("<option value=''>Seleccione lote para el art&iacute;culo " + name_art + "</option>" + newOption);
                        $("#lote").selectpicker('refresh');
                    } else {
                        $("#lote").html("<option value=''>No hay lotes disponibles para el art&iacute;culo " + name_art + "</option>");
                        $("#lote").selectpicker('refresh');
                    }
                    resolve(); // Indicar que la función ha terminado

                },
                error: function (err) {
                    console.error("Error al obtener los lotes: ", err);
                    reject(err); // Manejar el error en caso de que ocurra
                }
            });
        });
    } else {
        $("#lote").html(''); // Limpiar el select
        $("#lote").html("<option value=''>Seleccione previamente un art&iacute;culo</option>");
        $("#lote").selectpicker('refresh');
    }
}


function traerLoteArticuloV2(cod_art) {
    let name_art = $("#articulo").find(':selected').attr('name');
    if (cod_art !== "") {
        $.ajax({
            type: "post",
            url: "consultas/control_bidones_itkv/consulta_select_lote.jsp",
            data: {cod_art: cod_art},
            dataType: "json", // Aseguramos que la respuesta se trate como JSON
            success: function (res) {
                $("#lote").html(''); // Limpiar el select

                // Verificamos si hay una lista de presentaciones
                if (res.lotes && res.lotes.length > 0) {
                    let newOption = ""; // Inicializamos correctamente como cadena vacía

                    // Recorrer los lotes del AJAX para agregarlos al select
                    res.lotes.forEach(option => {
                        // Inicializamos la cantidad total en la tabla para este lote específico
                        let totalCantidadTabla = 0;

                        // Recorremos las filas de la tabla para sumar la cantidad correspondiente al mismo artículo y lote
                        tablaBidones.rows().every(function () {
                            let data = this.data();
                            let articulo = data[8]; // Nombre del artículo en la columna 8
                            let distnumber = data[9]; // Número del lote en la columna 9
                            let loteConcatTabla = articulo + '-' + distnumber;
                            let loteConcatSelect = option.itemname + '-' + option.lote_name;

                            console.log(`Lote en tabla: ${loteConcatTabla}, Lote en select: ${loteConcatSelect}`);

                            // Si el artículo y el lote en la tabla coinciden con el lote actual del select
                            if (loteConcatTabla === loteConcatSelect) {
                                console.log(`Sumando cantidad: ${parseFloat(data[4])} al lote ${loteConcatTabla}`);
                                totalCantidadTabla += parseFloat(data[4]); // Sumar la cantidad del lote en la tabla
                            }
                        });


                        // Restar la cantidad acumulada de la tabla del stock del lote en el select
                        let stockRestante = parseFloat(option.cantidad_lote) - totalCantidadTabla;

                        // Crear la opción del select con el stock restante
                        newOption += `
                            <option value="${option.lote_id}" codigo="${option.itemcode}" cantidad="${stockRestante}" name="${option.lote_name}">
                                ItemName: ${option.itemname} - DistNumber: ${option.lote_name} - Stock: ${stockRestante}
                            </option>`;
                    });

                    // Insertamos las nuevas opciones en el select
                    $("#lote").html("<option value=''>Seleccione lote para el art&iacute;culo " + name_art + "</option>" + newOption);
                    $("#lote").selectpicker('refresh');
                } else {
                    $("#lote").html("<option value=''>No hay lotes disponibles para el art&iacute;culo " + name_art + "</option>");
                    $("#lote").selectpicker('refresh');
                }
            },
            error: function (err) {
                console.error("Error al obtener los lotes: ", err);
            }
        });
    } else {
        $("#lote").html(''); // Limpiar el select
        $("#lote").html("<option value=''>Seleccione previamente un art&iacute;culo</option>");
        $("#lote").selectpicker('refresh');
    }
}

//resta el stock desde el front
function actualizarCantidadLote(cantidadRestar) {
    let $lote = $("#lote").find(':selected');
    let cant_stock = parseFloat($lote.attr('cantidad')) || 0;
    let cant_restar_parse = parseFloat(cantidadRestar) || 0;

    // Restamos la cantidad
    let nuevoStock = cant_stock - cant_restar_parse;

    // Actualizamos el atributo 'cantidad' con el nuevo valor
    $lote.attr('cantidad', nuevoStock);

    // Actualizamos el texto visible en el <option> del select
    let articulo = $("#articulo").find(':selected').attr('name');
    let lote_name = $lote.attr('name');
    $lote.text(`ItemName: ${articulo} - DistNumber: ${lote_name} - Stock: ${nuevoStock}`);

    // Refrescamos el select para que los cambios se reflejen
    $("#lote").selectpicker('refresh');
}

//resta el stock desde el front
function actualizarCantidadArticulo(cantidadRestar) {
    const $articulo = $("#articulo").find(':selected');
    const cant_stock = parseFloat($articulo.attr('cantidad')) || 0;
    const cant_restar_parse = parseFloat(cantidadRestar) || 0;
    const lote_content = $articulo.attr('lote_content') === "Y" ? "TIENE LOTE" : "SIN LOTE";
    const itemcode = $articulo.val();

    // Restamos la cantidad y actualizamos el atributo 'cantidad'
    const nuevoStock = cant_stock - cant_restar_parse;
    $articulo.attr('cantidad', nuevoStock);

    // Formateamos el texto del <option>
    const articulo = $articulo.attr('name');
    $articulo.text(`${itemcode} | ${articulo} | Stock Total: ${nuevoStock} | ${lote_content}`);

    // Refrescamos el select para reflejar los cambios
    $("#articulo").selectpicker('refresh');
}


/*con esta funcion ejecutamos el crud para luego agregar una nueva fila en la grilla*/
function agregarBidonGrilla() {
    let tipo = $("#tipo_mov").val(),
            id_resp = $("#responsable").val(),
            resp = $("#responsable").find(':selected').attr('name'),
            ot = $("#ot").val(),
            f_dev = $("#dev_estimada").val(),
            fechaActual = new Date(),
            cod_art = $("#articulo").val(),
            name_art = $("#articulo").find(':selected').attr('name'),
            pres = $("#pres").val(),
            cantidad = "",
            name_pres = $("#pres").find(':selected').attr('name'),
            pres_unica = $("#articulo").find(':selected').attr('pres_unica'),
            lote_content = $("#articulo").find(':selected').attr('lote_content'),
            cod_barra = $("#cod_barra").val(),
            lote = $("#lote").find(':selected').attr('name') || "";

    // Separar el valor de la fecha (dd/mm/aaaa) en día, mes y año
    let partesFecha = f_dev.split("/");

    // Convertir la fecha al formato aaaa-mm-dd para crear un objeto Date en JS
    let fechaDev = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // Año, Mes (indexado desde 0), Día

    // Validar que la fecha ingresada no sea menor a la fecha actual (solo comparamos fechas, ignoramos las horas)
    if (fechaDev.setHours(0, 0, 0, 0) < fechaActual.setHours(0, 0, 0, 0)) {
        toastr.error("La fecha ingresada no puede ser menor a la fecha actual", "Error: ");
        $("#dev_estimada").val(""); // Limpiar el campo si la fecha no es válida
        return;
    } else {
        console.log("Fecha v&aacute;lida: ", f_dev);
    }
    if (pres_unica == 1) {
        cantidad = $("#pres").find(':selected').attr('cantidad');
        if (isEmpty(lote) && lote_content === "Y") {
            toastr.error("Debe seleccionar un lote para el art&iacute;culo " + name_art, "Error");
            return;
        }
    } else if (pres_unica == 0 && lote_content === "Y") {
        let cant_unitaria = parseFloat($("#cant_unit").val());
        let cant_val = $("#cant_unit").val();
        let cant_stock = parseFloat($("#lote").find(':selected').attr('cantidad')) || 0; // Convertir a número, si es NaN, usar 0
        let u_medida = $("#pres").find(':selected').attr('u_medida');

        if (isEmpty(lote, cant_val)) {
            toastr.error("Debe completar todos los campos para insertar el art&iacute;culo " + name_art, "Error");
            return;
        }
        // Comparar los números correctamente
        if (cant_unitaria > cant_stock) {
            toastr.warning("El stock disponible es de: " + cant_stock + " " + u_medida, "Advertencia:");
            toastr.error("La cantidad ingresada es mayor al stock disponible", "Error:");
            $("#cod_barra").val(""); // Limpiar el input de código de barra
            return;
        } else {
            cantidad = cant_unitaria; // Guardar la cantidad unitaria válida
        }
    } else if (pres_unica == 0 && lote_content === "N") {
        let cant_unitaria = parseFloat($("#cant_unit").val());
        let cant_val = $("#cant_unit").val();
        let cant_stock = parseFloat($("#articulo").find(':selected').attr('cantidad')) || 0; // Convertir a número, si es NaN, usar 0
        let u_medida = $("#pres").find(':selected').attr('u_medida');

        if (isEmpty(cant_val)) {
            toastr.error("Debe completar la cantidad para insertar el art&iacute;culo " + name_art, "Error");
            return;
        }
        // Comparar los números correctamente
        if (cant_unitaria > cant_stock) {
            toastr.warning("El stock disponible es de: " + cant_stock + " " + u_medida, "Advertencia:");
            toastr.error("La cantidad ingresada es mayor al stock disponible", "Error:");
            $("#cod_barra").val(""); // Limpiar el input de código de barra
            return;
        } else {
            cantidad = cant_unitaria; // Guardar la cantidad unitaria válida
        }
    }
    const table = $("#tabla-bidones").DataTable();
    //aca verificamos si existe el codigo de barras en la grilla sin consultar la base de datos 
//    var codBarExists = table.column(5).data().toArray().includes(cod_barra);
    if (isEmpty(id_resp, resp, f_dev, name_art, pres, cod_barra, cod_art, ot)) {
//    if (isEmpty(id_resp, resp, f_dev, name_art, pres, cod_art, ot)) {
        toastr.error("Todos los campos deben estar completos", "Error");
        return;
    }
//    else if (codBarExists) {
//        toastr.error("El c&oacute;digo de barra ya existe", "Error");
//        $("#cod_barra").val("");
//    } 
    else {
        $("#btnConfirBidon").prop("disabled", true);// Desactivar el botón
        $.ajax({
            type: 'post',
            url: "cruds/control_bidones_itkv/crud_agregar_bidon.jsp",
            data: {
                tipo: tipo,
                id_resp: id_resp,
                resp: resp,
                ot: ot,
                f_dev: f_dev,
                cod_art: cod_art,
                name_art: name_art,
                pres: pres,
                cantidad: cantidad,
                cod_barra: cod_barra,
                lote: lote,
                estado: "P"
            },
            beforeSend: function () {
            },
            success: function (res) {
                if (res.tipo === 1) {
                    $("#btnConfirBidon").prop("disabled", false);
                    $("#cod_barra").val("");
                    agregarFilaBidon(
                            res.id,
                            cod_barra,
                            "",
                            name_art,
                            name_pres,
                            ot,
                            resp,
                            f_dev,
                            parseFloat(cantidad).toFixed(1),
                            "",
                            res.id,
                            lote
                            );
                    toastr.success(res.mensaje, "El bid&oacute;n " + res.id);
                    //restamos desde el front                                  
                    if (pres_unica == 0 && lote_content === "Y") {
                        actualizarCantidadLote(cantidad);
                        actualizarCantidadArticulo(cantidad);
                    } else if (pres_unica == 0 && lote_content === "N") {
                        actualizarCantidadArticulo(cantidad);
                    }
                } else if (res.tipo === 2) {
                    $.ajax({
                        type: "post",
                        url: "consultas/control_bidones_itkv/consulta_obj_bidon_reutilizado.jsp",
                        data: {
                            mov_id: res.id
                        },
                        success: function (res2) {
                            $("#btnConfirBidon").prop("disabled", false);
                            let bidones = res2.bidones;
                            bidones.forEach(fila => {
                                agregarFilaBidon(
                                        fila.mov_id,
                                        fila.codigoBarra,
                                        fila.codigoBarra2,
                                        fila.nombre,
                                        fila.presentacion,
                                        fila.ot,
                                        fila.responsable,
                                        fila.fechaDevolucion,
                                        fila.cantidadEntregada,
                                        fila.cantidadRecibida,
                                        fila.mov_id,
                                        fila.distnumber
                                        );
                            });
                            toastr.success(res2.mensaje, "El bid&oacute;n reutilizado correctamente" + fila.mov_id);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (jqXHR.status === 404) {
                                alert("La p&aacute;gina solicitada no se encontr&oacute;.");
                            } else if (jqXHR.status === 500) {
                                alert("Error en el servidor. Por favor, int&eacute;ntalo de nuevo m&aacute;s tarde.");
                            } else {
                                console.error("Error al cargar bid&oacute;n:", textStatus, errorThrown);
                            }
                        }
                    });

                } else {
                    if (tablaBidones.rows().count() > 0) {
                        $("#btnConfirBidon").prop("disabled", false);
                    }
                    toastr.error(res.mensaje, "Error tipo: " + res.tipo + " id: " + res.id);
                    console.log(res.mensaje);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    alert("La p&aacute;gina solicitada no se encontr&oacute;.");
                } else if (jqXHR.status === 500) {
                    alert("Error en el servidor. Por favor, int&eacute;ntalo de nuevo m&aacute;s tarde.");
                } else {
                    console.error("Error al cargar bid&oacute;n:", textStatus, errorThrown);
                }
            }
        });
    }
}

/*esta funcion agrega la nueva fila*/
function agregarFilaBidon(mov_id, cod_barra, cod_barra2, name_art, pres, ot, resp, f_dev, cantidad, cantidadR, accion, distnumber) {
    // Obtener la cantidad de filas actuales para calcular el índice
    const index = tablaBidones.rows().count() + 1; // Agregar 1 para obtener el nuevo índice
    const newData = [
        `<button id="btn${accion}" class="btn btn-warning text-center" onclick="deshacerCargaBidon(${accion}, ${cantidad},'${distnumber}')"><i class="fa-solid fa-trash"></i></button>`,
        index,
        mov_id,
        cantidadR,
        cantidad,
        cod_barra,
        cod_barra2,
        f_dev,
        name_art,
        distnumber,
        pres,
        ot,
        resp
    ];
    // Agregar la nueva fila a la tabla
    var rowNode = tablaBidones.row.add(newData).draw(false).node();

    // Asignar ID a la fila recién agregada
    $(rowNode).attr('id', 'row' + accion);

    // Limpiar el campo de código de barras
    $('#cod_barra').val('');

    // Volver a ordenar las filas en orden descendente según el índice (columna 0)
    tablaBidones.order([1, 'desc']).draw();
}

/*mostrar/ocultar opciones de acuerdo al tipo de movimiento*/
function optionTipoMov(tipo) {
    // Reseteo tabla
    clearTable();

    // Mostrar/Ocultar elementos según tipo
    function toggleElements(showSelector, hideSelector) {
        $(showSelector).show();
        $(hideSelector).hide();
    }

    // Cambiar color del header
    function changeHeaderColor(removeClasses, addClass) {
        $(".card-header").removeClass(removeClasses).addClass(addClass);
    }
    // Reseteo general
    resetForm();

    switch (tipo) {
        case "1":
            changeHeaderColor("bg-warning bg-danger", "bg-primary");
            toggleElements("#row_responsable, #row_ot, #row_devolucion, #row_articulo, #row_presentacion, #row_codebar, #row_agregar, #content_tb_bidones", "#row_responsable_entrega, #row_lote, #row_cant_unit");
            break;
        case "2":
            changeHeaderColor("bg-primary bg-danger", "bg-warning");
            toggleElements("#row_responsable, #row_ot, #row_codebar, #content_tb_bidones", "#row_devolucion, #row_articulo, #row_presentacion, #row_agregar, #row_ot,#row_responsable_entrega, #row_lote, #row_cant_unit");
            break;
        case "4":
            changeHeaderColor("bg-primary bg-warning", "bg-danger");
            toggleElements("#row_ot, #row_codebar, #row_responsable_entrega, #content_tb_bidones", "#row_devolucion, #row_articulo, #row_presentacion, #row_agregar, #row_ot, #row_responsable, #row_lote, #row_cant_unit");
            traerGrillaBidones("TODOS");
            break;
        default:
            toggleElements("", "#row_responsable, #row_ot, #row_devolucion, #row_articulo, #row_presentacion, #row_codebar, #row_agregar, #content_tb_bidones, #row_responsable_entrega, #row_lote, #row_cant_unit");
            break;
    }
}

function manejoResponablesBidones(responsable) {
    if ($("#responsable").val() === "OTROS") {
        $("#responsable_por").show();
        $("#responsable_por").val("");
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else if ($("#responsable").val() === "") {
        $("#responsable_por").hide();
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else {
        $("#responsable_por").hide();
        traerGrillaBidones(responsable);
    }
}

/*esta funcion genera dinamicamente una grilla en el caso que el responsable tenga bidones en estado P de pendiente*/
function traerGrillaBidones(responsable) {
    let tipo = $("#tipo_mov").val(); // Capturamos el valor de tipo_mov
    let estado = "";
    if (tipo == 1) {
        estado = "P";
    } else if (tipo == 2) {
        estado = "E";
    } else {
        estado = "R";
    }
    $.ajax({
        type: 'post',
        url: "consultas/control_bidones_itkv/consulta_obj_bidones_resp.jsp",
        data: {
            responsable: responsable,
            estado: estado
        },
        beforeSend: function () {
            clearTable(); // Limpia la tabla antes de agregar nuevos datos
        },
        success: function (res) {
            let bidones = res.bidones;
            let index = 1; // Iniciamos un contador de índice
            if (estado == "P") {
                bidones.forEach(fila => {
                    let newRow = tablaBidones.row.add([
                        `<button id="btnEliminarBidon" class="btn btn-sm btn-warning text-center" onclick="deshacerCargaBidon(${fila.mov_id},${fila.cantidadEntregada},'${fila.distnumber}')"><i class="fa-solid fa-trash"></i></button>`,
                        index, // Añadir el índice en la primera columna
                        fila.mov_id,
                        fila.cantidadRecibida,
                        parseFloat(fila.cantidadEntregada).toFixed(1),
                        fila.codigoBarra,
                        fila.codigoBarra2,
                        fila.fechaDevolucion,
                        fila.nombre,
                        fila.distnumber,
                        fila.presentacion,
                        fila.ot,
                        fila.responsable
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++; // Aumentamos el contador de índice
                });

                // Ahora ordena los datos en la columna 1 (mov_id) de mayor a menor
                tablaBidones.order([1, 'desc']).draw(); // 'desc' para ordenar de mayor a menor en la columna mov_id
            } else if (estado == "E") {
                bidones.forEach(fila => {
                    let cantidadRecibida = fila.cantidadRecibida ? parseFloat(fila.cantidadRecibida).toFixed(2) : "";
                    let cantidadEntregada = parseFloat(fila.cantidadEntregada).toFixed(2);
                    let newRow = tablaBidones.row.add([
                        `<input type="checkbox" class="checkbox" value="${fila.mov_id}" onchange="mostrarOcultarCeldabidon(${fila.mov_id})"/>`, // Checkbox para identificar el mov_id
                        index,
                        fila.mov_id,
                        `<span id="cantspan${fila.mov_id}">${cantidadRecibida}</span><input type="number" id="cant${fila.mov_id}" class="form-control editable" value="${cantidadRecibida}" style="display:none;" onblur="cantidadRestante(${fila.mov_id}, this)" onkeypress="cantidadRestante(${fila.mov_id}, this)"/>`, // Celda editable para cantidadRecibida
                        cantidadEntregada,
                        fila.codigoBarra,
                        `<span id="codespan${fila.mov_id}">${fila.codigoBarra2}</span><input type="text" id="code${fila.mov_id}" class="form-control editable" value="${fila.codigoBarra2}" style="display:none;" onblur="escanCodBarReasig(${fila.mov_id}, this)" onkeypress="escanCodBarReasig(${fila.mov_id}, this)"/>`, // Celda editable para codigoBarra2
                        fila.fechaDevolucion,
                        fila.nombre,
                        fila.distnumber,
                        fila.presentacion,
                        fila.ot,
                        fila.responsable
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++;
                });
                tablaBidones.order([1, 'desc']).draw(); // 'desc' para ordenar de mayor a menor en la columna mov_id
            } else {
                bidones.forEach(fila => {
                    let newRow = tablaBidones.row.add([
                        `<input type="checkbox" class="chk-mov-id" value="${fila.mov_id}" onchange="mostrarOcultarCeldabidon(${fila.mov_id})"/>`, // Checkbox para identificar el mov_id
                        index,
                        fila.mov_id,
                        fila.cantidadRecibida,
                        fila.cantidadEntregada,
                        fila.codigoBarra,
                        fila.codigoBarra2,
                        fila.fechaDevolucion,
                        fila.nombre,
                        fila.distnumber,
                        fila.presentacion,
                        fila.ot,
                        fila.responsable
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++;
                });
                tablaBidones.order([1, 'desc']).draw(); // 'desc' para ordenar de mayor a menor en la columna mov_id

            }
            // Restablecer valores de los campos del formulario
            $("#ot, #dev_estimada, #cant, #bidon, #cod_barra, #cant_unit").val('');
            $("#articulo, #pres, #lote").val('').selectpicker('refresh');

            // Habilitar o deshabilitar el botón dependiendo de si hay bidones en la tabla
            if (bidones.length > 0) {
                $("#btnConfirBidon").prop("disabled", false); // Habilitar el botón
            } else {
                $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 404) {
                alert("La página solicitada no se encontró.");
            } else if (jqXHR.status === 500) {
                alert("Error en el servidor. Por favor, int&eacute;ntalo de nuevo más tarde.");
            } else {
                console.error("Error al cargar bid&oacute;n:", textStatus, errorThrown);
            }
        }
    });
}

function traerGrillaBidonesV2(responsable) {
//    let tipo = $("#tipo_mov").val(); // Capturamos el valor de tipo_mov
//    let estado;
//    if (tipo == 1) {
//        estado = "P";
//    } else if (tipo == 2) {
//        estado = "E";
//    } else {
//        estado = "R";
//    }
//    clearTable(); // Limpia la tabla antes de agregar nuevos datos
//
//    // Inicializamos la tabla de bidones con DataTables
//    tablaBidones = $("#tabla-bidones").DataTable({
//        "destroy": true,
//        "serverSide": true,
//        "order": [[0, 'desc']], // Ordenar inicialmente por la columna 0 (índice) de mayor a menor
//        dom: "Bfrtip",
//        "language": {
//            sSearch: "Buscar:",
//            sLengthMenu: "Mostrar _MENU_ registros",
//            sZeroRecords: "No se encontraron resultados",
//            sEmptyTable: "Ningún dato disponible en esta tabla",
//            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
//            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
//            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
//            sLoadingRecords: "Cargando...",
//            oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"}
//        },
//        buttons: [
//            {
//                extend: 'colvis',
//                text: 'MOSTRAR / OCULTAR',
//                exportOptions: {
//                    columns: ':visible'
//                }
//            }
//        ],
//        "ajax": {
//            "url": "/consultas/control_bidones_itkv/consulta_obj_bidones_resp.jsp?responsable=" + responsable + "&estado=" + estado
//        },
//        columns: [
//            // Columna de índice dinámico
//            {
//                data: null,
//                className: 'text-center',
//                orderable: false,
//                createdCell: function (td, cellData, rowData, rowIndex) {
//                    $(td).html(rowIndex + 1); // Índice dinámico
//                }
//            },
//            {data: 'mov_id', name: 'mov_id', className: 'text-center', orderable: false},
//            {data: 'codigoBarra', name: 'codigoBarra', orderable: false},
//            {
//                data: 'codigoBarra2',
//                name: 'codigoBarra2',
//                orderable: false,
//                createdCell: function (td, cellData, rowData) {
//                    $(td).attr('id', `code${rowData.mov_id}`);
//                    if (estado === "E") {
//                        $(td).attr('contenteditable', 'false');
//                        $(td).on('keypress', function (event) {
//                            return escanCodBarReasig(rowData.mov_id, $(this).text(), event);
//                        });
//                    }
//                }
//            },
//            {data: 'nombre', name: 'nombre', orderable: false},
//            {data: 'presentacion', name: 'presentacion', orderable: false},
//            {data: 'ot', name: 'ot', orderable: false},
//            {data: 'responsable', name: 'responsable', orderable: false},
//            {data: 'fechaDevolucion', name: 'fechaDevolucion', orderable: false},
//            {data: 'cantidadEntregada', name: 'cantidadEntregada', orderable: false},
//            {
//                data: 'cantidadRecibida',
//                name: 'cantidadRecibida',
//                orderable: false,
//                createdCell: function (td, cellData, rowData) {
//                    $(td).attr('id', `cant${rowData.mov_id}`);
//                    if (estado === "E") {
//                        $(td).attr('contenteditable', 'false');
//                        $(td).on('keypress', function (event) {
//                            return cantidadRestante(rowData.mov_id, $(this).text(), event);
//                        });
//                    }
//                }
//            },
//            {
//                data: 'mov_id',
//                orderable: false,
//                render: function (data, type, row) {
//                    return (estado === "E") ?
//                            `<input type="checkbox" class="chk-mov-id" value="${data}" onchange="mostrarOcultarCeldabidon(${data})" />` :
//                            `<button id='btnEliminarBidon' class='btn btn-warning text-center' onclick='deshacerCargaBidon(${data})'><i class='fa-solid fa-trash'></i> Deshacer</button>`;
//                }
//            }
//        ],
//        "columnDefs": [
//            {targets: [1, 2, 3, 4], className: 'text-right'},
//            {orderable: false, targets: [1, 2, 3, 4]} // Deshabilitar ordenamiento en las columnas específicas
//        ],
//
//        // Ordenar los datos después de renderizar
//        "drawCallback": function (settings) {
//            tablaBidones.order([0, 'desc']).draw(false); // Ordenar de mayor a menor la columna índice
//        }
//    });
}

/* Captura los eventos al oprimir Enter o escanear con el lector */
function escanCodBarraBidon() {
    let estado = $("#tipo_mov").find(':selected').attr('estado');
    let cod_barra = $("#cod_barra").val();

    if (event.keyCode === 13 || event.which === 13) { // Si presiona Enter
        if (estado == "E") {
            agregarBidonGrilla(); // Agrega un bidón si está en estado "E"
            $("#cod_barra").val(""); // Limpia el campo del código de barra
        }

        if (estado == "R" || estado == "D") {
            // Verifica si el código de barra existe en las columnas 2 o 3 de la tabla
            var codBarExists = tablaBidones.column(5).data().toArray().includes(cod_barra);
            var codBarExists2 = tablaBidones.column(6).data().toArray().includes(cod_barra);

            if (codBarExists || codBarExists2) {
                // Desactivar la paginación temporalmente para manipular la fila
                tablaBidones.page.len(-1).draw(false); // -1 muestra todas las filas

                // Si el código de barra existe, encuentra la fila correspondiente
                tablaBidones.rows().every(function () {
                    let data = this.data();
                    if (data[5] === cod_barra || data[6] === cod_barra) {
                        // Encuentra el checkbox de esta fila y lo marca como checked
                        let $row = $(this.node());
                        let $checkbox = $row.find('input[type="checkbox"]');

                        $checkbox.prop('checked', true); // Marca el checkbox
                        $checkbox.trigger('change'); // Dispara el evento onchange
                    }
                });
                $("#cod_barra").val(""); // Limpia el campo del código de barra
            } else {
                // Si no existe, puedes manejarlo aquí (mostrar alerta o alguna acción)
                toastr.error("C&oacute;digo de barra no encontrado en la tabla. " + cod_barra, "Error");
                console.log("C&oacute;digo de barra no encontrado en la tabla.");
                $("#cod_barra").val(""); // Limpia el campo del código de barra
            }
        }
    }
}

/* Función para mover la fila seleccionada a la parte superior de la tabla */
function mostrarOcultarCeldabidon(mov_id) {
    let checkbox = $("input[value='" + mov_id + "']");
    let $row = $('#row' + mov_id); // Accede al <tr> de la fila correspondiente
    let data = tablaBidones.row($row).data(); // Captura los datos actuales de la fila
    let highestIndex = 0; // Para almacenar el índice más alto actual en la columna 0
    let currentPage = tablaBidones.page(); // Guarda la página actual antes de cambiar la paginación
    let estado = $("#tipo_mov").find(':selected').attr('estado');

    // Verificar si el checkbox está marcado o no
    if (checkbox.is(":checked")) {
        // Desactivar la paginación temporalmente si no se encuentra en la primera página
        if (currentPage !== 0) {
            tablaBidones.page.len(-1).draw(false); // -1 muestra todas las filas            
        }

        // Capturar el índice más alto actual en la tabla (columna 0)
        tablaBidones.column(1).data().each(function (value) {
            highestIndex = Math.max(highestIndex, value);
        });

        // Actualizamos el índice de la fila a ser mayor al número actual más alto
        data[1] = highestIndex + 1;

        // Remover la fila original
        tablaBidones.row($row).remove().draw(false);

        // Agregar la fila con el nuevo índice al principio
        let newRow = tablaBidones.row.add(data).draw(false).node();
        $(newRow).attr('id', 'row' + mov_id); // Agregar nuevamente el id a la nueva fila

        // Ordenar la tabla de acuerdo a la columna 0 en orden descendente
        tablaBidones.order([1, 'desc']).draw(false);

        // Volver a seleccionar el checkbox de la fila redibujada y marcarlo
        let newCheckbox = $(newRow).find('input[type="checkbox"]');
        newCheckbox.prop('checked', true); // Marcar el checkbox redibujado

        // Si el estado es "R", muestra los inputs ocultos
        if (estado === "R") {
            $("#code" + mov_id).show();
            $("#cant" + mov_id).show();
            $("#cantspan" + mov_id).hide();
            $("#codespan" + mov_id).hide();
        }

        // Restaurar la paginación original y volver a la página en la que estábamos
        tablaBidones.page.len(10).draw(false); // Cambia a paginación normal (por ejemplo, 10 filas por página)
    } else {
        // Si el estado es "R", oculta los inputs 
        if (estado === "R") {
            $("#code" + mov_id).hide();
            $("#cant" + mov_id).hide();
            $("#cantspan" + mov_id).show();
            $("#codespan" + mov_id).show();
        }
    }
}

function sumarCantidadLoteV1(cantidadSumar) {
    let $lote = $("#lote").find(':selected');
    let cant_stock = parseFloat($lote.attr('cantidad')) || 0;
    let name_art = $("#articulo").find(':selected').attr('name');

    // Sumamos la cantidad al stock actual
    let nuevoStock = cant_stock + cantidadSumar;

    // Actualizamos el atributo 'cantidad' con el nuevo valor
    $lote.attr('cantidad', nuevoStock);

    // Actualizamos el texto visible en el <option> del select
    let lote_name = $lote.attr('name');
    $lote.text(`ItemName: ${name_art} - DistNumber: ${lote_name} - Stock: ${nuevoStock}`);

    // Refrescamos el select para que los cambios se reflejen
    $("#lote").selectpicker('refresh');
}

function sumarCantidadLote(distNumber, cantidadSumar) {
    // Busca el <option> con el atributo 'name' igual al distNumber proporcionado
    let $opcion = $("#lote").find(`option[name="${distNumber}"]`);

    // Verifica si la opción existe
    if ($opcion.length === 0) {
        console.log("No se encontró una opción con DistNumber:", distNumber);
        return;
    }

    // Extrae el stock actual y el nombre del artículo
    let cant_stock = parseFloat($opcion.attr('cantidad')) || 0;
    let name_art = $("#articulo").find(':selected').attr('name');

    // Suma la cantidad al stock actual
    let nuevoStock = cant_stock + cantidadSumar;

    // Actualiza el atributo 'cantidad' con el nuevo valor
    $opcion.attr('cantidad', nuevoStock);

    // Actualiza el texto visible en el <option> correspondiente
    let lote_name = $opcion.attr('name');
    $opcion.text(`ItemName: ${name_art} - DistNumber: ${lote_name} - Stock: ${nuevoStock}`);

    // Refresca el select para que los cambios se reflejen
    $("#lote").selectpicker('refresh');
}

function sumarCantidadArticulo(itemcode, cantidadSumar) {
    // Busca el <option> con el atributo 'name' igual al distNumber proporcionado
    let $articulo = $("#articulo").find(`option[value="${itemcode}"]`);
    let lote_content = $articulo.attr('lote_content') === "Y" ? "TIENE LOTE" : "SIN LOTE";
    // Verifica si la opción existe
    if ($articulo.length === 0) {
        console.log("No se encontró una opción con itemcode:", itemcode);
        return;
    }
    // Extrae el stock actual y el nombre del artículo
    let cant_stock = parseFloat($articulo.attr('cantidad')) || 0;
    // Suma la cantidad al stock actual
    let nuevoStock = cant_stock + cantidadSumar;
    // Actualiza el atributo 'cantidad' con el nuevo valor
    $articulo.attr('cantidad', nuevoStock);
    // Actualiza el texto visible en el <option> correspondiente
    let itemname = $articulo.attr('name');
    $articulo.text(`${itemcode} | ${itemname} | Stock Total: ${nuevoStock} | ${lote_content}`);
    // Refresca el select para que los cambios se reflejen
    $("#articulo").selectpicker('refresh');
}


/*con esta función ejecutamos un crud para borrar la fila luego de hacer click en el boton deshacer
 * si tiene exito remueve la fila*/
function deshacerCargaBidon(mov_id, cantidad, distnumber) {
    const itemcode = $("#articulo").find(':selected').attr('value'); // Guardar el código de artículo actual
    const selectedLote = $("#lote").find(':selected').attr('value'); // Guardar el lote seleccionado
    const selectedPres = $("#pres").find(':selected').attr('value'); // Guardar la presentación seleccionada

    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_deshacer_bidon.jsp",
        data: {mov_id: mov_id},
        success: function (res) {
            if (res.tipo === 1) {
                // Eliminar fila de la tabla y mostrar mensaje de éxito
                tablaBidones.row($('#row' + mov_id)).remove().draw();
                toastr.success(res.mensaje, "mov_id: " + mov_id);

                // Recargar el select de artículos
                traerSelectArticulo().then(() => {
                    // Asignar y refrescar el último artículo seleccionado
                    $("#articulo").val(itemcode).selectpicker('refresh');

                    // Llamar a handleArticuloChange y esperar a que termine
                    Promise.resolve(handleArticuloChange($("#articulo")[0])).then(() => {

                        // Esperar a que los selects #lote y #pres se recarguen y asignar los valores guardados
                        traerLoteArticulo(itemcode).then(() => {
                            $("#lote").val(selectedLote).selectpicker('refresh');
                        });

                        traerSelectPresentacion(itemcode).then(() => {
                            $("#pres").val(selectedPres).selectpicker('refresh');
                        });
                    });
                });
            } else {
                toastr.error(res.mensaje, "Error");
            }
        },
        error: function (err) {
            toastr.error("Error en la operación", "Error");
            console.error(err);
        }
    });
}



function confirmarMovBidonV1() {
//    let responsable = $("#responsable").val();
//    let estado = $("#tipo_mov").find(':selected').attr('estado');
//    let tipo = $("#tipo_mov").find(':selected').attr('name');
//    let ids = [];
//
//    if (estado == "E") {
//        // Recorre cada fila de la tabla y obtiene los mov_id de la columna en posición 0
//        tablaBidones.rows().every(function () {
//            let data = this.data();
//            ids.push(data[1]);  // posición mov_id
//        });
//    } else if (estado == "R" || estado == "D") {
//        // Recorre cada fila de la tabla y verifica si el checkbox está marcado
//        tablaBidones.rows().every(function () {
//            let $row = $(this.node()); // Accedemos al nodo de la fila
//            let checkbox = $row.find('input[type="checkbox"]'); // Encontramos el checkbox en la columna 10
//
//            // Verifica si el checkbox está marcado
//            if (checkbox.is(':checked')) {
//                let data = this.data();
//                ids.push(data[1]);  // Agrega el mov_id (posición 0) al array si está marcado
//            }
//        });
//    }
//
//    if (ids.length > 0) {
//        Swal.fire({
//            title: 'FORMULA ',
//            text: "DESEA REGISTRAR MOVIMIENTO A " + tipo + "?",
//            type: 'warning',
//            showCancelButton: true,
//            confirmButtonColor: '#3085d6',
//            cancelButtonColor: '#d33',
//            confirmButtonText: 'SI!',
//            cancelButtonText: 'NO!'
//        }).then((result) => {
//            if (result.value) {
//                $.ajax({
//                    type: 'post',
//                    url: 'cruds/control_bidones_itkv/crud_cambiar_estado_bidon.jsp',
//                    data: {
//                        ids_regmov: ids.join(','),
//                        tipoReg: estado  // Ejemplo: Tipo de registro, cámbialo según lo que necesites
//                    },
//                    success: function (res) {
//                        // Manejo de la respuesta
//                        if (res.tipo === 1) {
//                            if (estado == "E") {
//                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa");
//                                clearTable();
//                                $("#btnConfirBidon").prop("disabled", true); // deshabilitar el botón
//                                resetForm();
//                            } else if (estado == "R" || estado == "D") {
//                                traerGrillaBidones(responsable);//recargamos la tabla luego de confirmar la operación
//                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa");
//                            }
//                            // Verificar si la tabla está vacía
//                            if (tablaBidones.rows().count() === 0) {
//                                $("#btnConfirBidon").prop("disabled", true); // Deshabilitar si la tabla está vacía
//                            }
//                        } else if (res.tipo === 0) {
//                            console.log(res.mensaje);
//                        } else {
//                            toastr.error(res.mensaje, "Error en la actualizaci&oacute;n");
//                        }
//                    },
//                    error: function (jqXHR, textStatus, errorThrown) {
//                        toastr.error("Error en la solicitud: " + textStatus, "Error");
//                    }
//                });
//            }
//        });
//    } else {
//        toastr.warning("No hay movimientos para actualizar", "Advertencia");
//    }
}

function confirmarMovBidon() {
    let responsable = $("#responsable").val();
    let resp_entrega = $("#resp_entrega").val();
    let resp_entrega_name = $("#resp_entrega").find(':selected').attr('name');
    let estado = $("#tipo_mov").find(':selected').attr('estado');
    let tipo = $("#tipo_mov").find(':selected').attr('name');
    let ids = [];
    let data_ajax = {};
    let link = "";

    // Verificar si se seleccionó responsable para el estado "D"
    if (resp_entrega === "" && estado === "D") {
        toastr.warning("Debe seleccionar responsable a entregar bidones", "Advertencia");
        return;
    }

    // Recorrer las filas de la tabla y obtener los mov_id
    tablaBidones.rows().every(function () {
        let $row = $(this.node());
        let checkbox = $row.find('input[type="checkbox"]');
        let data = this.data();

        // Si es estado "E" o si el checkbox está marcado (para "R" y "D")
        if (estado === "E" || (estado !== "E" && checkbox.is(':checked'))) {
            ids.push(data[2]);  // posición mov_id
        }
    });

    if (estado === "E") {
        data_ajax = {
            ids_regmov: ids.join(','),
            tipoReg: estado
        };
        link = "cruds/control_bidones_itkv/crud_cambiar_estado_bidon.jsp";
    } else if (estado === "R" || estado === "D") {
        data_ajax = {
            ids_regmov: ids.join(','),
            tipoReg: estado,
            res_id: estado === "D" ? resp_entrega : undefined,
            res_name: estado === "D" ? resp_entrega_name : undefined
        };
        link = estado === "R" ? "cruds/control_bidones_itkv/crud_cambiar_estado_bidon.jsp" : "cruds/control_bidones_itkv/crud_cambiar_estado_bid_des.jsp";
    }

    if (ids.length > 0) {
        Swal.fire({
            title: 'FORMULA ',
            text: "DESEA REGISTRAR MOVIMIENTO A " + tipo + "?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI!',
            cancelButtonText: 'NO!'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: 'post',
                    url: link,
                    data: data_ajax,
                    success: function (res) {
                        if (res.tipo === 1) {
                            if (estado === "E") {
                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa mod: E");
                                clearTable();
                                $("#btnConfirBidon").prop("disabled", true);
                                resetForm();
                            } else {
                                traerGrillaBidones(estado === "R" ? responsable : "TODOS");
                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa mod: " + estado);
                            }
                            if (tablaBidones.rows().count() === 0) {
                                $("#btnConfirBidon").prop("disabled", true);
                            }
                        } else {
                            toastr.error(res.mensaje, "Error en la actualizaci&oacute;n");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        toastr.error("Error en la solicitud: " + textStatus, "Error");
                    }
                });
            }
        });
    } else {
        toastr.warning("No hay movimientos para actualizar", "Advertencia");
    }
}


// Función para manejar el escaneo o ingreso manual del código de barras
function escanCodBarReasig(mov_id, inputElement) {
    const $inputElement = $(inputElement); // Convertir a jQuery object
    const cod_bar_actual = $inputElement.val().trim();
    const cod_bar_anterior = $inputElement.data('original-value') || '';
    const tdElement = $(inputElement).closest('td');
    const trElement = $(inputElement).closest('tr');

    const cod_barra = trElement.find('td:eq(5)').text(); // Cantidad entregada

    // Validamos que no sea un código vacío o nulo, y que haya habido un cambio
    if ((event.keyCode === 13 || event.which === 13 || event.type === "blur") && cod_bar_actual !== "") {
        // Guardamos el valor previo en un atributo para futuras validaciones
        $inputElement.data('original-value', cod_bar_actual);
        if (cod_bar_actual !== cod_barra && cod_bar_actual !== cod_bar_anterior) {
            // Llamamos a la función para reasignar el código de barras
            reasignarCodBar(mov_id, cod_bar_actual, $inputElement); // Pasamos el inputElement   
        } else if (cod_barra === cod_bar_actual) {
            aviso_generico(0, "El c&oacute;digo de barras ya existe, favor verificar");
            $(inputElement).val('');
            $(tdElement).addClass('update-error').removeClass('update-pending');
            setTimeout(function () {
                $(tdElement).removeClass('update-error');
            }, 1000);
        }
    } else if (cod_bar_actual === "") {
        console.log('El codigo de barras esta vacio. No se enviaran datos.');
    }
}

// Función que realiza la petición AJAX para reasignar el código de barras
function reasignarCodBar(mov_id, cod_bar, inputElement) {  // Añadimos $inputElement como parámetro
    const tdElement = $(inputElement).closest('td');
    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_reasig_code_bar.jsp",
        data: {
            mov_id: mov_id,
            cod_bar: cod_bar
        },
        beforeSend: function () {
            $(tdElement).addClass('update-pending');
        },
        success: function (res) {
            if (res.tipo == 1) {
                aviso_generico(res.tipo, "C&oacutedigo reasignado correctamente");
                $(tdElement).addClass('update-success').removeClass('update-pending');
                setTimeout(function () {
                    $(tdElement).removeClass('update-success');
                }, 800);

            } else {
                aviso_generico(res.tipo, "El c&oacute;digo no fue reasignado, int&eacute;ntelo nuevamente");
                $(inputElement).val('');
                $(tdElement).addClass('update-error').removeClass('update-pending');
                setTimeout(function () {
                    $(tdElement).removeClass('update-error');
                }, 1000);
            }
        },
        error: function (err) {
            console.error('Error en la peticion AJAX: ', err);
        }
    });
}


// Función para manejar el ingreso manual o escaneo de la cantidad restante
function cantidadRestante(mov_id, inputElement) {
    const $inputElement = $(inputElement); // Convertir a jQuery object
    const cant_actual = $inputElement.val().trim();
    const cant_anterior = $inputElement.data('original-value') || '';
    const tdElement = $(inputElement).closest('td');
    const trElement = $(inputElement).closest('tr');
    const cantTd = $("#cantspan" + mov_id).text();


    // Obtener todos los datos de la fila
    const cantEntregada = parseFloat(trElement.find('td:eq(4)').text()); // Cantidad entregada

    // Validamos que no sea una cantidad vacía o nula, y que haya habido un cambio
    if ((event.keyCode === 13 || event.which === 13 || event.type === "blur") && cant_actual !== "" && cant_actual !== cant_anterior) {
        const cantParsed = parseFloat(cant_actual);
        const cantTdParsed = parseFloat(cantTd);

        // Verificamos que la cantidad actual sea un número válido
        if (cantParsed >= 0 && cantParsed <= cantEntregada && cantParsed !== cantTdParsed) {
            // Llamamos al CRUD para actualizar la cantidad restante
            actualizarCantidad(mov_id, cantParsed, $inputElement); // Pasamos el inputElement
            // Asignamos el valor solo si es válido
            $inputElement.data('original-value', cant_actual);
        } else if (cantParsed === cantTdParsed) {
            console.log('El valor es el mismo, no se enviara al crud');
        } else {
            // Mostrar mensajes de error y restaurar el valor original si no es válido
            if (cantParsed < 0) {
                toastr.error('La cantidad no puede ser un n&uacute;mero negativo', "Error: ");
            } else if (cantParsed > cantEntregada) {
                toastr.error('La cantidad recibida no puede ser mayor a la entregada', "Error: ");
            }
            $(inputElement).val('');
            $(tdElement).addClass('update-error').removeClass('update-pending');
            setTimeout(function () {
                $(tdElement).removeClass('update-error');
            }, 1000);
        }
    } else if (cant_actual === "") {
        console.log('La cantidad esta vacia. No se enviaran datos.');
    }
}

// Función que realiza la petición AJAX para actualizar la cantidad restante
function actualizarCantidad(mov_id, cant, inputElement) {
    const tdElement = $(inputElement).closest('td');
    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_carga_cant_rest.jsp",
        data: {
            mov_id: mov_id,
            cant: cant
        },
        beforeSend: function () {
            $(tdElement).addClass('update-pending');
        },
        success: function (res) {
            if (res.tipo == 1) {
                toastr.success(res.mensaje, "Mensaje de &eacute;xito: ");
                $(tdElement).addClass('update-success').removeClass('update-pending');
                setTimeout(function () {
                    $(tdElement).removeClass('update-success');
                }, 800);

            } else {
                toastr.error('Error al actualizar la cantidad restante: ' + res.mensaje, "Error: ");
                $(inputElement).val('');
                $(tdElement).addClass('update-error').removeClass('update-pending');
                setTimeout(function () {
                    $(tdElement).removeClass('update-error');
                }, 1000);
            }
        },
        error: function (err) {
            console.log('Error en la peticion AJAX: ', err);
        }
    });
}

function manejoResponablesReciclaje() {
    if ($("#resp_entrega").val() === "OTROS") {
        $("#responsable_por_entrega").show();
        $("#responsable_por_entrega").val("");
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else if ($("#resp_entrega").val() === "") {
        $("#resp_entrega").hide();
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else {
        $("#resp_entrega").hide();
    }
}

// Función para manejar el ingreso manual o escaneo de la cantidad restante
function crearNuevoResponsableItkv(nombre) {
    if (event.keyCode === 13 || event.which === 13) {
        crudNuevoResponsableItkv(nombre);
    }
}

// Función que realiza la petición AJAX para insertar nuevo responsable
function crudNuevoResponsableItkv(nombre) {
    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_nuevo_responsable_itkv.jsp",
        data: {
            nombre: nombre
        },
        beforeSend: function () {
            cargar_load("...Cargando");
        },
        success: function (res) {
            cerrar_load();
            if (res.tipo == 1) {
                toastr.success(res.mensaje, "Mensaje de &eacute;xito: ");
                traerSelectResponsable();
                $("#responsable_por").val('');
                $("#responsable_por").hide();
                $("#responsable_por_entrega").val('');
                $("#responsable_por_entrega").hide();
            } else {
                toastr.error('Error al actualizar la cantidad restante: ' + res.mensaje, "Error: ");
            }
        },
        error: function (err) {
            console.log('Error en la petici&oacute;n AJAX: ', err);
        }
    });
}

// funcion que llena el select responsable luego de insertar nuevo 
function traerSelectResponsable() {
    $.ajax({
        type: "post",
        url: "consultas/control_bidones_itkv/consulta_select_responsable_itkv.jsp",
        success: function (res) {
            $("#responsable").html(''); // Limpiar el select
            $("#resp_entrega").html(''); // Limpiar el select

            // Verificamos si hay una lista de articulos
            if (res.responsables && res.responsables.length > 0) {
                let newOption = ""; // Inicializamos correctamente como cadena vacía

                // Iteramos sobre las opciones recibidas y las agregamos al select
                res.responsables.forEach(responsable => {
                    newOption += `<option value="${responsable.id}" name="${responsable.nombre}" >${responsable.nombre}</option>`;
                });
                $("#responsable").html("<option value=''>Seleccione responsable</option>" + newOption + "<option>OTROS</option>");
                $("#responsable").selectpicker('refresh');
                $("#resp_entrega").html("<option value=''>Seleccione responsable</option>" + newOption + "<option>OTROS</option>");
                $("#resp_entrega").selectpicker('refresh');
            } else {
                $("#responsable").html("<option value=''>No hay responsables disponibles</option>");
                $("#responsable").selectpicker('refresh');
                $("#resp_entrega").html("<option value=''>No hay responsables disponibles</option>");
                $("#resp_entrega").selectpicker('refresh');
            }
        },
        error: function (err) {
            console.error("Error al obtener los responsables: ", err);
        }
    });
}


/************************************************************************INFORME BIDONES*********************************************************************************/
/*contenedor informe movimiento bidones*/
function irInformeMovimientosBidones() {
    $.ajax({
        type: "post",
        url: "contenedores/control_bidones_itkv/contenedor_informe_bidones.jsp",
        beforeSend: function () {
            $("#contenedor_principal").html("");
            cargar_load("....Cargando");
        },
        success: function (res) {
            $("#contenedor_principal").html(res);
            cerrar_load();
            initDataTableInfoBidones();
            $('.selectpicker').selectpicker();
            cargar_estilo_calendario_global("dd/mm/yyyy");
            $("#tipo_mov").change(function () {
                let tipo = $("#tipo_mov").val();
                if (tipo !== "") {
                    $("#btnGenRepBidon").removeAttr("disabled");
                } else {
                    $("#btnGenRepBidon").attr("disabled", "disabled");
                    $("#div_cont_inf_bidones").hide();
                }
            });
        }
    });
}

function actualizarTitulo(desde, hasta) {
    var estado = $("#tipo_mov option:selected").text();
    var tipo = $("#tipo_mov").val();
    var titulo;
    if (tipo !== "3") {
        titulo = "MOVIMIENTOS BIDONES EN ESTADO " + estado + " - " + desde + " - " + hasta;
    } else {
        titulo = "MOVIMIENTOS BIDONES EN ESTADO " + estado;
    }
    $('#card-title-detalle').text(titulo);
}


function initDataTableInfoBidones(desde, hasta, estado) {
    tablaInformeBidones = $("#tabla-informe-bidones").DataTable({
        destroy: true,
        lengthMenu: [[10, 25, 50, 100, -1], ["10 registros", "25 registros", "50 registros", "100 registros", "Mostrar todos"]],
        dom: "Bflrtip",
        language:
                {
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
                    columns: ':visible'
                }
            },
            {
                extend: 'excelHtml5',
                text: 'EXCEL',
                title: 'INFORME MOVIMIENTOS BIDONES EN ESTADO ' + estado + ' - ' + desde + ' - ' + hasta, // Establecer el nombre del archivo aquí
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'pdfHtml5',
                text: 'PDF',
                title: 'INFORME MOVIMIENTOS BIDONES EN ESTADO ' + estado + ' - ' + desde + ' - ' + hasta, // Establecer el nombre del archivo aquí
                orientation: "landscape",
                pageSize: "LEGAL",
                customize: function (e) {
                    (e.styles.title = {color: "white", fontSize: "20", background: "black", alignment: "center"}),
                            (e.styles.tableHeader = {fontSize: "6"}),
                            (e.styles.tableBodyEven = {fontSize: "6"}),
                            (e.styles.tableBodyOdd = {fontSize: "6"}),
                            (e.styles.tableFooter = {fontSize: "6"}),
                            (e.styles["td:nth-child(2)"] = {width: "100px", "max-width": "100px"});
                },
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'print',
                text: 'IMPRIMIR',
                title: 'INFORME MOVIMIENTOS BIDONES EN ESTADO ' + estado + ' - ' + desde + ' - ' + hasta, // Establecer el nombre del archivo aquí
                exportOptions: {
                    columns: ':visible'
                }
            }, // Botón para IMPRIMIR
            {
                extend: 'copy',
                text: 'COPIAR GRILLA',
                exportOptions: {
                    columns: ':visible'
                }
            } // Botón para copiar al portapapeles
        ],
        keys: {clipboard: !1}
    });
}

function generarReporteBidones() {
    let estado = $("#tipo_mov").find(":selected").attr("estado");
    let fecha_desde = $("#desde").val();
    let fecha_hasta = $("#hasta").val();
    $.ajax({
        type: "post",
        url: "consultas/control_bidones_itkv/consulta_obj_bidones_estado.jsp",
        data: {
            estado: estado,
            desde: fecha_desde,
            hasta: fecha_hasta
        },
        beforeSend: function () {
            tablaInformeBidones.clear().draw();
        },
        success: function (res) {
            initDataTableInfoBidones(fecha_desde, fecha_hasta, estado);
            actualizarTitulo(fecha_desde, fecha_hasta);
            let bidones = res.bidones;
            let index = 1;
            if (estado !== "") {
                bidones.forEach(fila => {
                    tablaInformeBidones.row.add([
                        index,
                        fila.mov_id,
                        fila.codigoBarra,
                        fila.codigoBarra2,
                        fila.nombre,
                        fila.presentacion,
                        fila.ot,
                        fila.responsable,
                        fila.fechaEstimadaDev,
                        fila.fechaEntrega,
                        fila.fechaDevolucion,
                        fila.fechaDestruccion,
                        fila.cantidadEntregada,
                        fila.cantidadRecibida
                    ]).draw();
                    index++;
                });

                // Aplicar el multifiltro aquí después de que las filas estén generadas
                tablaInformeBidones.columns().every(function () {
                    let column = this;
                    let title = $(column.header()).text(); // Obtén el título de la columna

                    let select = $('<select class="selectpicker" data-live-search="true" title="' + title + '"><option value=""></option></select>')
                            .appendTo($(column.footer()).empty())
                            .on('change', function () {
                                let val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });

                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>');
                    });
                    // Inicializa selectpicker con container: 'body' para los selects dinámicos
                    select.selectpicker({
                        container: 'body'  // Para los selects generados dinámicamente
                    });
                });

                $("#div_cont_inf_bidones").show();
            } else {
                $("#div_cont_inf_bidones").hide();
            }
        }
    });
}

