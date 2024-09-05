<%-- 
    Document   : crud_agregar_modulos
    Created on : 14/12/2021, 11:20:03
    Author     : csanchez
--%>

<%@page import="org.json.JSONArray"%>
<%@page import="java.util.Arrays"%>
<%@page import="com.microsoft.sqlserver.jdbc.SQLServerDataTable"%>
<%@page import="com.fasterxml.jackson.databind.ObjectMapper"%>
<%@page import="principal.permisos"%>
<%@page contentType="application/json; charset=utf-8"%>  
<%@include file="../cruds/conexion.jsp" %>
<%@include  file="../chequearsesion.jsp" %>
<% JSONObject obje = new JSONObject();
    obje = new JSONObject();
    String select_rol;
    select_rol = request.getParameter("data.select[c]");
    String mensaje = "";
    int tipo_respuesta = 0;

    try {
        String[] array_modulo = request.getParameterValues("permisos");
        String Line = String.join(",", array_modulo);
        

        JSONArray jsonArray = Arrays.stream(Line.split(","))
                .map(id -> new JSONObject().put("id", Integer.parseInt(id)))
                .collect(JSONArray::new, JSONArray::put, JSONArray::put);

        // jsonString ahora contiene la representación en formato de cadena del JSONArray
        String jsonString = jsonArray.toString();

        ObjectMapper mapper = new ObjectMapper();
        // Deserializar la cadena en un array de objetos permisos
        permisos[] pp1 = mapper.readValue(jsonString, permisos[].class);
       
        
        // Crear SQLServerDataTable y llenarlo
        SQLServerDataTable DataTableGrilla = new SQLServerDataTable();
        DataTableGrilla.addColumnMetadata("id", java.sql.Types.VARCHAR);
        
        for (permisos contenido : pp1) {
            DataTableGrilla.addRow(contenido.id.trim());
            
        }
        connection.setAutoCommit(false);
        
        CallableStatement call2;
        call2 = connection.prepareCall("exec [stp_mae_yemsys_insert_permisos_estado] @idrol='" + select_rol + "'");
        call2.execute();
        
        CallableStatement callableStatement = null;
        callableStatement = connection.prepareCall("{call [stp_mae_yemsys_insert_permisos](?,?,?,?)}");
        callableStatement.setString(1, select_rol);
        callableStatement.setObject(2, DataTableGrilla);
        callableStatement.registerOutParameter(3, java.sql.Types.INTEGER);
        callableStatement.registerOutParameter(4, java.sql.Types.VARCHAR);
        callableStatement.execute();

        callableStatement.registerOutParameter("tipo_respuesta", java.sql.Types.INTEGER);
        callableStatement.registerOutParameter("mensaje", java.sql.Types.VARCHAR);
        callableStatement.execute();
        tipo_respuesta = callableStatement.getInt("tipo_respuesta");
        mensaje = callableStatement.getString("mensaje");
        connection.commit(); // Commit the transaction if everything is successful
    } catch (Exception ex) {
        mensaje = ex.toString();
        connection.rollback(); // Rollback the transaction in case of an exception
    } finally {

        connection.close();

        obje.put("mensaje", mensaje);
        obje.put("tipo", tipo_respuesta);
        out.print(obje);
        
    }
%>

