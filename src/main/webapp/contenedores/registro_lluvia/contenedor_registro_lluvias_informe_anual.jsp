<%-- 
    Document   : contenedor_registro_lluvias_informe_anual
    Created on : 1 abr. 2025, 06:38:13
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
        <center><b>REGISTROS DIARIOS DE LLUVIAS - INFORME ANUAL</b></center>
    </div>
</div>
<br>
<div class="row">
    <div class="col-12">
        <div class="card elevation-2">
            <div class="card-header bg-primary">
                <h3 class="card-title">Registro diario de lluvias - Informe anual</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-4 col-xl-2 mx-auto">
                                <div class="form-group">
                                    <label for="year">Año</label>
                                    <input type="number" id="anio" name="anio" step="1" min="1990" class="form-control form-control-sm text-center" onchange='traer_grilla_informe_registro_lluvias_anual()'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 table-responsive" id="div_informe_anual_registro_lluvias">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
