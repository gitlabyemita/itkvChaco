<%-- 
    Document   : consulta_gen_grilla_registro_lluvias_anual
    Created on : 31 mar. 2025, 15:45:22
    Author     : Administrador
--%>

<%@ page contentType="application/json; charset=UTF-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONArray" %>
<%@ include file="../../cruds/conexion.jsp" %>

<%        // Obtener el parámetro 'ano' de la solicitud
    String anoStr = request.getParameter("anio");

    // Preparar la respuesta JSON
    JSONObject jsonResponse = new JSONObject();
    JSONArray dataArray = new JSONArray();

    try {
        // Verificar que la conexión esté disponible
        if (connection == null) {
            throw new SQLException("No se pudo establecer la conexión con la base de datos.");
        }

        // Preparar la llamada al procedimiento almacenado
        String sql = "{call sp_itkv_registro_lluvias_por_ano(?)}";
        CallableStatement stmt = connection.prepareCall(sql);
        stmt.setInt(1, Integer.parseInt(anoStr));

// Ejecutar el procedimiento almacenado
        ResultSet rs = stmt.executeQuery();

        // Procesar los resultados
        while (rs.next()) {
            JSONObject row = new JSONObject();
            row.put("id_estancia", rs.getInt("id_estancia"));
            row.put("estancia", rs.getString("estancia"));

            // Crear un objeto para los meses
            JSONObject meses = new JSONObject();

            // Procesar cada mes (Enero a Diciembre)
            for (int mes = 1; mes <= 12; mes++) {
                String mesNombre;
                switch (mes) {
                    case 1: mesNombre = "Enero"; break;
                    case 2: mesNombre = "Febrero"; break;
                    case 3: mesNombre = "Marzo"; break;
                    case 4: mesNombre = "Abril"; break;
                    case 5: mesNombre = "Mayo"; break;
                    case 6: mesNombre = "Junio"; break;
                    case 7: mesNombre = "Julio"; break;
                    case 8: mesNombre = "Agosto"; break;
                    case 9: mesNombre = "Septiembre"; break;
                    case 10: mesNombre = "Octubre"; break;
                    case 11: mesNombre = "Noviembre"; break;
                    case 12: mesNombre = "Diciembre"; break;
                    default: mesNombre = "";
                }

                // Crear un array para los días del mes (31 elementos)
                JSONArray diasArray = new JSONArray();
                for (int dia = 1; dia <= 31; dia++) {
                    String columna = mesNombre + "_" + dia;
                    String valor = rs.getString(columna);
                    diasArray.put(valor != null ? valor : "");
                }

                // Obtener el total acumulado del mes
                String totalColumna = "Total_" + mesNombre;
                double totalMes = rs.getDouble(totalColumna);

                // Crear el objeto del mes con los días y el total
                JSONObject mesObj = new JSONObject();
                mesObj.put("dias", diasArray);
                mesObj.put("total", totalMes);

                // Agregar el mes al objeto 'meses'
                meses.put(mesNombre, mesObj);
            }

            // Obtener el total acumulado anual directamente del procedimiento almacenado
            double totalAnual = rs.getDouble("total_acumulado_anual");

            // Agregar el objeto 'meses' y el total anual a la fila
            row.put("meses", meses);
            row.put("total_anual", totalAnual); // Usar la columna total_acumulado_anual
            dataArray.put(row);
        }

        // Cerrar recursos
        rs.close();
        stmt.close();

        // Construir la respuesta JSON
        jsonResponse.put("success", true);
        jsonResponse.put("data", dataArray);

    } catch (SQLException e) {
        // Manejar errores de base de datos
        jsonResponse.put("success", false);
        jsonResponse.put("message", "Error al consultar los datos: " + e.getMessage());
        e.printStackTrace();
    } finally {
        // Cerrar la conexión (si no se maneja en conexion.jsp)
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // Enviar la respuesta JSON
    out.print(jsonResponse.toString());
    out.flush();
%>