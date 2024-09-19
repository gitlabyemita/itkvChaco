<%@page import="java.text.DecimalFormat"%>
<%@page import="clases.controles"%>
<%@page import="clases.variables"%>
<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page contentType="application/json; charset=utf-8" %>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 
<%    JSONObject ob = new JSONObject();
     try 
     {
        String      fecha   = request.getParameter("fecha");
        Statement   st      = connection.createStatement(); 
        ResultSet   rs; 
        String tr="";
        rs = st.executeQuery(" select * from itkv_salida1 where TIPO_registro IN ('CONSUMO', 'CONSUMO ANDROID APP','TRANSFERENCIA') AND convert(date,fecha)='"+fecha+"' order by 1 desc  ");
        
         String   cabecera = " <table id='grilla' class=' table-bordered compact hover' style='width:100%'>"
                + "<thead>"
                + "<tr>"
                 + "   <th>Nro.                     </th>"
                   + " <th>Responsable        </th>"
                   + " <th>Activo   </th>"
                   + " <th>Km/Ho</th>"
                   + " <th>Boca de expendio</th>"
                   + " <th>Litros inicio</th>"
                   + " <th>Litros fin</th>"
                   + " <th>Tipo documento</th>"
                   + " <th>Ubicacion</th>"
                   + " <th></th>"
                   + " <th></th>"
                
                + "</tr>"
             
                + " </thead> "
                + " <tbody >";
        
        while (rs.next()) 
        {
            String archivo="";
            String color="";
            
            if(rs.getString("tipo_registro").equals("TRANSFERENCIA") ){
                archivo="traslado_combustible";
                color="warning";
            }
            else {
                archivo="salida_combustible";
                color="danger";
            }
            tr = tr
            + " <tr>"
            +"      <td>"+rs.getString("id")            +"</td>" 
            +"      <td>"+rs.getString("responsable")   +"</td>" 
            +"      <td>"+rs.getString("desc_activo")   +"</td>" 
            +"      <td>"+rs.getString("km_ho")         +"</td>" 
            +"      <td>"+rs.getString("desc_boca")     +"</td>" 
            +"      <td>"+rs.getString("lt_inicio")     +"</td>" 
            +"      <td>"+rs.getString("lt_fin")        +"</td>" 
            +"      <td>"+rs.getString("tipo_registro")        +"</td>" 
            +"      <td>"+rs.getString("ubicacion")        +"</td>" 
            +"  <td>"
            + " <div>"
            + " <form action=\"cruds/itkv/control_reporte_consumo_combustible.jsp\" target=\"blank\"><input type=\"submit\" value=\"Reporte\" class=\"form-control bg-"+color+"\"> <input type='hidden' value='"+archivo+"' name='archivo'> <input type=\"hidden\" id=\"id\" name=\"id\" value=\""+rs.getString("id")+"\"></form>  </td>"               
            + "</td>"  
            + "<td><input type='button' value='Ver' class='form-control bg-success' onclick='cuadroImagenItkv("+rs.getString("id")+")' ></td>  "
            + " </tr>";
        }
        
         
     /*    String cabecera = "   "
             + "<table id='grilla'  class='tabla tabla-con-borde table-striped table-condensed compact hover dataTable  '  >"
                + "<thead>"
                + "     <th> ID                     </th>   "
                + "     <th> RESPONSABLE            </th>   "
                + "     <th> ACTIVO                 </th>   "
                + "     <th> KM/HO                  </th>   "
                + "     <th> BOCA EXPENDEDORA       </th>   "
                + "     <th> LITRO INICIO BOCA      </th>   "
                + "     <th> LITRO FINAL BOCA       </th>   "
                + "     <th> ACCION                 </th>   "
                + "</thead> "
                 + "    <tbody>";
        */
        
         
    
         String grilla=""+cabecera+"  "+ tr + "</tbody> </table>";
        ob.put("tabla", grilla);
        
        rs.close();
    } catch (Exception e) 
    {
        ob.put("grilla", e.getMessage());
    } finally {
        connection.close();
        out.print(ob);
    }
%> 

