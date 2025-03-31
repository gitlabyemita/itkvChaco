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
        <center><b>INFORME REGISTROS DIARIOS DE LLUVIAS</b></center>
    </div>
</div>
<br>
<!--contenido--> 
<div class="row">
    <div class="col-12">
        <div class="card elevation-2">
            <div class="card-header bg-primary">
                <h3 class="card-title">REPORTE</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="desde">Desde: </label>
                                    <input type="text" id="desde" name="desde" class="datepicker form-control" placeholder="Seleccione fecha desde">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="hasta">Hasta: </label>
                                    <input type="text" id="hasta" name="hasta" class="datepicker form-control" placeholder="Seleccione fecha hasta">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-12 col-md-6 mx-auto">
                                            <div class="form-group">
                                                <!-- Botón agregar bidon -->
                                                <button id="btnGenRepLluvia" class="btn btn-warning btn-lg elevation-2 form-control" onclick="traer_grilla_informe_registro_lluvias();">
                                                    GENERAR REPORTE
                                                </button>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12" id="div_informe_registro_lluvia">


                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
