<%-- 
   Document   : contenedor_registro_reprocesos
   Created on : 15-dic-2021, 9:51:44
   Author     : hvelazquez
--%>
<%@page import="java.text.DecimalFormat"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="org.jfree.data.general.Dataset"%>
<%@include  file="../../versiones.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 

<%    PreparedStatement ps, ps2, ps3, ps4, ps5, ps6, ps7;
    ResultSet rsResponsable, rsActivo, rsUbicacion, rsActividad, rsRubro, rsBocaExpendio, rs7;
    try {

        ps = connection.prepareStatement(" SELECT DISTINCT T0.[U_retiradopor]  collate database_default   as U_retiradopor             FROM    IGE1 T0    union all    select nombre  as U_retiradopor from 	  itkv_personales  ");// 3
        rsResponsable = ps.executeQuery();

        ps2 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName],  T0.[DimCode] , T0.[U_CodAnt], T0.[U_Comen] FROM    OPRC T0 WHERE T0.[DimCode] = 4 AND Locked = 'N'  order by 1 ");// 3
        rsActivo = ps2.executeQuery();

        ps3 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] = 3 ");// UBICACION
        rsUbicacion = ps3.executeQuery();

        ps4 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] = 2 ");// ACTIVIDAD
        rsActividad = ps4.executeQuery();

        ps5 = connection.prepareStatement(" SELECT T0.[PrcCode], T0.[PrcName], T0.[U_CodAnt], T0.[U_Comen]  FROM    OPRC T0 WHERE T0.[DimCode] =  1");// RUBRO
        rsRubro = ps5.executeQuery();

        ps6 = connection.prepareStatement(" SELECT T0.[WhsCode], T0.[WhsName]                               FROM    OWHS T0 WHERE T0.[WhsCode]  like 'TAN%%'OR  T0.[WhsCode]  = 'DEP_GEN'OR  T0.[WhsCode]  like '%DEP_TAL%' ");// ACTIVIDAD
        rsBocaExpendio = ps6.executeQuery();

        ps7 = connection.prepareStatement("select max(lt_fin) as fin from itkv_salida1 WHERE ID_boca='DEP_TAL' ");// ACTIVIDAD
        rs7 = ps7.executeQuery();

        String lt_fin = "";

        while (rs7.next()) {
            lt_fin = rs7.getString("fin");
        }
%>
<style>
    tr:hover {
        color:#ffffff ;
        background-color: #001940;
    }
</style>
<head>   
<label  ><b></b></label> 
<div class="float-right d-none d-sm-inline-block" >
    <a href="manuales/Consumo_combustible.pdf" target="_blank">Manual de usuario</a>
</div>
</head><!-- comment -->
<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>REGISTRO DE CONSUMO DE COMBUSTIBLE</b></center>
    </div>
</div> 

<form id="form_add_consumo" method="post" class="  bg-black"  >
    <input type="checkbox"  class="checkbox"  data-toggle="toggle" data-on="SUGRAL"   data-off="ITA KAAVO" id="check"    data-onstyle="danger" data-offstyle="success">
    <input id="band"       value="ITA KAAVO"  type="hidden"/>

    <br>
 
    <strong ><a>Tanque lleno</a></strong>

    <select class="form-control "  id="tanqueLleno"  >
        <option value="">Seleccione tanque lleno</option>    
        <option value="SI">Si</option>    
        <option value="NO">No</option>    
    </select>


    <strong ><a>Responsable</a></strong>

    <select class="form-control selectpicker" data-live-search="true"  required id="retirado_por_select" onchange="insert_valor_responsable_combo_itkv()">
        <option value="">Seleccione</option>    
        <%  while (rsResponsable.next()) {%>
        <option><%=rsResponsable.getString("U_retiradopor")%></option>    
        <% }%>
        <option>OTROS</option>    
    </select>
        <input type="text" class="form-control " placeholder="INGRESE NOMBRE" value="" required   id="retirado_por" style="display: none">


    <strong><a>Ubicacion</a></strong>
    <select class="form-control selectpicker " data-live-search="true" id="ubicacion">
        <%  while (rsUbicacion.next()) {%>
        <option value="<%=rsUbicacion.getString("PrcCODE")%>" desc="<%=rsUbicacion.getString("PrcName")%>" > 
            <%=rsUbicacion.getString("PrcName")%>
        </option>    
        <% }%>
    </select>     

    <strong ><a>Activo</a></strong>
    <select class="form-control selectpicker"data-live-search="true"  required id="activo_select" onchange="insert_valor_responsable_combo_itkv()">
        <option value=""   >Seleccione Activo</option>
        <%  while (rsActivo.next()) {%>
        <option value="<%=rsActivo.getString("PrcCODE")%>" desc="<%=rsActivo.getString("PrcName")%>" >
            <%=rsActivo.getString("PrcCODE")%>-<%=rsActivo.getString("PrcName")%>
        </option>    
        <% }%>
        <option value="OTROS">OTROS</option>    
    </select> 
    <input type="text" class="form-control "  code="AC-0000" value="ACTIVO GENÉRICO"    placeholder="INGRESE NOMBRE" required id="activo" style="display: none">


    <div  style="display: none">   
        <strong ><a>Tipo combustible</a></strong>
        <select class="form-control"    id="tipo_combus">

            <option value="COMB-0014" desc="Gasoil comun" >
                Gasoil comun
            </option>    

        </select>  


    </div>
    <strong ><a>Actividad</a></strong>
    <select class="form-control" id="rubro">
        <%  while (rsActividad.next()) {%>
        <option value="<%=rsActividad.getString("PrcCODE")%>" desc="<%=rsActividad.getString("PrcName")%>"><%=rsActividad.getString("PrcName")%></option>    
        <% }%>
    </select> 

    <strong ><a>Rubro</a></strong><!-- RUBRO SE CONFUNDIÓ POR ACTIVIDAD, por eso el id de rubro es id="actividad" -->
    <select class="form-control" id="actividad">
        <%  while (rsRubro.next()) {%>
        <option value="<%=rsRubro.getString("PrcCODE")%>" desc="<%=rsRubro.getString("PrcName")%>"><%=rsRubro.getString("PrcName")%></option>    
        <% }%>
    </select> 



    <strong ><a>Km/Ho</a></strong>
    <input type="text" class="form-control autoNumeric" placeholder="Ingrese Km/Ho" required id="km_ho">
    <br>
    <br>
    <br>
    <strong ><a>Boca de expendio</a></strong>
    <select class="form-control" id="boca" onchange="get_ultimo_litro_boca_combustible_itkv()">
        <%  while (rsBocaExpendio.next()) {%>
        <option value="<%=rsBocaExpendio.getString("WhsCode")%>" desc="<%=rsBocaExpendio.getString("WhsName")%>" > 
            <%=rsBocaExpendio.getString("WhsName")%>
        </option>    
        <% }%>
    </select>                   
    <strong ><a>Litros inicio</a></strong>
    <input type="text" class="form-control autoNumeric" value="<%=lt_fin%>" placeholder="Ingrese litros inicio"   required id="lt_inicio" onchange="calcular_litros_itkv()">
    <strong ><a>Litros final</a></strong>
    <input type="text" class="form-control autoNumeric" placeholder="Ingrese litros final"   required id="lt_fin" onchange="calcular_litros_itkv()">
    <strong ><a>Litros cargados</a></strong>
    <input type="text" class="form-control autoNumeric" placeholder="Ingrese litros cargados" readonly="true" required id="lt_total">
    <br><br>
    <input class="form-control"  required type="file" id="imagenInput">


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