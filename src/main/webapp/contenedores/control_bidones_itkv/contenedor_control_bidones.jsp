<%-- 
    Document   : contenedor_control_bidones
    Created on : 16 ago. 2024, 16:54:20
    Author     : Administrador
--%>

<%@page import="java.sql.ResultSet"%>
<%@ page session="true" %>
<%@include  file="../../versiones.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>

<%  String version = "Test";
    String desc_version = "Test";
    ResultSet rsTM, rsRes, rsResE,rsArt;
    Statement st = connection.createStatement();
    Statement st1 = connection.createStatement();
    Statement st3 = connection.createStatement();
    Statement st4 = connection.createStatement();
    String query = "select * FROM [dbo].[cmb_tipo_movimiento]";
    String query2 = "select * from itkv_personales";
    String query3 = "select * from OITM where QryGroup5= 'Y'";
    rsTM = st.executeQuery(query);
    rsRes = st1.executeQuery(query2);
    rsArt = st3.executeQuery(query3);
    rsResE = st4.executeQuery(query2);
%>

<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>CONTROL MOVIMIENTOS BIDONES</b></center>
    </div>
</div> 
<br>
<div class="col-12">
    <div class="col-12 col-md-12 col-lg-12">

        <div class="card elevation-2">

            <div class="card-header bg-primary">
                <h3 class="card-title">REGISTRO DE MOVIMIENTO</h3>
            </div>
            <div class="card-body" id="card-body-mov">
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="tipo_mov">Tipo Movimiento</label>
                            <select id="tipo_mov" name="tipo_mov" class="form-control form-control-sm selectpicker" onchange="optionTipoMov(this.value)">
                                <option value="">Seleccione tipo de movimiento</option>                                                             
                                <% while (rsTM.next()) {
                                        String tmov_id = rsTM.getString("tmov_id");
                                        String estado = tmov_id.equals("1") ? "E"
                                                : tmov_id.equals("2") ? "R"
                                                : tmov_id.equals("4") ? "D" : "";
                                %>
                                <option value="<%= tmov_id%>" estado="<%= estado%>" name="<%= rsTM.getString("tmov_name")%>">
                                    <%= rsTM.getString("tmov_name")%>
                                </option>
                                <% } %>

                            </select>
                        </div>
                    </div>
                </div>
                <div class="row" id="row_responsable" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="responsable">Responsable</label>
                            <select id="responsable" name="responsable" class="form-control selectpicker form-control-sm" data-live-search="true" onchange="manejoResponablesBidones(this.value)">
                                <option value="">Seleccione responsable</option>                                                              
                                <%while (rsRes.next()) {%>
                                <option value="<%=rsRes.getString("id")%>" name="<%=rsRes.getString("nombre")%>"><%=rsRes.getString("nombre")%></option>                              
                                <%}%>
                                <option>OTROS</option>
                            </select>
                            <br>
                            <input type="text" class="form-control " placeholder="Ingrese nombre del nuevo responsable" value="" required   id="responsable_por" style="display: none" onkeypress="return crearNuevoResponsableItkv(this.value)">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_responsable_entrega" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="resp_entrega">Responsable a entregar</label>
                            <select id="resp_entrega" name="resp_entrega" class="form-control selectpicker form-control-sm" data-live-search="true" onchange="manejoResponablesReciclaje()">
                                <option value="">Seleccione responsable a entregar</option>                                                              
                                <%while (rsResE.next()) {%>
                                <option value="<%=rsResE.getString("id")%>" name="<%=rsResE.getString("nombre")%>"><%=rsResE.getString("nombre")%></option>                              
                                <%}%>
                                <option>OTROS</option>
                            </select>
                            <br>
                            <input type="text" class="form-control " placeholder="Ingrese nombre del nuevo responsable" value="" required   id="responsable_por_entrega" style="display: none" onkeypress="return crearNuevoResponsableItkv(this.value)">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_ot" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="ot">Orden de Trabajo</label>
                            <input id="ot" name="ot" class="form-control form-control-sm" placeholder="Ingresar nro. O.T.">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_devolucion" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="dev_estimada">Devolución estimada</label>
                            <input type="text" id="dev_estimada" name="dev_estimada" class="datepicker form-control">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_articulo" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="articulo">Artículo</label>
                            <select id="articulo" name="articulo" data-live-search="true" class="form-control form-control-sm selectpicker" onchange="handleArticuloChange(this)">   
                                <option value="">Seleccione artículo</option>                              
                                <%while (rsArt.next()) {%>
                                <option value="<%=rsArt.getString("ItemCode")%>" name="<%=rsArt.getString("ItemName")%>" pres_unica="<%=rsArt.getString("U_pres_unica")%>" lote_content="<%=rsArt.getString("ManBtchNum")%>" factor_multip="<%=rsArt.getString("NumInCnt")%>" name_factor_multip="<%=rsArt.getString("CntUnitMsr")%>"><%=rsArt.getString("ItemCode")%> - <%=rsArt.getString("ItemName")%></option>             
                                <%}%>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row" id="row_lote" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="lote">Lote</label>
                            <select id="lote" name="lote" data-live-search="true" class="form-control form-control-sm selectpicker">   
                                <option value="">Seleccione previamente un artículo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row" id="row_presentacion" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="pres">Presentación</label>
                            <select id="pres" name="pres" class="form-control form-control-sm selectpicker">          
                                <option value="">Seleccione previamente un artículo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row" >
                    <div class="col-12 col-md-6">                        
                        <div class="form-group">
                            <!--                            <label for="cant">Cantidad</label>-->
                            <input type="hidden" name="cant" id="cant" class="form-control form-control-sm text-center">
                        </div>
                    </div>
                    <div class="col-12 col-md-6">                        
                        <div class="form-group">
                            <!--<label for="bidon">Bidones</label>-->
                            <input type="hidden" name="bidon" id="bidon" class="form-control form-control-sm text-center">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_cant_unit" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="cant_unit">Cantidad unitaria</label>
                            <input type="number" id="cant_unit" name="cant_unit" class="form-control form-control-sm" placeholder="Ingresar cantidad unitaria">
                        </div>
                    </div>
                </div>
                <div class="row" id="row_codebar" style="display: none">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="cod_barra">Código de barra</label>
                            <input id="cod_barra" name="cod_barra" class="form-control form-control-sm" placeholder="Ingresar cod. barra" onkeypress="return escanCodBarraBidon()">
                        </div>
                    </div>
                </div>
                <hr>
                <div class="row" id="row_agregar" style="display: none">
                    <div class="col-12 col-md-6 mx-auto">
                        <div class="form-group">
                            <!-- Botón agregar bidon -->
                            <button id="btnAgregarBidon" class="btn btn-primary btn-lg elevation-2 form-control" onclick="agregarBidonGrilla();">
                                <i class="fa-solid fa-plus"></i> AGREGAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-12" id="content_tb_bidones" style="display: none">
        <div class="card elevation-2">
            <div class="card-header bg-primary">
                <h3 class="card-title">DETALLE DE MOVIMIENTO</h3>
            </div>
            <div class="card-body">
                <div id="div_grilla_bidones" class="table-responsive">
                    <table class="hover table table-xs compact w-100 table-striped table-bordered" id="tabla-bidones">
                        <thead>
                            <tr>
                                <th class="text-center" width="80">#</th>
                                <th class="text-center" width="80">ID_MOV</th>
                                <th class="text-center" width="80">COD_BARRA</th>
                                <th class="text-center" width="80">COD_BARRA REASIG</th>
                                <th class="text-center" width="80">NOMBRE</th>
                                <th class="text-center" width="80">PRESENTACION</th>
                                <th class="text-center" width="60">O.T.</th>
                                <th class="text-center" width="60">RESPONSABLE</th>
                                <th class="text-center" width="60">F_DEVOLUCION</th>
                                <th class="text-center" width="60">CANT. ENTREGADA</th>
                                <th class="text-center" width="60">CANT. RECIBIDA</th>
                                <th class="text-center" width="60">ACCIÓN</th>
                            </tr>
                        </thead>
                        <tbody class="text-center">
                        </tbody>
                    </table>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6 mx-auto">
                        <div class="form-group">
                            <!-- Botón agregar bidon -->
                            <button id="btnConfirBidon" class="btn btn-danger btn-lg elevation-2 form-control" disabled onclick="confirmarMovBidon();">
                                <i class="fa-solid fa-circle-check"></i> CONFIRMAR
                            </button>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    </div>
</div>
