<%-- 
    Document   : crud_carga_cant_rest
    Created on : 6 sept. 2024, 15:28:03
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
            String cant = request.getParameter("cant");
            String id_usuario = (String) sesionOk.getAttribute("id_usuario");

            connection.setAutoCommit(false);
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call sp_insertar_actualizar_regmov(?,NULL,NULL,NULL,NULL,NULL,NULL,NULL,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,?,?,?,?)}");

            callableStatement.setInt(1, Integer.parseInt(mov_id));
            callableStatement.setFloat(2, Float.parseFloat(cant));
            callableStatement.setString(3, id_usuario);

            callableStatement.registerOutParameter(4, java.sql.Types.INTEGER); // id
            callableStatement.registerOutParameter(5, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(6, java.sql.Types.VARCHAR); // mensaje
            callableStatement.execute();

            id = callableStatement.getInt(4);
            tipo = callableStatement.getInt(5);
            mensaje = callableStatement.getString(6);
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
