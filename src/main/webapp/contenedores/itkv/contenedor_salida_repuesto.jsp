<%-- 
   Document   : contenedor_registro_reprocesos
   Created on : 15-dic-2021, 9:51:44
   Author     : hvelazquez
--%>
 <%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="org.jfree.data.general.Dataset"%>
<%@include  file="../../versiones.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 

<%    PreparedStatement ps, ps2, ps3, ps4, ps5, ps6,ps7;
    ResultSet rs, rsActivo, rsUbicacion, rsActividad, rsRubro, rs6,rsRepuesto;
    try {
        ps = connection.prepareStatement(" SELECT DISTINCT T0.[U_retiradopor] as U_retiradopor              FROM    IGE1 T0");// 3
        rs = ps.executeQuery();

        ps2 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName],  T0.[DimCode] , T0.[U_CodAnt], T0.[U_Comen] FROM    OPRC T0 WHERE T0.[DimCode] = 4 ");// 3
        rsActivo = ps2.executeQuery();

        ps3 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] = 3 ");// UBICACION
        rsUbicacion = ps3.executeQuery();

        ps4 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] = 2 ");// RUBRO
        rsActividad = ps4.executeQuery();

        ps5 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] =  1");// ACTIVIDAD
        rsRubro = ps5.executeQuery();
        
        ps6 = connection.prepareStatement(" SELECT T0.[WhsCode], T0.[WhsName]                               FROM    OWHS T0 WHERE T0.[WhsCode]  like 'TAN%%'OR  T0.[WhsCode]  = 'DEP_GEN'OR  T0.[WhsCode]  = 'DEP_TAL' ");// ACTIVIDAD
        rs6 = ps6.executeQuery();
 

        ps7 = connection.prepareStatement(" SELECT ItemCode , ItemName  , ItmsGrpCod , OnHand , InvntryUom  FROM  oitm	 where    QryGroup3='Y'   ");// ACTIVIDAD
        rsRepuesto = ps7.executeQuery();
  
    
%>
<style>
    tr:hover {color:#ffffff ; background-color: #001940;}
</style>
<head>   
<label  ><b></b></label> 
<div class="float-right d-none d-sm-inline-block" >
      <a href="manuales/Salida_repuestos.pdf" target="_blank">Manual de usuario</a>
</div></head><!-- comment -->
<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>REGISTRO DE SALIDA DE REPUESTOS</b></center>
    </div>
</div> 

<form id="form_add_consumo" method="post" >


    <br>
    <strong ><a>Responsable</a></strong>
    
    <select class="form-control selectpicker" id="retirado_por_select" onchange="insert_valor_responsable_combo_itkv()"  data-live-search="true">
    <option value="">Seleccione</option>    
        <%  while (rs.next()) {%>
        <option><%=rs.getString("U_retiradopor")%></option>    
        <% }%>
        <option>OTROS</option>    
    </select>
     <input type="text" class="form-control " placeholder="INGRESE NOMBRE" value=""   id="retirado_por" style="display: none">
        
   
        <strong><a>Ubicacion</a></strong>
    <select class="form-control selectpicker " data-live-search="true" id="ubicacion">
        <%  while (rsUbicacion.next()) 
        {%>
        <option value="<%=rsUbicacion.getString("PrcCODE")%>" desc="<%=rsUbicacion.getString("PrcName")%>" > 
            <%=rsUbicacion.getString("PrcName")%>
        </option>    
        <% }%>
    </select>    
    <strong ><a>Activo</a></strong>
    <select class="form-control selectpicker"data-live-search="true" id="activo_select" onchange="insert_valor_responsable_combo_itkv()">
        <%  while (rsActivo.next()) {%>
        <option value="<%=rsActivo.getString("PrcCODE")%>" desc="<%=rsActivo.getString("PrcName")%>" >
            <%=rsActivo.getString("PrcName")%>
        </option>    
        <% }%>
        <option value="OTROS">OTROS</option>    
    </select> 
    <input type="text" class="form-control "  code="AC-0000" value="ACTIVO GENÉRICO"    placeholder="INGRESE NOMBRE" required id="activo" style="display: none">
      
      
 
    <strong ><a>Actividad</a></strong>
    <select class="form-control" id="actividad">
        <%  while (rsActividad.next()) {%>
        <option value="<%=rsActividad.getString("PrcCODE")%>" desc="<%=rsActividad.getString("PrcName")%>"><%=rsActividad.getString("PrcName")%></option>    
        <% }%>
    </select> 

    <strong ><a>Rubro</a></strong>
    <select class="form-control" id="rubro">
        <%  while (rsRubro.next()) {%>
        <option value="<%=rsRubro.getString("PrcCODE")%>" desc="<%=rsRubro.getString("PrcName")%>"><%=rsRubro.getString("PrcName")%></option>    
        <% }%>
    </select> 
    
    <strong><a>Horómetro</a></strong>
    <input type='number'  id='horometro' name='horometro' class='form-control'>    
  

    
    <table   class="table table-striped table-bordered"  >
            <thead>
                <tr>
                    <th >  <strong ><a>Item</a></strong>
    <select class="form-control selectpicker" data-live-search="true"  id="item">
        <%  while (rsRepuesto.next()) {%>
        <option value="<%=rsRepuesto.getString("itemcode")%>" desc="<%=rsRepuesto.getString("itemname")%>"><%=rsRepuesto.getString("itemname")%></option>    
        <% }%>
    </select></th>
    <th><input type="number"  class=" form-control"  id="cantidad" placeholder="Ingrese cantidad"></th>
    <th> <input type="button" value="Agregar item" class=" form-control  bg-navy" onclick="cargar_grilla_salida_repuesto();"></th>
                  </tr>
            </thead>
            
        </table>    
    
    
    
    
<table id="tabla" class="table table-striped table-bordered"  style='width:100%' >
            <thead>
                <tr>
                    <th >CODIGO</th>
                    <th>ARTICULO</th>
                    <th>CANTIDAD</th>
                    <th>ACCION</th>
                 </tr>
            </thead>
            <tbody id="tbody_tabla">

            </tbody>
        </table>    

    <div class="modal-footer align-right " >
        <input  class="btn bg-danger"  type="submit"   value="REGISTRAR" > 
         
 

    </div>
</form>
 
<%
    } catch (Exception e) {
        out.print(e.getMessage());
    } finally {
        connection.close();
    }%>