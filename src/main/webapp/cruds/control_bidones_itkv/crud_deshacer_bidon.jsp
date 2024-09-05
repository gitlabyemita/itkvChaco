<%-- 
    Document   : crud_deshacer_bidon
    Created on : 29 ago. 2024, 16:59:53
    Author     : Administrador
--%>

<%@page contentType="application/json; charset=utf-8" %>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%    if (sesion == true) {
        String mensaje = "";
        int tipo = 0;
        try {
            String mov_id = request.getParameter("mov_id");

            connection.setAutoCommit(false);
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call sp_eliminar_registro_movimiento(?,?,?)}");

            callableStatement.setString(1, mov_id);

            callableStatement.registerOutParameter(2, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(3, java.sql.Types.VARCHAR); // mensaje
            callableStatement.execute();

            tipo = callableStatement.getInt(2);
            mensaje = callableStatement.getString(3);
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
            ob.put("tipo", tipo);
            ob.put("mensaje", mensaje);
            out.print(ob);
        }
    }
%>

