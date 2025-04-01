<%-- 
    Document   : consulta_gen_grilla_registro_lluvias
    Created on : 20 mar. 2025, 14:00:41
    Author     : Administrador
--%>

<%@ page import="java.sql.*" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%@ page contentType="application/json; charset=utf-8" %>
<%@ include file="../../cruds/conexion.jsp" %>
    
<%  // Creamos el objeto JSON que contendrá la respuesta
    String fecha = request.getParameter("fecha");
    JSONObject jsonResponse = new JSONObject();
    JSONArray jsonArray = new JSONArray();

    try {
        // Preparamos la llamada a la función
        String query = "EXEC sp_itkv_registro_lluvias_por_fecha '" + fecha + "' ";

        // Usamos PreparedStatement para evitar inyecciones SQL
        PreparedStatement ps = connection.prepareStatement(query);

        // Ejecutamos la consulta
        ResultSet rs = ps.executeQuery();

        // Iteramos sobre los resultados
        while (rs.next()) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id_estancia", rs.getString("id_estancia") == null ? "" : rs.getString("id_estancia"));
            jsonObject.put("estancia", rs.getString("estancia"));
            jsonObject.put("fecha", rs.getString("fecha") == null ? "" : rs.getString("fecha"));
            jsonObject.put("lluvia_mm_06", rs.getString("lluvia_mm_06") == null ? "" : rs.getString("lluvia_mm_06"));
            jsonObject.put("observacion_06", rs.getString("observacion_06") == null ? "" : rs.getString("observacion_06"));
            jsonObject.put("lluvia_mm_18", rs.getString("lluvia_mm_18") == null ? "" : rs.getString("lluvia_mm_18"));
            jsonObject.put("observacion_18", rs.getString("observacion_18") == null ? "" : rs.getString("observacion_18"));
            jsonObject.put("total_lluvia_mm", rs.getString("total_lluvia_mm") == null ? "" : rs.getString("total_lluvia_mm"));
            jsonArray.put(jsonObject);
        }

        // Añadimos el array JSON a la respuesta
        jsonResponse.put("data", jsonArray);

        rs.close();
        ps.close();
    } catch (SQLException e) {
        // En caso de error, añadimos el mensaje de error al JSON de respuesta
        jsonResponse.put("error", e.getMessage());
    } finally {
        // Cerramos la conexión
        connection.close();
    }

    // Enviamos la respuesta JSON
    out.print(jsonResponse.toString());
%>


