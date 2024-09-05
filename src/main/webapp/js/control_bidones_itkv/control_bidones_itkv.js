/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

let tablaBidones;
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
                    "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
                }/*,
                 "columnDefs":[{
                 className:"tr-hover", targets:[0,1,2,3,4,5,6,,7,8,9,10]      
                 }]*/
            }).order([0, 'desc']);

            $('.selectpicker').selectpicker({size: '10'
            });
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
            // Verifica si el código de barra existe en la columna 1 de la tabla
            var codBarExists = tablaBidones.column(1).data().toArray().includes(cod_barra);
            
            if (codBarExists) {
                // Si el código de barra existe, encuentra la fila correspondiente
                tablaBidones.rows().every(function() {
                    let data = this.data();
                    
                    // Verifica si el código de barra en la columna 1 coincide
                    if (data[1] === cod_barra) {
                        // Encuentra el checkbox de esta fila y lo marca como checked
                        let $row = $(this.node());
                        let $checkbox = $row.find('input[type="checkbox"]');
                        
                        $checkbox.prop('checked', true); // Marca el checkbox
                        $checkbox.trigger('change'); // Dispara el evento onchange
                    }
                });
            } else {
                // Si no existe, puedes manejarlo aquí (mostrar alerta o alguna acción)
                console.warn("Código de barra no encontrado en la tabla.");
            }
        }
    }
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
    var codBarExists = table.column(1).data().toArray().includes(cod_barra);
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
    const newData = [
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
    var rowNode = tablaBidones.row.add(newData).order([0, 'desc']).draw(false).node();
    $(rowNode).attr('id', 'row' + accion);//AGREGA ID AL <tr> FILA.
    $('#cod_barra').val('');
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
            toggleElements("#row_responsable, #row_ot, #row_codebar, #content_tb_bidones", "#row_devolucion, #row_articulo, #row_presentacion, #row_agregar");
            break;
        case "4":
            changeHeaderColor("bg-primary bg-warning", "bg-danger");
            toggleElements("#row_responsable, #row_ot, #row_codebar, #content_tb_bidones", "#row_devolucion, #row_articulo, #row_presentacion, #row_agregar");
            break;
        default:
            toggleElements("", "#row_responsable, #row_ot, #row_devolucion, #row_articulo, #row_presentacion, #row_codebar, #row_agregar, #content_tb_bidones");
            break;
    }
}
;

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
                if (estado == "P") {
                    bidones.forEach(fila => {
                        let newRow = tablaBidones.row.add([
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
                    });
                } else if (estado == "E") {
                    bidones.forEach(fila => {
                        let newRow = tablaBidones.row.add([
                            fila.mov_id,
                            fila.codigoBarra,
                            `<input type="text" id="code${fila.mov_id}" class="form-control editable" value="${fila.codigoBarra2}" style="display:none;" />`, // Celda editable para codigoBarra2
                            fila.nombre,
                            fila.presentacion,
                            fila.ot,
                            fila.responsable,
                            fila.fechaDevolucion,
                            fila.cantidadEntregada,
                            `<input type="text" id="cant${fila.mov_id}" class="form-control editable" value="${fila.cantidadRecibida}" style="display:none;" />`, // Celda editable para cantidadRecibida
                            `<input type="checkbox" class="chk-mov-id" value="${fila.mov_id}" onchange="mostrarOcultarCeldabidon(${fila.mov_id})"/>` // Checkbox para identificar el mov_id
                        ]).draw().node(); // Obtén el nodo del `tr` recién creado

                        $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción
                    });
                } else {
                    bidones.forEach(fila => {
                        let newRow = tablaBidones.row.add([
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
                            `<input type="checkbox" class="chk-mov-id" value="ch${fila.mov_id}" />` // Checkbox para identificar el mov_id
                        ]).draw().node(); // Obtén el nodo del `tr` recién creado

                        $(newRow).attr('id', 'row' + fila.mov_id); // Agregamos un id a cada tr para luego poder eliminarlo en caso de deshacer la acción
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
}

/*establecer en editable las celdas seleccionadas con el checkbox*/
function mostrarOcultarCeldabidon(mov_id) {
    // Verificamos si el checkbox está marcado o no
    let checkbox = $("input[value='" + mov_id + "']");

    if (checkbox.is(":checked")) {
        // Si el checkbox está marcado, mostramos el input oculto
        $("#code" + mov_id).show();
        $("#cant" + mov_id).show();

        // Movemos la fila a la parte superior de la tabla
        let table = tablaBidones;
        let $row = $('#row' + mov_id); // Accede al <tr> de la fila correspondiente

        let data = table.row($row).data(); // Captura los datos de la fila
        table.row($row).remove().draw(); // Remueve la fila
        table.row.add(data).draw(); // Añade de nuevo la fila con los mismos datos en la parte superior

    } else {
        // Si se desmarca, ocultamos el input
        $("#code" + mov_id).hide();
        $("#cant" + mov_id).hide();
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
    let ids = [];

    if (estado == "E") {
        // Recorre cada fila de la tabla y obtiene los mov_id de la columna en posición 0
        tablaBidones.rows().every(function () {
            let data = this.data();
            ids.push(data[0]);  // posición mov_id
        });
    } else if (estado == "R" || estado == "D") {
        // Recorre cada fila de la tabla y verifica si el checkbox está marcado
        tablaBidones.rows().every(function () {
            let $row = $(this.node()); // Accedemos al nodo de la fila
            let checkbox = $row.find('input[type="checkbox"]'); // Encontramos el checkbox en la columna 10

            // Verifica si el checkbox está marcado
            if (checkbox.is(':checked')) {
                let data = this.data();
                ids.push(data[0]);  // Agrega el mov_id (posición 0) al array si está marcado
            }
        });
    }

    if (ids.length > 0) {
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
                } else {
                    toastr.error(res.mensaje, "Error en la actualizaci&oacute;n");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error("Error en la solicitud: " + textStatus, "Error");
            }
        });
    } else {
        toastr.warning("No hay movimientos para actualizar", "Advertencia");
    }
}
