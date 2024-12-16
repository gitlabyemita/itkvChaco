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
        rs = st.executeQuery("    SELECT * FROM itkv_transferencias where convert(date,fecha_registro)='"+fecha+"' and tipo_registro in ('REPUESTO','REPUESTO AGRICULTURA')  order by 1 desc ");
        
         String   cabecera = " <table id='grilla' class=' table-bordered compact hover' style='width:100%'>"
                + "<thead>"
                + "<tr>"
                 + "   <th>Nro.                     </th>"
                   + " <th>Fecha de registro        </th>"
                   + " <th>Activo        </th>"
                   + " <th>Tipo        </th>"
                   + " <th></th>"
                
                + "</tr>"
             
                + " </thead> "
                + " <tbody >";
         
        while (rs.next()) 
        {
            tr = tr
            + " <tr>"
            +"      <td>"+rs.getString("id")            +"</td>" 
            +"      <td>"+rs.getString("fecha_registro")   +"</td>" 
            +"      <td>"+rs.getString("desc_activo")   +"</td>" 
            +"      <td>"+rs.getString("tipo_registro")   +"</td>" 
            +"  <td>"
            + " <div>"
            + " <form action=\"cruds/itkv/control_reporte_salida_repuesto.jsp\" target=\"blank\"><input type=\"submit\" value=\"Reporte\" class=\"form-control bg-danger\">  <input type=\"hidden\" id=\"id\" name=\"id\" value=\""+rs.getString("id")+"\"></form>  </td>"               
            + "</td>"               
            + " </tr>";
        }
         
    
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

