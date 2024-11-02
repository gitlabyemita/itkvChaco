<%-- 
    Document   : crud_nuevo_responsable_itkv
    Created on : 19 sept. 2024, 06:30:37
    Author     : Administrador
--%>

<%@page contentType="application/json; charset=utf-8" %>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%    if (sesion == true) {
        String mensaje = "";
        int tipo = 0;
        try {
            String nombre = request.getParameter("nombre");

            connection.setAutoCommit(false);
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call sp_nuevo_responsable_itkv(?,?,?)}");

            callableStatement.setString(1, nombre);

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
