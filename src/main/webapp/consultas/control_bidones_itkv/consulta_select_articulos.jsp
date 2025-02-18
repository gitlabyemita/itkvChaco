<%-- 
    Document   : consulta_select_articulos
    Created on : 18 sept. 2024, 16:14:47
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
    JSONArray articulos = new JSONArray();

    try {
//        String query = "select * from OITM where QryGroup5= 'Y'";
        String query = "select * from v_stock_articulos_bidones where WhsCode = 'DEP_AGR'";

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject articulo = new JSONObject();
            articulo.put("art_id", rs.getString("ItemCode"));
            articulo.put("art_name", rs.getString("ItemName"));
            articulo.put("pres_unica", rs.getString("U_pres_unica"));
            articulo.put("lote_content", rs.getString("ManBtchNum"));
            articulo.put("factor_multip", rs.getString("NumInCnt"));
            articulo.put("name_factor_multip", rs.getString("CntUnitMsr"));
            articulo.put("OnHand", rs.getString("StockRemaining"));

            articulos.put(articulo);
        }
        ob.put("articulos", articulos); // Agregamos la lista de objetos al JSON de respuesta

        rs.close();
    } catch (Exception e) {
        ob.put("error", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>

