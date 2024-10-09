<%-- 
   Document   : contenedor_registro_reprocesos
   Created on : 15-dic-2021, 9:51:44
   Author     : hvelazquez
--%>
<%@include  file="../../versiones.jsp" %>
<%@include  file="../../chequearsesion.jsp" %>
<%@include  file="../../cruds/conexion.jsp" %> 

<style>
    tr:hover {
        color:#ffffff ;
        background-color: #001940;
    }
</style>
<head>   
<label  ><b></b></label> 



<%    Statement st = connection.createStatement();
    ResultSet rs;
    String tr = "";
    rs = st.executeQuery(" select convert(varchar,getdate(),103) as fecha  ");
    String fecha = "";

    while (rs.next()) {

        fecha = rs.getString("fecha");
    }

    connection.close();

%>
</head><!-- comment -->
<div class="col-lg-20 ">
    <div class="position-relative p-3 bg-navy"  >
        <div class="ribbon-wrapper">
            <div class="ribbon bg-warning">
                ITKV
            </div>
        </div>
        <center><b>GESTION DE REPORTES DE CONSUMO DE COMBUSTIBLE</b></center>
    </div>
</div> 



<br>
<strong ><a>Fecha de registro</a></strong>




<input type="text" class="datepicker " value="<%=fecha%>" required id="fecha">
<input  class="btn bg-navy"  type="button"  onclick="ir_grilla_consumo_combustible_itkv();" value="BUSCAR" >
<br>
<br>
<div class="col-12">
    <div class="card elevation-2">
        <!--        <div class="card-header bg-primary">
                    <h3 class="card-title">CONSUMO COMBUSTIBLE</h3>
                </div>-->
        <div id="div_grilla" class="card-body">
        </div>
    </div>
</div>


<div id="div_grilla2">


</div>

















