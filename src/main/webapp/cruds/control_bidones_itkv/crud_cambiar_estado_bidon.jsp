<%-- 
    Document   : crud_cambiar_estado_bidon
    Created on : 3 sept. 2024, 16:32:27
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
            String tipoReg = request.getParameter("tipoReg"); // E = Entrega, R = Recibo, D = Destrucción
            String id_usuario = (String) sesionOk.getAttribute("id_usuario");

            // Preparar la llamada al procedimiento almacenado
            CallableStatement callableStatement = connection.prepareCall("{call UPD_estadoMovBidones(?, ?, ?, ?, ?)}");

            // Setear los parámetros de entrada
            callableStatement.setString(1, idsRegMov);
            callableStatement.setString(2, tipoReg);
            callableStatement.setString(3, id_usuario);

            // Registrar los parámetros de salida
            callableStatement.registerOutParameter(4, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(5, java.sql.Types.VARCHAR); // mensaje

            // Ejecutar el procedimiento almacenado
            callableStatement.execute();

            // Obtener los valores de salida
            tipo = callableStatement.getInt(4);
            mensaje = callableStatement.getString(5);

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


