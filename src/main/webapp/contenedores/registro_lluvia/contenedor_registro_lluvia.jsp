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
                                    <input type="date" id="fecha" name="fecha" class="form-control form-control-sm text-center" onkeypress="if (event.key === 'Enter') {
                                                event.preventDefault();
                                                generar_grilla_registros_lluvias();
                                            }">
                                            <button id="btnBuscarFecha" class="btn btn-sm btn-primary ml-2" onclick="generar_grilla_registros_lluvias();" title="buscar">
                                        <i class="fas fa-search"></i>
                                    </button>
                                    <button id="btnBuscarFecha" class="btn btn-sm btn-success ml-2" onclick="ir_informe_registro_lluvias();" title="ir a informe por rango de fecha ">
                                        <i class="fas fa-file-alt"></i>
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
                <div class="row" style="display:none;">
                    <div class="col-12" id="div_registro_lluvia_export">


                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
