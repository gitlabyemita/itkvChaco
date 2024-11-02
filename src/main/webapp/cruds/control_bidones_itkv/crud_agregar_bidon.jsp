<%-- 
    Document   : crud_agregar_bidon
    Created on : 26 ago. 2024, 15:37:53
    Author     : Administrador
--%>

<%@page contentType="application/json; charset=utf-8" %>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%    if (sesion == true) {
        String mensaje = "";
        int tipo = 0;
        int id = 0;
        try {
            String tipo_mov = request.getParameter("tipo");
            String ot = request.getParameter("ot");
            String id_resp = request.getParameter("id_resp");
            String f_dev = request.getParameter("f_dev");
            String cod_art = request.getParameter("cod_art");
            String pres = request.getParameter("pres");
            String cod_barra = request.getParameter("cod_barra");
            String cantidad = request.getParameter("cantidad");
            String estado = request.getParameter("estado");
            String name_art = request.getParameter("name_art");
            String resp = request.getParameter("resp");
            String lote = request.getParameter("lote");

            connection.setAutoCommit(false);
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call sp_insertar_actualizar_regmov(NULL,NULL,?,?,?,NULL,?,?,NULL,?,?,NULL,NULL,?,?,?,NULL,NULL,NULL,NULL,NULL,?,NULL,?,NULL,NULL,?,?,?)}");

            callableStatement.setString(1, cod_art);
            callableStatement.setString(2, name_art);
            callableStatement.setString(3, cod_barra);
            callableStatement.setString(4, ot);
            callableStatement.setFloat(5, Float.parseFloat(cantidad));
            callableStatement.setInt(6, Integer.parseInt(pres));
            callableStatement.setInt(7, Integer.parseInt(tipo_mov));
            callableStatement.setInt(8, Integer.parseInt(id_resp));
            callableStatement.setString(9, resp);
            callableStatement.setString(10, f_dev);
            callableStatement.setString(11, estado);
            callableStatement.setString(12, lote);

            callableStatement.registerOutParameter(13, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(14, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(15, java.sql.Types.VARCHAR); // mensaje
            callableStatement.execute();

            id = callableStatement.getInt(13);
            tipo = callableStatement.getInt(14);
            mensaje = callableStatement.getString(15);
            if (tipo == 1 || tipo == 2) {
                connection.commit();
            } else {
                connection.rollback();
            }

        } catch (Exception e) {
            connection.rollback();
            mensaje = e.toString();
        } finally {
            connection.close();
            JSONObject ob = new JSONObject();
            ob.put("id", id);
            ob.put("tipo", tipo);
            ob.put("mensaje", mensaje);
            out.print(ob);
        }
    }
%>

