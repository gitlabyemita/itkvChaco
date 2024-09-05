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
    String grilla_html = "";
    String cabecera = "";
    try {
        String res_id = request.getParameter("responsable");

        ResultSet rs;
        Statement st = connection.createStatement();
        rs = st.executeQuery("select * from cmb_registro_movimientos rm  left outer join cmb_presentacion pr on rm.rmov_pre_id = pr.pre_id where rm.rmov_res_id = " + res_id + " and rm.rmov_estado = 'P'");

        cabecera = " <table class='contenteditablepd table table-striped table-bordered table-hover table-xs compact w-100' id='tabla-bidones'>"
                + "<thead>"
                + "<tr>"
                + "   <th class='text-center' width='80'>COD_BARRA</th>"
                + "   <th class='text-center' width='80'>COD_BARRA REASIG</th>"
                + " <th class='text-center' width='80'>NOMBRE</th>"
                + " <th class='text-center' width='80'>PRESENTACION</th>"
                + " <th class='text-center' width='60'>O.T.</th>"
                + " <th class='text-center' width='60'>RESPONSABLE</th>"
                + " <th class='text-center' width='60'>F_DEVOLUCION</th> "
                + " <th class='text-center' width='60'>CANT. ENTREGADA</th>"
                + " <th class='text-center' width='60'>CANT. RECIBIDA</th>"
                + " <th class='text-center' width='60'>ACCIÓN</th>"
                + "</tr>"
                + " </thead> "
                + " <tbody >";
        while (rs.next()) {
            String cod_reasig = rs.getString("rmov_codeBar2");
            String cant_rec = rs.getString("rmov_cantR");
            if (cod_reasig == null) {
                cod_reasig = "";
            }
            if (cant_rec == null) {
                cant_rec = "";
            }

            grilla_html = grilla_html
                    + "<tr >"
                    + "<td>" + rs.getString("rmov_codeBar1") + "</td>"
                    + "<td>" + cod_reasig + "</td>"
                    + "<td>" + rs.getString("rmov_itemName") + "</td>"
                    + "<td>" + rs.getString("pre_name") + "</td>"
                    + "<td>" + rs.getString("rmov_OT") + "</td>"
                    + "<td>" + rs.getString("rmov_res_name") + "</td>"
                    + "<td>" + rs.getString("rmov_fecha_pdev") + "</td>"
                    + "<td>" + rs.getString("rmov_cantidad") + "</td>"
                    + "<td>" + cant_rec + "</td>"
                    + "<td><button id='btnEliminarBidon' class='btn btn-warning text-center' onclick='eliminarBidon(" + rs.getString("rmov_id") + ")'><i class='fa-solid fa-trash'></i> Deshacer</button></td>"
                    + "</tr>";
        }

        ob.put("grilla", cabecera + grilla_html + "</tbody></table>");

        rs.close();
    } catch (Exception e) {
        ob.put("grilla", e.toString());
    } finally {
        connection.close();
        out.print(ob);
    }
%>



