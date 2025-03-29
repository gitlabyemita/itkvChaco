

var ruta_consultas_prin = "./consultas/";
var ruta_contenedores_prin = "./contenedores/";
var ruta_cruds_prin = "./cruds/";

var ruta_contenedores_hp = "./contenedores/hp/";
var ruta_cruds_hp = "./cruds/hp/";
var ruta_grillas_hp = "./grillas/hp/";
var ruta_consultas_hp = "./consultas/hp/";


var ruta_contenedores_bal = "./contenedores/balanceado/";
var ruta_cruds_bal = "./cruds/balanceado/";
var ruta_grillas_bal = "./grillas/balanceado/";
var ruta_consultas_bal = "./consultas/balanceado/";

var ruta_contenedores_itkv = "./contenedores/itkv/";
var ruta_cruds_itkv = "./cruds/itkv/";
var ruta_grillas_itkv = "./grillas/itkv/";
var ruta_consultas_itkv = "./consultas/itkv/";



$(document).ready(function ()
{
    gen_menu();
    boton_atras();
    login_exito();
    cargar_load();
    cerrar_load();

});

function procesando_swal()
{
    Swal.fire({
        title: "PROCESANDO!",
        html: "<strong>ESPERE</strong>...",
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: !1,
        willOpen: () => {
            Swal.showLoading();
        },
    });
}

function boton_atras()
{
    window.onhashchange = function ()
    {
        switch (window.location.hash)
        {
            case "#embarque":
                ir_informe_embarque();
                li_active_menu("sub_rep_embarque");
                break;

            case "#traer_informe_factura":
                traer_informe_factura();
                li_active_menu("sub_embarque_reg");
                break;

            case "#pprGraficoAviariosDinamico":
                grafico_aviarios_dinamico_ppr();
                li_active_menu("sub_aviarios_dinamicos");
                break;

            case "#pprGraficoMortandad":
                grafico_mortandad_ppr();
                li_active_menu("sub_inf_bloques_aviarios");
                break;

            case "#pprGrillaHuevos":
                grilla_huevos_ppr();
                li_active_menu("sub_inf_cont_huevos_ppr");
                break;

            case "#pprMortandadLotes":
                llamar_mortandad_lotes_ppr();
                li_active_menu("sub_inf_mortandad_ppr");
                break;

            case "#pprConsumoBalanceadoBloque":
                informe_consumo_balanceado_bloque_ppr();
                li_active_menu("sub_inf_consumo_bal_ppr");
                break;

            case "#pprMortandad80Sms":
                llamar_mortandad_80_sems_ppr();
                li_active_menu("sub_inf_mor80sems");
                break;

            case "#pprDatosContadores":
                llamar_datos_contadores_ppr();
                li_active_menu("sub_inf_datos_contadores_huevos");
                break;

            case "#pprContadorHuevos":
                llamar_contador_huevos_ppr();
                li_active_menu("sub_inf_datos_contadores_huevos9");
                break;

            case "#pprAviarioFecha":
                traer_vista_contador_huevo2_ppr();
                li_active_menu("sub_inf_datos_contadores_huevos2");
                break;

            case "#ptcRegistroLib":
                traer_registro_lib();
                li_active_menu("sub_inf_ptc_reg_lib");
                break;

            case "#ptcRegistroRetenido":
                traer_registro_retenido();
                li_active_menu("sub_ptc_reg_ret");
                break;

            case "#ptcRegistroCarros":
                ir_registro_carros_alimentados();
                li_active_menu("sub_inf_ptc_reg_alimen");
                break;

            case "#ptcRegistroSC":
                traer_registro_SC();
                li_active_menu("sub_inf_ptc_reg_sc");
                break;

            case "#ptcPendientesRecogida":
                ir_pendientes_recogidas();
                li_active_menu("sub_ptc_pendientes_reco");
                break;

            case "#ptcTransformacionPallet":
                ir_transformacion_pallet_carro();
                li_active_menu("sub_ptc_pallet_a_carro");
                break;

            case "#ptcMovimiento":
                ir_movimiento();
                li_active_menu("sub_inf_ptc_movimiento");
                break;

            case "#ptcGrillaRetenido":
                traer_grilla_retenido();
                li_active_menu("sub_inf_ptc_cambio_dispoLib");
                break;

            case "#ptcFechaInvolucrada":
                traer_fecha_involucrada();
                li_active_menu("sub_inf_ptc_fecha_invo");
                break;

            case "#ptcEliminar":
                traer_eliminar();
                li_active_menu("sub_inf_ptc_eliminar");
                break;

            case "#ptcInfome":
                traer_informe();
                li_active_menu("sub_inf_ptc_visu_lotes");
                break;

            case "#ptcMotivoRetencion":
                ir_agregar_motivo_retencion();
                li_active_menu("sub_inf_ptc_motivo_retencion");
                break;

            case "#ptcConfiguracionEmp":
                ir_configuracion_empacadora();
                li_active_menu("sub_ptc_empacadoras_cambios");
                break;

            case "#ptcReporteLotes":
                traer_reporte_lotes();
                li_active_menu("sub_inf_ptc_rep_lotPTC");
                break;

            case "#ptcReporteMixtos":
                traer_reporte_mixtos_historial();
                li_active_menu("sub_inf_ptc_rep_lotmixt");
                break;

            case "#ptcReporteExcel":
                traer_reporte_ptc_excel();
                li_active_menu("sub_inf_ptc_rep_ptcExcel");
                break;

            case "#ptcReporteRotos":
                ir_reporte_rotos_mis();
                li_active_menu("sub_inf_ptc_rep_motivo_retencion");
                break;

            case "#misRegistro":
                traer_registro_mis();
                li_active_menu("sub_inf_mis_rep_rot_sub");
                break;

            case "#misCarroMesa":
                ir_carro_a_mesa();
                li_active_menu("sub_carro_mesa_mis");
                break;

            case "#misInforme":
                traer_informe_mis();
                li_active_menu("sub_inf_ptc_reg_mis");
                break;

            case "#misEliminar":
                traer_eliminar_mis();
                li_active_menu("sub_eliminar_mis");
                break;

            case "#misTransfeReprocesos":
                ir_transferencias_reprocesos_mis();
                li_active_menu("sub_transfer_mis_reprocesos");
                break;

            case "#misTransfeSuproductos":
                ir_transferencias_subproductos_mis();
                li_active_menu("sub_transfe_sub_mis");
                break;
            case "#misPendientesAlimen":
                ir_informe_pendientes_alimentacion_mis();
                li_active_menu("sub_pendiente_alimentar_mis");
                break;

            case "#misRegistroTradicional":
                ir_registro_reproceso_tradicional_mis();
                li_active_menu("sub_rep_tradici");
                break;

            case "#panelLiberadosViejos":
                ir_liberados_viejo();
                li_active_menu("contenedor_reg_ptc_panel_lib");
                break;

            case "#panelRegistroRetenidos":
                traer_registro_retenido_costeado();
                li_active_menu("contenedor_reg_ptc_panel_ret");
                break;

            case "#panelModifLotes":
                ir_modificacion_lotes_ptc();
                li_active_menu("contenedor_reg_ptc_panel_mod_prod_disp");
                break;

            case "#panelReporteHist":
                ir_reporte_historico_lotes_ptc();
                li_active_menu("sub_inf_ptc_historico");
                break;

            case "#panelCambioFp":
                ir_cambio_fp_ptc();
                li_active_menu("mod_ptc_fp");
                break;

            case "#panelTransformacionCarro":
                ir_transformacion_ptc();
                li_active_menu("mod_ptc_tipo_huevo");
                break;

            case "#panelCambioNro":
                ir_cambio_nro_ptc();
                li_active_menu("mod_ptc_nro_carro");
                break;

            case "#panelRegistroReproceso":
                ir_registro_tipo_reproceso_mis();
                li_active_menu("mod_mis_tipo_rep_subp_add");
                break;

            case "#SegRegistroUsuario":
                traer_vista_usuario_ppr();
                li_active_menu("sub_registrar_usuarios_seg");
                break;

            case "#pprUsuariosRegistrados":
                grilla_usuarios_ppr();
                li_active_menu("sub_seguridad_registrados_usuarios");
                break;

            case "#pprCrearRoles":
                traer_vista_roles_ppr();
                li_active_menu("sub_seguridad_crear_roles");
                break;

            case "#pprRolesRegistrados":
                cargar_grilla_roles_ppr();
                li_active_menu("sub_seguridad_list_roles3");
                break;

            case "#SegPermisosRoles":
                ir_permisos_roles();
                li_active_menu("sub_seg_permisos_reg");
                break;

            case "#cyoRegistroReproc":
                ir_registro_reprocesos_lista_ptc();
                li_active_menu("sub_alimentacion_registro");
                break;

            case "#pprMortandadMensual":
                traer_vista_mortandad_mensual_ppr();
                li_active_menu("sub_inf_mortandad_mensual_global");
                break;

            case "#pprRegistroNecropsias":
                traer_vista_registro_necropsias_ppr();
                li_active_menu("sub_inf_registro_necropsias");
                break;
                //window.location.hash = "";
        }
    };
}
function ir_permisos_roles()
{
    window.location.hash = "SegPermisosRoles";
    $.ajax({
        type: "POST",
        url: ruta_contenedores_prin + "vista_permisos.jsp",
        beforeSend: function (xhr) {
            cargar_load("Cargando...");
        },
        success: function (data)
        {
            $("#contenedor_principal").html("");
            $("#contenedor_principal").html(data);

            cargar_permisos_roles();
            cerrar_load();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
                location.reload();
            }
        }
    });

}

function recargar_pagina() {
    location.reload();

}
function cargar_permisos_roles()
{
    $.ajax({
        type: "POST",
        url: ruta_consultas_prin + 'consulta_permisos_roles.jsp',
        beforeSend: function (xhr) {

        },
        success: function (data)
        {
            $("#permisos").html("");
            $("#permisos").html(data.select);
            formato_multiselect();
            $('.dropdown-header').addClass('bg-navy');
            $('#form_add_permisos').on('submit', function (event)
            {
                event.preventDefault();
                registrar_agregar_permisos();
                event.stopPropagation();

            });



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
                location.reload();
            }
        }

    });

}

function obtener_permisos_habilitados_roles()
{
    $.ajax({
        type: "POST",
        url: ruta_consultas_prin + 'consulta_permisos_seleccionados.jsp',
        data: {id_rol: $('#roles').val()},
        beforeSend: function (xhr) {

        },
        success: function (data)
        {
            $('#permisos').selectpicker('val', '');
            $('#permisos').selectpicker('refresh');
            $('#permisos').val(data.selected.split(','));
            $('#permisos').selectpicker('refresh');
            $('.dropdown-header').addClass('bg-navy');

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
                location.reload();
            }
        }
    });

}

function registrar_agregar_permisos()
{
    Swal.fire({
        title: 'CONFIRMACION',
        text: "DESEA CREAR  NUEVO PERMISO?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#001F3F',
        cancelButtonColor: '#001F3F',
        confirmButtonText: 'SI, CREAR!',
        cancelButtonText: 'NO, CANCELAR!'}).then((result) =>
    {
        if (result.value)
        {

            $.ajax({
                type: 'POST',
                url: ruta_cruds_prin + "crud_agregar_permisos.jsp",
                data: $("#form_add_permisos").serialize(),
                beforeSend: function (xhr) {
                    procesando_swal();
                },
                success: function (data) {
                    aviso_generico(data.tipo, data.mensaje);

                }
            });
        }
    });
}

function aviso_error(mensaje)
{
    swal.fire
            ({
                type: 'error',
                title: mensaje,
                confirmButtonText: "CERRAR"
            });

}

function aviso_existencia(nro_carro)
{
    swal.fire({
        type: 'error',
        title: "CARRO NO EXISTE, " + nro_carro,
        confirmButtonText: "CERRAR"
    });
}

function aviso_duplicado()
{
    swal.fire({
        type: 'error',
        title: "CARRO DUPLICADO",
        confirmButtonText: "CERRAR"
    });
}
function aviso_registro_transfer(tipo, mensaje)
{

    if (tipo == "1")
    {
        swal.fire({
            type: 'success',
            title: mensaje,
            confirmButtonText: "CERRAR"

        });
        $("#contenedor_principal").html("");
    } else
    {
        swal.fire
                ({
                    type: 'error',
                    title: mensaje,
                    confirmButtonText: "CERRAR"
                });
    }
}
function login_exito()
{

    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
    });


    Toast.fire({
        icon: 'success',
        title: 'Sesi\u00F3n iniciada.'
    })


    /*
     Command: toastr["success"]("Sesion iniciada.")
     
     toastr.options = {
     "closeButton": true,
     "debug": false,
     "newestOnTop": false,
     "progressBar": false,
     "positionClass": "toast-bottom-left",
     "preventDuplicates": false,
     "showDuration": "300",
     "hideDuration": "1000",
     "timeOut": "5000",
     "extendedTimeOut": "1000",
     "showEasing": "swing",
     "hideEasing": "linear",
     "showMethod": "fadeIn",
     "hideMethod": "fadeOut"
     }*/
}

function gen_menu()
{
    var search = ' <div class="input-group" data-widget="sidebar-search">    \n\
                <input class="form-control form-control-sidebar" type="search" placeholder="Buscar" aria-label="Search">  \n\
                <div class="input-group-append"> <button class="btn btn-sidebar">   <i class="fas fa-search fa-fw"></i>   \n\
                </button>   </div>  </div>';
    $.ajax({
        url: ruta_consultas_prin + 'consulta_generar_menu.jsp',
        type: "post",
        success: function (data) {
            $('#ul_menu').html(data.menu);
            notificacion();
            $('#div_buscador').html(search);

        }});
}
function li_active_menu(id)
{
    $(".nav-link").removeClass("active");
    $("#" + id).addClass("active");
}

function cargar_load(texto)
{

    $('body').loadingModal('animation', 'wave');
    $('body').loadingModal('backgroundColor', '#001f3f');
    $('body').loadingModal('opacity', '0.8');

    $('body').loadingModal({text: texto});
    $('body').loadingModal('show');
}

function cerrar_load()
{
    $('body').loadingModal("hide");
    $('#body').loadingModal("hide");
}

function cerrar_sidebar()
{
    $('#body').removeClass();
    $('#body').addClass("text-sm layout-footer-fixed layout-navbar-fixed sidebar-mini layout-fixed sidebar-closed sidebar-collapse");
}

function aviso_generico(tipo, mensaje)
{
    if (tipo == 1)
    {
        Swal.fire(mensaje, '', 'success');//


    } else {
        Swal.fire(mensaje, '', 'error');//

    }
}

function formato_multiselect()
{
    $('.selectpicker').selectpicker({selectAllText: "Seleccionar todo",
        deselectAllText: "Deseleccionar todo", noneSelectedText: "Nada seleccionado",
        noneResultsText: "No se encontraron resultados"});
}

function cargar_estilo_calendario_insert(format)
{

    $('.datepicker').pickadate({
        // Escape any “rule” characters with an exclamation mark (!).
        format: format,
        formatSubmit: format,
        hiddenPrefix: 'prefix__',
        hiddenSuffix: '__suffix',
        cancel: 'Cancelar',
        clear: 'Limpiar',
        done: 'Ok',
        today: 'Hoy',
        close: 'Cerrar',
        max: true,
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        weekdaysShort: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
    });

}



function cargar_estilo_calendario_global(format, max)
{

    $('.datepicker').pickadate({
        // Escape any “rule” characters with an exclamation mark (!).
        format: format,
        formatSubmit: format,
        hiddenPrefix: 'prefix__',
        hiddenSuffix: '__suffix',
        cancel: 'Cancelar',
        clear: 'Limpiar',
        done: 'Ok',
        today: 'Hoy',
        close: 'Cerrar',
        max: max,
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        weekdaysShort: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
    });

}


function elminar_fila()
{
    $(document).on('click', '.borrar', function (event) {
        event.preventDefault();
        $(this).closest('tr').remove();
    });
}

function notificacion()
{
    $.get('consultas/ptc/consulta_pendientes_retenidos.jsp', function (res) {

        $("#notificacion").append(res.fecha_vieja_retenido + " " + res.fecha_vieja);
        $("#contador_notificacion").html(res.cantidad);


    });
}

function formato_hora_input()
{
    $('.inputmask').inputmask(
            "hh:mm", {
                placeholder: "hh:mm",
                insertMode: false,
                showMaskOnHover: false,
                hourFormat: "24"
            }
    );
}

function cargar_datos_modal_version(ribbon, titulo, descripcion, pdf, manual_bolean)
{
    $("#ribbon_version").html(ribbon);
    $("#ribbon_titulo").html(titulo);
    $("#form_pdf_manual").attr("href", "./manuales/" + pdf);


    $("#form_pdf_manual").hide();
    $("#ribbon_descripcion").html("");
    $("#ribbon_descripcion").html(descripcion.replaceAll("&", "<br>"));

    if (manual_bolean)
    {
        $("#form_pdf_manual").show();
    }

}

function activar_datatable(variable) {
    $(variable).DataTable
            ({
                paging: false,
                // "ordering": false,
                "language":
                        {
                            "sUrl": "js/Spanish.txt"
                        },
                scrollX: true,
            });
}
function ir_pagina_generico(ruta, pagina, hash, calendario_formato, max_calendario, datatable) {
    window.location.hash = hash;
    var cal = calendario_formato;
    var dat = datatable;
    $.ajax({
        type: "POST",
        url: ruta + pagina,
        beforeSend: function ()
        {
            cargar_load();
            $("#contenedor_principal").html("");
        },
        success: function (res)
        {
            $("#contenedor_principal").html(res);

            if (cal !== "FALSE")
            {
                cargar_estilo_calendario_global(calendario_formato, max_calendario);
            }

            if (dat !== "FALSE")
            {
                $(datatable).DataTable({
                    paging: false,
                    "ordering": false,
                    "language":
                            {
                                "sUrl": "js/Spanish.txt"
                            }
                });
            }

            cerrar_load();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
                recargar_pagina();
            }
        }
    });
}

function selectValDet(el) {
    // Función para seleccionar el contenido del elemento cuando recibe el foco
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}