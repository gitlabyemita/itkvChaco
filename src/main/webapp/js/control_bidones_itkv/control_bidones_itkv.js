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
                "destroy": true,
                "language": {
                    sSearch: "Buscar:",
                    sLengthMenu: "Mostrar _MENU_ registros",
                    sZeroRecords: "No se encontraron resultados",
                    sEmptyTable: "Ning&uacute;n dato disponible en esta tabla",
                    sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
                    sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                    sLoadingRecords: "Cargando...",
                    oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"}
                }
            });

            $('.selectpicker').selectpicker({size: '10'
            });

            cargar_estilo_calendario_global("dd/mm/yyyy");

            // Evento para manejar las celdas editables
//            tablaBidones.on('draw.dt', function () {
//                // Activar celdas contenteditable y manejo de eventos
//                $('.editable').on('focus', function () {
//                    $(this).data('orig', $(this).val()); // Guarda el valor original
//                });
//
//                $('.editable').on('blur', function () {
//                    let nuevoValor = $(this).val();
//                    let id = $(this).closest('tr').find('td:first').text(); // Obten el ID del mov_id
//                    let campo = $(this).data('campo');
//
//                    if (nuevoValor != $(this).data('orig')) {
//                        $.ajax({
//                            url: "/ruta/de/actualizacion", // Cambia a la ruta de actualización de tu backend
//                            type: 'POST',
//                            data: {
//                                'mov_id': id,
//                                'campo': campo,
//                                'valor': nuevoValor
//                            },
//                            success: function (response) {
//                                // Manejar el éxito de la actualización
//                                console.log("Valor actualizado con éxito.");
//                            },
//                            error: function () {
//                                // Manejar el error
//                                console.log("Error en la actualización.");
//                            }
//                        });
//                    }
//                });
//            });
        }
    });
}

function resetForm() {
    $("#ot, #dev_estimada, #cant, #bidon, #cod_barra").val('');
    $("#articulo, #pres, #responsable").val('').selectpicker('refresh');
    $("#btnConfirBidon").prop("disabled", true);
}

function clearTable() {
    tablaBidones.clear().draw();
}

function isEmpty(...fields) {
    return fields.some(field => field === "");
}

/*con esta funcion ejecutamos el crud para luego agregar una nueva fila en la grilla*/
function agregarBidonGrilla() {
    const tipo = $("#tipo_mov").val(),
            id_resp = $("#responsable").val(),
            resp = $("#responsable").find(':selected').attr('name'),
            ot = $("#ot").val(),
            f_dev = $("#dev_estimada").val(),
            cod_art = $("#articulo").val(),
            name_art = $("#articulo").find(':selected').attr('name'),
            pres = $("#pres").val(),
            cantidad = $("#pres").find(':selected').attr('cantidad'),
            name_pres = $("#pres").find(':selected').attr('name'),
            cod_barra = $("#cod_barra").val(),
            estado = $("#tipo_mov").find(':selected').attr('estado');

    const table = $("#tabla-bidones").DataTable();
    var codBarExists = table.column(2).data().toArray().includes(cod_barra);
    if (isEmpty(id_resp, resp, f_dev, name_art, pres, cod_barra, cod_art)) {
        toastr.error("Los campos deben estar completos, s&oacute;lo la OT es opcional.", "Error");
        return;
    } else if (codBarExists) {
        toastr.error("El c&oacute;digo de barra ya existe", "Error");
        $("#cod_barra").val("");
    } else {
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
                            cantidad,
                            "",
                            res.id
                            );
                    toastr.success(res.mensaje, "El bid&oacute;n " + res.id);
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
                                        fila.mov_id
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
function agregarFilaBidon(mov_id, cod_barra, cod_barra2, name_art, pres, ot, resp, f_dev, cantidad, cantidadR, accion) {
    // Obtener la cantidad de filas actuales para calcular el índice
    const index = tablaBidones.rows().count() + 1; // Agregar 1 para obtener el nuevo índice
    const newData = [
        index,
        mov_id,
        cod_barra,
        cod_barra2,
        name_art,
        pres,
        ot,
        resp,
        f_dev,
        cantidad,
        cantidadR,
        '<button id=\"btn' + accion + '\" class=\"btn btn-warning text-center\" onclick=\"deshacerCargaBidon(' + accion + ')\"><i class=\"fa-solid fa-trash\"></i> Deshacer</button>'
    ];
    // Agregar la nueva fila a la tabla
    var rowNode = tablaBidones.row.add(newData).draw(false).node();

    // Asignar ID a la fila recién agregada
    $(rowNode).attr('id', 'row' + accion);

    // Limpiar el campo de código de barras
    $('#cod_barra').val('');

    // Volver a ordenar las filas en orden descendente según el índice (columna 0)
    tablaBidones.order([0, 'desc']).draw();
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
            toggleElements("#row_responsable, #row_ot, #row_devolucion, #row_articulo, #row_presentacion, #row_codebar, #row_agregar, #content_tb_bidones", "");
            break;
        case "2":
            changeHeaderColor("bg-primary bg-danger", "bg-warning");
            toggleElements("#row_responsable, #row_ot, #row_codebar, #content_tb_bidones", "#row_devolucion, #row_articulo, #row_presentacion, #row_agregar, #row_ot");
            break;
        case "4":
            changeHeaderColor("bg-primary bg-warning", "bg-danger");
            toggleElements("#row_ot, #row_codebar, #content_tb_bidones", "#row_responsable, #row_devolucion, #row_articulo, #row_presentacion, #row_agregar, #row_ot");
            traerGrillaBidones("TODOS");
            break;
        default:
            toggleElements("", "#row_responsable, #row_ot, #row_devolucion, #row_articulo, #row_presentacion, #row_codebar, #row_agregar, #content_tb_bidones");
            break;
    }
}
;

function crearResponsableBidones() {
    if ($("#responsable").val() === "OTROS") {
        $("#responsable_por").show();
        $("#responsable_por").val("");
        $("#responsable_por").attr("required");
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else if ($("#responsable").val() === "") {
        $("#responsable_por").hide();
        $("#responsable_por").removeAttr("required");
        clearTable(); // Limpia el contenido del DataTable
        $("#btnConfirBidon").prop("disabled", true); // Deshabilitar el botón
    } else {
        $("#responsable_por").hide();
        $("#responsable_por").removeAttr("required");
    }
}

/*esta funcion genera dinamicamente una grilla en el caso que el responsable tenga bidones en estado P de pendiente*/
function traerGrillaBidones(responsable) {
    let tipo = $("#tipo_mov").val(); // Capturamos el valor de tipo_mov
    let estado;
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
                        index, // Añadir el índice en la primera columna
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
                        "<button id='btnEliminarBidon' class='btn btn-warning text-center' onclick='deshacerCargaBidon(" + fila.mov_id + ")'><i class='fa-solid fa-trash'></i> Deshacer</button>"
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++; // Aumentamos el contador de índice
                });

                // Ahora ordena los datos en la columna 1 (mov_id) de mayor a menor
                tablaBidones.order([1, 'desc']).draw(); // 'desc' para ordenar de mayor a menor en la columna mov_id
            } else if (estado == "E") {
                initDataTableControlBidones();
                bidones.forEach(fila => {
                    let newRow = tablaBidones.row.add([
                        index,
                        fila.mov_id,
                        fila.codigoBarra,
                        `<input type="text" id="code${fila.mov_id}" class="form-control editable" value="${fila.codigoBarra2}" style="display:none;" onblur="escanCodBarReasig(${fila.mov_id}, this)" onkeypress="escanCodBarReasig(${fila.mov_id}, this)"/>`, // Celda editable para codigoBarra2
                        fila.nombre,
                        fila.presentacion,
                        fila.ot,
                        fila.responsable,
                        fila.fechaDevolucion,
                        fila.cantidadEntregada,
                            `<input type="number" id="cant${fila.mov_id}" class="form-control editable" value="${fila.cantidadRecibida}" style="display:none;" onblur="cantidadRestante(${fila.mov_id}, this.value)"/>`, // Celda editable para cantidadRecibida
                        `<input type="checkbox" class="chk-mov-id" value="${fila.mov_id}" onchange="mostrarOcultarCeldabidon(${fila.mov_id})"/>` // Checkbox para identificar el mov_id
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++;
                    // Ahora ordenamos los datos en la columna 0 mov_id de mayor a menor 
                    tablaBidones.order([0, 'desc']).draw();
                });
            } else {
                bidones.forEach(fila => {
                    let newRow = tablaBidones.row.add([
                        index,
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
                        `<input type="checkbox" class="chk-mov-id" value="${fila.mov_id}" onchange="mostrarOcultarCeldabidon(${fila.mov_id})"/>` // Checkbox para identificar el mov_id
                    ]).draw().node(); // Obtén el nodo del `tr` recién creado

                    $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción

                    index++;
                    // Ahora ordenamos los datos en la columna 0 mov_id de mayor a menor 
                    tablaBidones.order([0, 'desc']).draw();
                });

            }
            // Restablecer valores de los campos del formulario
            $("#ot").val('');
            $("#dev_estimada").val('');
            $("#articulo").val('').selectpicker('refresh');
            $("#pres").val('').selectpicker('refresh');
            $("#cod_barra").val('');
            $("#ot, #dev_estimada, #cant, #bidon, #cod_barra").val('');
            $("#articulo, #pres").val('').selectpicker('refresh');

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
    let tipo = $("#tipo_mov").val(); // Capturamos el valor de tipo_mov
    let estado;
    if (tipo == 1) {
        estado = "P";
    } else if (tipo == 2) {
        estado = "E";
    } else {
        estado = "R";
    }
    clearTable(); // Limpia la tabla antes de agregar nuevos datos

    // Inicializamos la tabla de bidones con DataTables
    tablaBidones = $("#tabla-bidones").DataTable({
        "destroy": true,
        "serverSide": true,
        "order": [[0, 'desc']], // Ordenar inicialmente por la columna 0 (índice) de mayor a menor
        dom: "Bfrtip",
        "language": {
            sSearch: "Buscar:",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sLoadingRecords: "Cargando...",
            oPaginate: {sFirst: "Primero", sLast: "Último", sNext: "Siguiente", sPrevious: "Anterior"}
        },
        buttons: [
            {
                extend: 'colvis',
                text: 'MOSTRAR / OCULTAR',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ],
        "ajax": {
            "url": "/consultas/control_bidones_itkv/consulta_obj_bidones_resp.jsp?responsable=" + responsable + "&estado=" + estado
        },
        columns: [
            // Columna de índice dinámico
            {
                data: null,
                className: 'text-center',
                orderable: false,
                createdCell: function (td, cellData, rowData, rowIndex) {
                    $(td).html(rowIndex + 1); // Índice dinámico
                }
            },
            {data: 'mov_id', name: 'mov_id', className: 'text-center', orderable: false},
            {data: 'codigoBarra', name: 'codigoBarra', orderable: false},
            {
                data: 'codigoBarra2',
                name: 'codigoBarra2',
                orderable: false,
                createdCell: function (td, cellData, rowData) {
                    $(td).attr('id', `code${rowData.mov_id}`);
                    if (estado === "E") {
                        $(td).attr('contenteditable', 'false');
                        $(td).on('keypress', function (event) {
                            return escanCodBarReasig(rowData.mov_id, $(this).text(), event);
                        });
                    }
                }
            },
            {data: 'nombre', name: 'nombre', orderable: false},
            {data: 'presentacion', name: 'presentacion', orderable: false},
            {data: 'ot', name: 'ot', orderable: false},
            {data: 'responsable', name: 'responsable', orderable: false},
            {data: 'fechaDevolucion', name: 'fechaDevolucion', orderable: false},
            {data: 'cantidadEntregada', name: 'cantidadEntregada', orderable: false},
            {
                data: 'cantidadRecibida',
                name: 'cantidadRecibida',
                orderable: false,
                createdCell: function (td, cellData, rowData) {
                    $(td).attr('id', `cant${rowData.mov_id}`);
                    if (estado === "E") {
                        $(td).attr('contenteditable', 'false');
                        $(td).on('keypress', function (event) {
                            return cantidadRestante(rowData.mov_id, $(this).text(), event);
                        });
                    }
                }
            },
            {
                data: 'mov_id',
                orderable: false,
                render: function (data, type, row) {
                    return (estado === "E") ?
                            `<input type="checkbox" class="chk-mov-id" value="${data}" onchange="mostrarOcultarCeldabidon(${data})" />` :
                            `<button id='btnEliminarBidon' class='btn btn-warning text-center' onclick='deshacerCargaBidon(${data})'><i class='fa-solid fa-trash'></i> Deshacer</button>`;
                }
            }
        ],
        "columnDefs": [
            {targets: [1, 2, 3, 4], className: 'text-right'},
            {orderable: false, targets: [1, 2, 3, 4]} // Deshabilitar ordenamiento en las columnas específicas
        ],

        // Ordenar los datos después de renderizar
        "drawCallback": function (settings) {
            tablaBidones.order([0, 'desc']).draw(false); // Ordenar de mayor a menor la columna índice
        }
    });
}



function initDataTableControlBidones() {
    tablaInformeBidones = $("#tabla-bidones").DataTable({
        "destroy": true,
        dom: "Bfrtip",
        "language":
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
            }
        ],
        keys: {clipboard: !1}
    });
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
            var codBarExists = tablaBidones.column(2).data().toArray().includes(cod_barra);
            var codBarExists2 = tablaBidones.column(3).data().toArray().includes(cod_barra);

            if (codBarExists || codBarExists2) {
                // Desactivar la paginación temporalmente para manipular la fila
                tablaBidones.page.len(-1).draw(false); // -1 muestra todas las filas

                // Si el código de barra existe, encuentra la fila correspondiente
                tablaBidones.rows().every(function () {
                    let data = this.data();
                    if (data[2] === cod_barra || data[3] === cod_barra) {
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
        tablaBidones.column(0).data().each(function (value) {
            highestIndex = Math.max(highestIndex, value);
        });

        // Actualizamos el índice de la fila a ser mayor al número actual más alto
        data[0] = highestIndex + 1;

        // Remover la fila original
        tablaBidones.row($row).remove().draw(false);

        // Agregar la fila con el nuevo índice al principio
        let newRow = tablaBidones.row.add(data).draw(false).node();
        $(newRow).attr('id', 'row' + mov_id); // Agregar nuevamente el id a la nueva fila

        // Ordenar la tabla de acuerdo a la columna 0 en orden descendente
        tablaBidones.order([0, 'desc']).draw(false);

        // Volver a seleccionar el checkbox de la fila redibujada y marcarlo
        let newCheckbox = $(newRow).find('input[type="checkbox"]');
        newCheckbox.prop('checked', true); // Marcar el checkbox redibujado

        // Si el estado es "R", muestra los inputs ocultos
        if (estado === "R") {
            $("#code" + mov_id).show();
            $("#cant" + mov_id).show();
        }

        // Restaurar la paginación original y volver a la página en la que estábamos
        tablaBidones.page.len(10).draw(false); // Cambia a paginación normal (por ejemplo, 10 filas por página)
    } else {
        // Si el estado es "R", oculta los inputs 
        if (estado === "R") {
            $("#code" + mov_id).hide();
            $("#cant" + mov_id).hide();
        }
    }
}

/*con esta función ejecutamos un crud para borrar la fila luego de hacer click en el boton deshacer
 * si tiene exito remueve la fila*/
function deshacerCargaBidon(mov_id) {
    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_deshacer_bidon.jsp",
        data: {mov_id: mov_id},
        beforeSend: function () {
        },
        success: function (res) {
            if (res.tipo == 1) {
                tablaBidones.row($('#row' + mov_id)).remove().draw();
                toastr.success(res.mensaje, "mov_id: " + mov_id + " ");
            } else {
                toastr.error(res.mensaje, "Error: ");
            }
        }
    });
}

function confirmarMovBidon() {
    let responsable = $("#responsable").val();
    let estado = $("#tipo_mov").find(':selected').attr('estado');
    let tipo = $("#tipo_mov").find(':selected').attr('name');
    let ids = [];

    if (estado == "E") {
        // Recorre cada fila de la tabla y obtiene los mov_id de la columna en posición 0
        tablaBidones.rows().every(function () {
            let data = this.data();
            ids.push(data[1]);  // posición mov_id
        });
    } else if (estado == "R" || estado == "D") {
        // Recorre cada fila de la tabla y verifica si el checkbox está marcado
        tablaBidones.rows().every(function () {
            let $row = $(this.node()); // Accedemos al nodo de la fila
            let checkbox = $row.find('input[type="checkbox"]'); // Encontramos el checkbox en la columna 10

            // Verifica si el checkbox está marcado
            if (checkbox.is(':checked')) {
                let data = this.data();
                ids.push(data[1]);  // Agrega el mov_id (posición 0) al array si está marcado
            }
        });
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
                    url: 'cruds/control_bidones_itkv/crud_cambiar_estado_bidon.jsp',
                    data: {
                        ids_regmov: ids.join(','),
                        tipoReg: estado  // Ejemplo: Tipo de registro, cámbialo según lo que necesites
                    },
                    success: function (res) {
                        // Manejo de la respuesta
                        if (res.tipo === 1) {
                            if (estado == "E") {
                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa");
                                clearTable();
                                $("#btnConfirBidon").prop("disabled", true); // deshabilitar el botón
                                resetForm();
                            } else if (estado == "R" || estado == "D") {
                                traerGrillaBidones(responsable);//recargamos la tabla luego de confirmar la operación
                                toastr.success(res.mensaje, "Actualizaci&oacute;n exitosa");
                            }
                            // Verificar si la tabla está vacía
                            if (tablaBidones.rows().count() === 0) {
                                $("#btnConfirBidon").prop("disabled", true); // Deshabilitar si la tabla está vacía
                            }
                        } else if (res.tipo === 0) {
                            console.log(res.mensaje);
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

    // Validamos que no sea un código vacío o nulo, y que haya habido un cambio
    if ((event.keyCode === 13 || event.which === 13 || event.type === "blur") && cod_bar_actual !== "" && cod_bar_actual !== cod_bar_anterior) {
        // Guardamos el valor previo en un atributo para futuras validaciones
        $inputElement.data('original-value', cod_bar_actual);

        // Llamamos a la función para reasignar el código de barras
        reasignarCodBar(mov_id, cod_bar_actual, $inputElement); // Pasamos el inputElement
    } else if (cod_bar_actual === "") {
        console.log('El código de barras está vacío. No se enviarán datos.');
    }
}

// Función que realiza la petición AJAX para reasignar el código de barras
function reasignarCodBar(mov_id, cod_bar) {  // Añadimos $inputElement como parámetro
    $.ajax({
        type: "post",
        url: "cruds/control_bidones_itkv/crud_reasig_code_bar.jsp",
        data: {
            mov_id: mov_id,
            cod_bar: cod_bar
        },
        beforeSend: function () {
            // Opcional: Mostrar un indicador de carga
        },
        success: function (res) {
            if (res.tipo == 1) {
                aviso_generico(res.tipo, res.mensaje);

                // Si la respuesta es exitosa (tipo == 1), hacer focus en el input para seguir escaneando
                $("#cod_barra").focus();
            } else {
                console.log('Error al reasignar el código de barras: ', res.mensaje);
            }
        },
        error: function (err) {
            console.error('Error en la petición AJAX: ', err);
        }
    });
}


/*función que agrega un nuevo nuevo código de barras al bidon asignado por mov_id*/
function cantidadRestante(mov_id, cant) {
        $.ajax({
            type: "post",
            url: "cruds/control_bidones_itkv/crud_carga_cant_rest.jsp",
            data: {
                mov_id: mov_id,
            cant: cant
            },
            beforeSend: function () {

            },
            success: function (res) {
                if (res.tipo == 1) {
                    aviso_generico(res.tipo, res.mensaje);
                } else {
                    aviso_generico(res.tipo, res.mensaje);
                }
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
        "destroy": true,
        dom: "Bfrtip",
        "language":
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

