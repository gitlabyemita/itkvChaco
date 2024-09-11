<%-- 
    Document   : crud_reasig_code_bar
    Created on : 6 sept. 2024, 14:52:23
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
            String mov_id = request.getParameter("mov_id");
            String cod_bar = request.getParameter("cod_bar");

            connection.setAutoCommit(false);
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call sp_insertar_actualizar_regmov(?,NULL,NULL,NULL,NULL,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,?,?,?)}");

            callableStatement.setString(1, mov_id);
            callableStatement.setString(2, cod_bar);

            callableStatement.registerOutParameter(3, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(4, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(5, java.sql.Types.VARCHAR); // mensaje
            callableStatement.execute();

            id = callableStatement.getInt(3);
            tipo = callableStatement.getInt(4);
            mensaje = callableStatement.getString(5);
            if (tipo == 1) {
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
