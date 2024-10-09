<%-- 
    Document   : contenedor_informe_bidones
    Created on : 9 sept. 2024, 07:53:46
    Author     : Administrador
--%>

<%@page import="java.sql.ResultSet"%>
<%@ page session="true" %>
<%@include  file="../../versiones.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>

<%  String version = "Test";
    String desc_version = "Test";
    ResultSet rsTM;
    Statement st = connection.createStatement();
    String query = "select * FROM [dbo].[cmb_tipo_movimiento]";
    rsTM = st.executeQuery(query);
%>

<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>INFORME MOVIMIENTOS BIDONES</b></center>
    </div>
</div> 
<br>
<div class="col-12">
    <div class="col-12 col-md-12 col-lg-12">

        <div class="card elevation-2">

            <div class="card-header bg-primary">
                <h3 class="card-title">ESTADO REPORTE</h3>
            </div>
            <div class="card-body" id="card-body-mov">
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="tipo_mov">Estado Movimientos Bidones</label>
                            <select id="tipo_mov" name="tipo_mov" class="form-control form-control-sm selectpicker">
                                <option value="">Seleccione tipo de movimiento</option>                                                             
                                <option value="3" estado="P">PENDIENTE</option>                                                             
                                <% while (rsTM.next()) {
                                        String tmov_id = rsTM.getString("tmov_id");
                                        String estado = tmov_id.equals("1") ? "E"
                                                : tmov_id.equals("2") ? "R"
                                                : tmov_id.equals("4") ? "D" : "";
                                %>
                                <option value="<%= tmov_id%>" estado="<%= estado%>" name="<%= rsTM.getString("tmov_name")%>">
                                    <%= rsTM.getString("tmov_name")%>
                                </option>
                                <% }%>

                            </select>
                        </div>
                    </div>
                </div>
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
                                        <button id="btnGenRepBidon" disabled class="btn btn-warning btn-lg elevation-2 form-control" onclick="generarReporteBidones();">
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
    </div>
    <div class="col-12 col-md-12 col-lg-12" id="div_cont_inf_bidones" style="display:none;" >

        <div class="card elevation-2">

            <div class="card-header bg-primary">
                <h3 class="card-title" id="card-title-detalle">MOVIMIENTOS BIDONES</h3>
            </div>
            <div class="card-body" id="card-body-mov">
                <div class="row">
                    <div class="col-12 table-responsive" id="div-tb-informe-bidones">
                        <table class="hover table table-xs compact w-100 table-striped table-bordered" id="tabla-informe-bidones" style="width: 100%">
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">ID_MOV</th>
                                    <th class="text-center">COD_BARRA</th>
                                    <th class="text-center">COD_BARRA REASIG</th>
                                    <th class="text-center">NOMBRE</th>
                                    <th class="text-center">PRESENTACIÓN</th>
                                    <th class="text-center">O.T.</th>
                                    <th class="text-center">RESPONSABLE</th>
                                    <th class="text-center">F_ESTIMADA_DEV</th>
                                    <th class="text-center">F_ENTREGA</th>
                                    <th class="text-center">F_DEVOLUCIÓN</th>
                                    <th class="text-center">F_DESTRUCCIÓN</th>
                                    <th class="text-center">CANT. ENTREGADA</th>
                                    <th class="text-center">CANT. RECIBIDA</th>
                                </tr>
                            </thead>
                            <tbody class="text-center">
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </tfoot>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
