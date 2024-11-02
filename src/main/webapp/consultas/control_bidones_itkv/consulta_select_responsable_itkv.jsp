<%-- 
    Document   : consulta_select_responsable_itkv
    Created on : 19 sept. 2024, 06:37:34
    Author     : Administrador
--%>

<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 
<%@page contentType="application/json; charset=utf-8" %>
<%  JSONObject ob = new JSONObject();
    JSONArray responsables = new JSONArray();

    try {
        String query = "select * from itkv_personales";

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject responsable = new JSONObject();
            responsable.put("id", rs.getString("id"));
            responsable.put("nombre", rs.getString("nombre"));
            responsables.put(responsable);
        }

        ob.put("responsables", responsables); // Agregamos la lista de objetos al JSON de respuesta

        rs.close();
    } catch (Exception e) {
        ob.put("error", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>
