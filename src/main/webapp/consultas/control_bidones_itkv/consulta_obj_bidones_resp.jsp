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
            query = "select * from cmb_registro_movimientos rm  left outer join cmb_presentacion pr on rm.rmov_pre_id = pr.pre_id where rm.rmov_estado = '" + estado + "' and (rm.rmov_cantR = 0 or rm.rmov_cantR is null)";
        } else {
            query = "select rm.[rmov_id] ,pr.pre_name, rm.[rmov_DocDate], "
            + "rm.[rmov_itemCode], rm.[rmov_itemName], rm.[rmov_codeBar1], "
            + "rm.[rmov_codeBar2], rm.[rmov_OT], rm.[rmov_cantidad], rm.[rmov_cantR], "
            + "rm.[rmov_pre_id], rm.[rmov_tmov_id], rm.[rmov_alm_origen], rm.[rmov_alm_destino], "
            + "rm.[rmov_res_id], rm.[rmov_res_name], rm.[rmov_fecha_pdev], rm.[rmov_entregado], "
            + "rm.[rmov_devuelto], rm.[rmov_destruido], rm.[rmov_reasig_codBar], rm.[rmov_vacio], "
            + "rm.[rmov_estado], rm.[rmov_comentario], rm.[created_at], rm.[updated_at], rm.[rmov_DistNumber]"
            + " from cmb_registro_movimientos rm"
            + "  left outer join cmb_presentacion pr"
            + " on rm.rmov_pre_id = pr.pre_id"
            + " where rm.rmov_res_id = "+res_id+" and rm.rmov_estado = '"+estado+"'";
        }

        ResultSet rs;
        Statement st = connection.createStatement();

        rs = st.executeQuery(query);

        while (rs.next()) {
            JSONObject bidon = new JSONObject();
            bidon.put("codigoBarra", rs.getString("rmov_codeBar1"));
            bidon.put("codigoBarra2", rs.getString("rmov_codeBar2") == null ? "" : rs.getString("rmov_codeBar2"));
            bidon.put("nombre", rs.getString("rmov_itemName"));
            bidon.put("presentacion", rs.getString("pre_name"));
            bidon.put("ot", rs.getString("rmov_OT"));
            bidon.put("responsable", rs.getString("rmov_res_name"));
            bidon.put("fechaDevolucion", rs.getString("rmov_fecha_pdev"));
            bidon.put("cantidadEntregada", rs.getString("rmov_cantidad"));
            bidon.put("cantidadRecibida", rs.getString("rmov_cantR") == null ? "" : rs.getString("rmov_cantR"));
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
