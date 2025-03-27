<%-- 
    Document   : contenedor_capacidades_predescarte
    Created on : 24 ene. , 10:47:53
    Author     : Administrador
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.sql.ResultSet"%>
<%@ page session="true" %>
<%@include  file="../../versiones.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>
<%    String version = "Test";
    String desc_version = "Test";
%>
<head>   
<label  ><b></b></label> 
<div class="float-right d-none d-sm-inline-block " href="#" data-toggle="modal" data-target=".bd-example-modal-xx" 
     onclick="cargar_datos_modal_version('<%=version%>', 'VERSION: <%=version%>', 'DESCRIPCION:<%=desc_version%>')">
    <label ><%=version%> </label>  
</div>
</head>
<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>REGISTROS DIARIOS DE LLUVIAS</b></center>
    </div>
</div>
<br>
<!--contenido--> 
<div class="row">
    <div class="col-12">
        <div class="card elevation-2">
            <div class="card-header">
                <h3 class="card-title">Registro diario de lluvias</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-4 col-xl-3 mx-auto">
                                <div class="form-group d-flex align-items-center">
                                    <label for="fecha" class="mr-2">Fecha</label>
                                    <input type="date" id="fecha" name="fecha" class="form-control form-control-sm text-center" onkeypress="if(event.key === 'Enter') { event.preventDefault(); generar_grilla_registros_lluvias(); }">
                                    <button id="btnBuscarFecha" class="btn btn-sm btn-primary ml-2" onclick="generar_grilla_registros_lluvias();">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12" id="div_registro_lluvia">

                  
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<!--modal duplicar capacidad aviario-->
<div class="modal fade" id="modal-form-capacidades" tabindex="-1" role="dialog" aria-labelledby="modal-form-capacidades" aria-hidden="true">
    <div class="modal-dialog modal-md" id="modal-dialog-capacidades" role="document">
        <form id="form-capacidades" autocomplete="off" action="#" method="POST">
            <div class="modal-content">
                <div class="modal-header bg-primary">
                    <h5 class="modal-title text-white" id="modal-form-title">Duplicar capacidades alojamiento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                        <span aria-hidden="true" class="text-white">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="anio_actual">Año actual</label>
                                <input type="text" name="anio_actual" id="anio_actual" class="form-control form-control-sm text-center" tabindex="-1" readonly>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="anio_destino">Año destino</label>
                                <input type="text" name="anio_destino" id="anio_destino" class="form-control form-control-sm text-center" tabindex="-1">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" tabindex="-1">Cerrar</button>
                    <button type="button" class="btn btn-sm btn-primary" id="btn-guardar-capacidades" onclick="duplicarCapacidadAnio();">Duplicar</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Modal alojamiento-->
<div class="modal fade" id="modalEditarCapacidades" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="modalTitle">Crear / Editar - Capacidades de Aves</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Cerrar">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-4 col-xl-2 mx-auto">
                                <div class="form-group">
                                    <label for="year_modal">Año</label>
                                    <input type="number" id="year_modal" name="year_modal" step="1" min="1990" class="form-control form-control-sm text-center" onchange='generarTablaEditarCapacidades(this.value)'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="table-responsive" id="div_tabla_capacidades_modal">
                            <table class="table table-striped table-bordered table-hover table-xs compact w-100" id="tablaCapacidades">
                                <thead class="thead-primary">
                                    <tr>
                                    <th>Mes</th>
                                    <th>Año</th>
                                    <th>Capacidad</th>
                                    <th>Alerta Amarilla</th>
                                    <th>Alerta Roja</th>
                                    <th>Venta Máxima</th>
                                    <th>Venta Mínima</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td>Enero</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="1" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="2" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="3" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="4" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="5" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Febrero</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="6" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="7" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="8" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="9" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="10" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Marzo</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="11" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="12" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="13" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="14" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="15" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Abril</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="16" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="17" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="18" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="19" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="20" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Mayo</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="21" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="22" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="23" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="24" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="25" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Junio</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="26" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="27" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="28" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="29" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="30" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Julio</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="31" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="32" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="33" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="34" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="35" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Agosto</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="36" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="37" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="38" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="39" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="40" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Setiembre</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="41" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="42" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="43" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="44" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="45" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Octubre</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="46" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="47" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="48" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="49" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="50" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Noviembre</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="51" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="52" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="53" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="54" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="55" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                    <tr>
                                    <td>Diciembre</td>
                                    <td></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="56" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="57" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="58" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="59" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    <td contenteditable="true" class="contenteditablepd" tabindex="60" onkeydown="navigateCellsCol5(event, this)" onfocus="selectValDet(this)" onblur="handleBlurAlojamiento(this)"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-success" onclick="guardarCapacidades()">Guardar Cambios</button>
            </div>
        </div>
    </div>
</div>