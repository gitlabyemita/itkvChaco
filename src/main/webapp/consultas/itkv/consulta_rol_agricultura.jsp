<%-- 
    Document   : consulta_rol_agricultura
    Created on : 25 oct. 2024, 14:39:27
    Author     : Administrador
--%>

<%@page import="org.json.JSONObject"%>
<%@page import="java.sql.CallableStatement"%>
<%@page import="java.io.IOException"%>
<%@include file="../../chequearsesion.jsp" %>
<%@include file="../../cruds/conexion.jsp" %>
<%@page contentType="application/json; charset=utf-8" %>
<%    if (sesion == true) {

        String id_usuario = (String) sesionOk.getAttribute("id_usuario");
        String id_rol = (String) sesionOk.getAttribute("id_rol");

        JSONObject ob = new JSONObject();
        ob = new JSONObject();
        connection.setAutoCommit(false);
        try {
            ob.put("id_usuario", id_usuario);
            ob.put("id_rol", id_rol);

        } catch (Exception e) {
            ob.put("id_usuario", e.getMessage());
            ob.put("id_rol", e.getMessage());
            connection.rollback();
        } finally {
            connection.close();
            out.print(ob);
        }
    }
%> 
