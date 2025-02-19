<%@ page contentType="application/json; charset=utf-8" %>
<%@ include file="../../chequearsesion.jsp" %>
<%@ include file="../../cruds/conexion_asu.jsp" %>

<%
    JSONObject jsonResult = new JSONObject();
    String jobName = request.getParameter("job");

    if (jobName == null || jobName.isEmpty()) {
        jsonResult.put("tipo", 0);
        jsonResult.put("mensaje", "Job name is required");
        out.print(jsonResult.toString());
        return;
    }

    try {
        // Consulta para obtener el estado actual del job
        String query = "SELECT TOP 8 ja.job_id, j.name, js.step_id, js.step_name, ja.start_execution_date, "
                     + "ja.stop_execution_date, "
                     + "CASE WHEN ja.stop_execution_date IS NULL THEN 'En ejecución' ELSE 'Completado' END as estado, "
                     + "jh.message "
                     + "FROM msdb.dbo.sysjobactivity ja "
                     + "INNER JOIN msdb.dbo.sysjobs j ON ja.job_id = j.job_id "
                     + "INNER JOIN msdb.dbo.sysjobsteps js ON j.job_id = js.job_id "
                     + "INNER JOIN msdb.dbo.sysjobhistory jh ON js.job_id = jh.job_id "
                     + "WHERE j.name = ? "
                     + "ORDER BY ja.start_execution_date DESC";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setString(1, jobName);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String estado = rs.getString("estado");
                String message = rs.getString("message");
                String stepName = rs.getString("step_name");

                if ("Completado".equals(estado)) {
                    jsonResult.put("tipo", 1);
                    jsonResult.put("mensaje", "Job "+jobName+" completado exitosamente");
                } else if ("En ejecución".equals(estado)) {
                    jsonResult.put("tipo", 2);
                    jsonResult.put("mensaje", "El job sigue en ejecución. Paso actual: " + stepName + " (" + message + ")");
                } else {
                    jsonResult.put("tipo", 0);
                    jsonResult.put("mensaje", "El job no se completó correctamente. Paso: " + stepName + " (" + message + ")");
                }
            } else {
                jsonResult.put("tipo", 0);
                jsonResult.put("mensaje", "No se pudo obtener el estado del job");
            }
        }

    } catch (Exception e) {
        jsonResult.put("tipo", 0);
        jsonResult.put("mensaje", "Error al obtener el estado del job: " + e.getMessage());
    } finally {
        // Cerrar la conexión
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                // Manejo de error en el cierre de la conexión
            }
        }
        out.print(jsonResult.toString());
    }
%>
