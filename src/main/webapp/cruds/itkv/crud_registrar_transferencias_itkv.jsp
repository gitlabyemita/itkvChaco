<%@page import="com.microsoft.sqlserver.jdbc.SQLServerDataTable"%>
<%@page import="itkv.itkv_datos"%>
<%@page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.sql.CallableStatement"%>
<%@page import="java.io.IOException"%>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%@page contentType="application/json; charset=utf-8" %>
<%    if (sesion == true) {
        String grilla           = request.getParameter("jsonObj");
        String responsable      = request.getParameter("responsable");
        String id_usuario       = (String) sesionOk.getAttribute("id_usuario");
        String id_activo        = request.getParameter("id_activo");
        String desc_activo      = request.getParameter("desc_activo");
        String id_rubro         = request.getParameter("id_rubro");
        String desc_rubro       = request.getParameter("desc_rubro");
        String id_actividad     = request.getParameter("id_actividad");
        String desc_actividad   = request.getParameter("desc_actividad");
     
        String id_ubicacion     = request.getParameter("id_ubicacion");
        String desc_ubicacion   = request.getParameter("desc_ubicacion");
        String horometro   = request.getParameter("horometro");
          

        
        
        ObjectMapper mapper = new ObjectMapper();
        itkv_datos[] pp1 = mapper.readValue(grilla, itkv_datos[].class);

        SQLServerDataTable DataTableGrilla = new SQLServerDataTable();
        DataTableGrilla.addColumnMetadata("codigo", java.sql.Types.VARCHAR);
        DataTableGrilla.addColumnMetadata("articulo", java.sql.Types.VARCHAR);
        DataTableGrilla.addColumnMetadata("cantidad", java.sql.Types.INTEGER);

        for (itkv_datos lotes : pp1) {
            DataTableGrilla.addRow(lotes.codigo, lotes.articulo, lotes.cantidad);
        }
       
        int tipo_respuesta = 0;
        String mensaje = "";
        JSONObject ob = new JSONObject();
        ob = new JSONObject();
                connection.setAutoCommit(false);
        try {
             

                CallableStatement callableStatement = null;
                callableStatement = connection.prepareCall("{call [itkv_transferencias_insert_v3] (?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
                callableStatement.setString (1, responsable);
                callableStatement.setInt    (2, Integer.parseInt(id_usuario));
                callableStatement.setString (3, id_activo);
                callableStatement.setString (4, desc_activo);
                callableStatement.setString    (5, id_rubro);
                callableStatement.setString    (6, desc_rubro);
                callableStatement.setString    (7, id_actividad);
                callableStatement.setString (8, desc_actividad); 
                callableStatement.setObject(9, DataTableGrilla); 
                callableStatement.setString (10, id_ubicacion); 
                callableStatement.setString (11, desc_ubicacion); 
                callableStatement.setInt (12, Integer.parseInt(horometro)); 
                
                callableStatement.registerOutParameter("estado_registro", java.sql.Types.INTEGER);
                callableStatement.registerOutParameter("mensaje", java.sql.Types.VARCHAR);
                callableStatement.execute();
                tipo_respuesta = callableStatement.getInt("estado_registro");
                mensaje = callableStatement.getString("mensaje");

                ob.put("mensaje", mensaje);
                ob.put("tipo_respuesta", tipo_respuesta);
                if (tipo_respuesta == 0) {
                    connection.rollback();
                } else {
                    connection.commit();
                }

         } catch (Exception e) {
            ob.put("mensaje", e.getMessage());
            ob.put("tipo_respuesta", 0);
            connection.rollback();
        } finally {

            connection.close();
            out.print(ob);
        }
    }
%> 