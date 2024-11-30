<%-- 
    Document   : consulta_select_lote
    Created on : 17 sept. 2024, 15:03:22
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
    JSONArray lotes = new JSONArray();

    try {
        String cod_art = request.getParameter("cod_art");
        String query = "select * from v_stock_articulos_lotes_bidones where itemcode = '" + cod_art + "'";

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject lote = new JSONObject();
            lote.put("lote_id", rs.getString("sysnumber"));
            lote.put("itemcode", rs.getString("itemcode"));
            lote.put("lote_name", rs.getString("DistNumber"));
            lote.put("itemname", rs.getString("ItemName"));
            lote.put("StockRemaining", rs.getString("StockRemaining"));
            lotes.put(lote);
        }

        ob.put("lotes", lotes); // Agregamos la lista de objetos al JSON de respuesta

        rs.close();
    } catch (Exception e) {
        ob.put("error", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>

