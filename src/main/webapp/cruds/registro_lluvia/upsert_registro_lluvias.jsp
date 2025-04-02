<%-- 
    Document   : upsert_registro_lluvias
    Created on : 26 mar. 2025, 14:52:26
    Author     : Administrador
--%>

<%@page contentType="application/json; charset=utf-8" %>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%    if (sesion == true) {
        String mensaje = "";
        int tipo = 0;
        int id_registro = 0;

        try {
            // Parámetros recibidos del frontend
            String fecha = request.getParameter("fecha");
            String idEstanciaStr = request.getParameter("id_estancia");
            String estancia = request.getParameter("estancia");
            String lluviaMmStr = request.getParameter("lluvia_mm");
            String observacion = request.getParameter("observacion");
            String idUsuario = (String) sesionOk.getAttribute("id_usuario");
            String hora = request.getParameter("hora");

            // Desactivar el autocommit para manejar transacciones
            connection.setAutoCommit(false);

            // Preparar la llamada al procedimiento almacenado
            CallableStatement callableStatement = null;
            callableStatement = connection.prepareCall("{call [dbo].[sp_upsert_registro_lluvias_itkv](?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");

            // Asignar los parámetros de entrada
            callableStatement.setDate(1, java.sql.Date.valueOf(fecha));
            callableStatement.setInt(2, Integer.parseInt(idEstanciaStr));
            callableStatement.setString(3, estancia);

            if (lluviaMmStr == null || lluviaMmStr.trim().isEmpty() || lluviaMmStr.equals("null")) {
                callableStatement.setNull(4, java.sql.Types.INTEGER);
            } else {
                callableStatement.setInt(4, Integer.parseInt(lluviaMmStr));
            }
            // Manejar observacion (puede ser null)
            if (observacion == null || observacion.isEmpty()) {
                callableStatement.setNull(5, java.sql.Types.VARCHAR);
            } else {
                callableStatement.setString(5, observacion);
            }

            callableStatement.setString(6, idUsuario);
            callableStatement.setString(7, hora);

            // Registrar los parámetros de salida
            callableStatement.registerOutParameter(8, java.sql.Types.INTEGER); // id_registro
            callableStatement.registerOutParameter(9, java.sql.Types.INTEGER); // tipo
            callableStatement.registerOutParameter(10, java.sql.Types.VARCHAR); // mensaje

            // Ejecutar el procedimiento almacenado
            callableStatement.execute();

            // Obtener los parámetros de salida
            id_registro = callableStatement.getInt(8);
            tipo = callableStatement.getInt(9);
            mensaje = callableStatement.getString(10);

            // Confirmar o revertir la transacción según el tipo
            if (tipo == 1) {
                connection.commit();
            } else {
                connection.rollback();
            }

        } catch (Exception e) {
            // En caso de error, revertir la transacción
            connection.rollback();
            mensaje = e.toString();
            tipo = 0;
        } finally {
            // Cerrar la conexión y devolver la respuesta
            connection.close();
            JSONObject ob = new JSONObject();
            ob.put("id_registro", id_registro);
            ob.put("tipo", tipo);
            ob.put("mensaje", mensaje);
            out.print(ob);
        }
    }
%>
