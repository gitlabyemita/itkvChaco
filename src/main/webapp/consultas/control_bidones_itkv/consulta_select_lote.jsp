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
        String query = "SELECT  "
                            + " ISNULL(o.FrgnName, o.ItemName) AS ItemName, "
                            + " o.ItemName AS ItemName, "
                            + " lo.itemcode AS itemcode, "
                            + " lo.sysnumber AS sysnumber, "
                            + " lo.WhsCode AS WhsCode, "
                            + " lo.DistNumber AS DistNumber,"
                            + " lo.Quantity AS OriginalQuantity,"
                            + " lo.Quantity - COALESCE(SUM(rm.rmov_cantidad), 0) AS StockRemaining"
                        + " FROM "
                             + " loteOITM lo "
                        + " LEFT JOIN "
                             + " oitm o ON lo.itemcode = o.itemcode"
                        + " LEFT JOIN "
                            + " cmb_registro_movimientos rm ON lo.itemcode = rm.rmov_itemCode "
                            + " AND lo.DistNumber = rm.rmov_DistNumber "
                            + " AND rm.rmov_estado = 'P'"
                        + " WHERE "
                            + " lo.itemcode = '" + cod_art + "'"
                        + " GROUP BY "
                            + "  ISNULL(o.FrgnName, o.ItemName), "
                            + "  o.ItemName, "
                            + "  lo.itemcode, "
                            + "  lo.sysnumber, "
                            + "  lo.WhsCode, "
                            + "  lo.DistNumber, "
                            + "  lo.Quantity; ";

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject lote = new JSONObject();
            lote.put("lote_id", rs.getString("sysnumber"));
            lote.put("itemcode", rs.getString("itemcode"));
            lote.put("lote_name", rs.getString("DistNumber"));
            lote.put("itemname", rs.getString("ItemName"));
            lote.put("cantidad_lote", rs.getString("Quantity"));
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

