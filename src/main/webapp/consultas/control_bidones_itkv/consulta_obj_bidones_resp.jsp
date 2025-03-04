<%-- 
    Document   : consulta_grilla_bidones_resp
    Created on : 27 ago. 2024, 11:14:20
    Author     : Administrador
--%>
<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 
<%@page contentType="application/json; charset=utf-8" %>
<%    JSONObject ob = new JSONObject();
    JSONArray bidones = new JSONArray();

    try {
        String res_id = request.getParameter("responsable");
        String estado = request.getParameter("estado");
        String query = "";
        if (res_id.equals("TODOS") && estado.equals("R")) {
            query = "select * "
                    + "from cmb_registro_movimientos rm  "
                    + "left outer join cmb_presentacion pr "
                    + "on rm.rmov_pre_id = pr.pre_id "
                    + "left outer join loteOITM lo "
                    + "on "
                    + "rm.rmov_itemCode = lo.ItemCode "
                    + "where rm.rmov_estado = '" + estado + "' "
                    + "and (rm.rmov_cantR = 0 or rm.rmov_cantR is null)";
        } else {
            query = "select * "
                    + " from cmb_registro_movimientos rm  "
                    + " left outer join cmb_presentacion pr "
                    + " on rm.rmov_pre_id = pr.pre_id "
                    + " left outer join loteOITM lo "
                    + " on "
                    + " rm.rmov_itemCode = lo.ItemCode and rm.rmov_DistNumber = lo.DistNumber "
                    + " where rm.rmov_res_id = " + res_id + " and rm.rmov_estado = '" + estado + "'";
        }

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject bidon = new JSONObject();
            bidon.put("codigoBarra", rs.getString("rmov_codeBar1"));
            bidon.put("codigoBarra2", rs.getString("rmov_codeBar2") == null ? "" : rs.getString("rmov_codeBar2"));
            bidon.put("distnumber", rs.getString("distnumber") == null ? "" : rs.getString("distnumber"));
            bidon.put("nombre", rs.getString("rmov_itemName"));
            bidon.put("itemcode", rs.getString("rmov_itemCode"));
            bidon.put("presentacion", rs.getString("pre_name"));
            bidon.put("ot", rs.getString("rmov_OT"));
            bidon.put("responsable", rs.getString("rmov_res_name"));
            bidon.put("fechaDevolucion", rs.getString("rmov_fecha_pdev"));
            bidon.put("cantidadEntregada", rs.getString("rmov_cantidad"));
            bidon.put("cantidadRecibida", rs.getString("rmov_cantR") == null ? "" : rs.getString("rmov_cantR"));
            bidon.put("comentario", rs.getString("rmov_comentario") == null ? "" : rs.getString("rmov_comentario"));
            bidon.put("mov_id", rs.getString("rmov_id")); // Este valor será utilizado en la acción de eliminar

            bidones.put(bidon);
        }

        ob.put("bidones", bidones); // Agregamos la lista de objetos al JSON de respuesta

        rs.close();
    } catch (Exception e) {
        ob.put("error", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>
