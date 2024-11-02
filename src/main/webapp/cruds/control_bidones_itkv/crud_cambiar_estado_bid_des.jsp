<%-- 
    Document   : crud_cambiar_estado_bid_des
    Created on : 13 sept. 2024, 16:36:11
    Author     : Administrador
--%>

<%@ page contentType="application/json; charset=utf-8" %>
<%@ include file="../../chequearsesion.jsp" %>
<%@ include file="../../cruds/conexion.jsp" %>

<%    if (sesion == true) {
        String mensaje = "";
        int tipo = 0;
        try {
            // Obtener los parámetros del request
            String idsRegMov = request.getParameter("ids_regmov"); // Recibir el arreglo de IDs
            String tipoReg = request.getParameter("tipoReg"); // D = Destrucción
            String res_id = request.getParameter("res_id");
            String res_name = request.getParameter("res_name");

            // Preparar la llamada al procedimiento almacenado
            CallableStatement callableStatement = connection.prepareCall("{call UPD_estadoMovBidonesDest(?, ?, ?, ?, ?, ?)}");

            // Setear los parámetros de entrada
            callableStatement.setInt(1, Integer.parseInt(res_id));
            callableStatement.setString(2, res_name);
            callableStatement.setString(3, idsRegMov);
            callableStatement.setString(4, tipoReg);

            // Registrar los parámetros de salida
            callableStatement.registerOutParameter(5, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(6, java.sql.Types.VARCHAR); // mensaje

            // Ejecutar el procedimiento almacenado
            callableStatement.execute();

            // Obtener los valores de salida
            tipo = callableStatement.getInt(5);
            mensaje = callableStatement.getString(6);

            // Confirmar o revertir la transacción basada en el resultado
            if (tipo == 1) {
                connection.commit();
            } else {
                connection.rollback();
            }

        } catch (Exception e) {
            // En caso de error, revertir la transacción y capturar el mensaje de error
            connection.rollback();
            tipo = -1;
            mensaje = e.toString();
        } finally {
            // Cerrar la conexión y devolver la respuesta JSON
            connection.close();
            JSONObject ob = new JSONObject();
            ob.put("tipo", tipo);
            ob.put("mensaje", mensaje);
            out.print(ob);
        }
    }
%>


