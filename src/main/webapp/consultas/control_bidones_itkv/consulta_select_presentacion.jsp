<%-- 
    Document   : consulta_select_presentacion
    Created on : 13 sept. 2024, 14:53:25
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
    JSONArray presentacion = new JSONArray();

    try {
        String cod_art = request.getParameter("cod_art");
        String query = "select * FROM [dbo].[cmb_presentacion] where pre_itemcode = '" + cod_art + "'";

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject pres = new JSONObject();
            pres.put("pre_id", rs.getString("pre_id"));
            pres.put("pre_cantidad", rs.getString("pre_cantidad"));
            pres.put("pre_name", rs.getString("pre_name"));

            presentacion.put(pres);
        }

        ob.put("presentacion", presentacion); // Agregamos la lista de objetos al JSON de respuesta

        rs.close();
    } catch (Exception e) {
        ob.put("error", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>

