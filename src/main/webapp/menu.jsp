<!DOCTYPE html>
<%@include  file="chequearsesion.jsp" %>
<html lang="en">
    <head>
        <% String usuario = (String) sesionOk.getAttribute("nombre_usuario");
            String id_usuario = (String) sesionOk.getAttribute("id_usuario");
            String area = (String) sesionOk.getAttribute("clasificadora");
            String nav_area = (String) sesionOk.getAttribute("nav_area");
            String notificacion = (String) sesionOk.getAttribute("notificacion");
        %>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ita Ka avo Sistema</title>

        <script src="plugins/fontAwesome.js" type="text/javascript"></script>
        <link href="plugins/ionicons.min.css" rel="stylesheet" type="text/css"/>
        <!-- Tempusdominus Bootstrap 4 -->
        <link rel="stylesheet" href="plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css">
        <!-- iCheck -->
        <link rel="stylesheet" href="plugins/icheck-bootstrap/icheck-bootstrap.min.css">
        <!-- JQVMap -->
        <link rel="stylesheet" href="plugins/jqvmap/jqvmap.min.css">
        <!-- Theme style -->
        <link href="dist/css/adminlte.css" rel="stylesheet" type="text/css"/>
        <!-- overlayScrollbars -->
        <link rel="stylesheet" href="plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
        <!-- Daterange picker -->
        <link rel="stylesheet" href="plugins/daterangepicker/daterangepicker.css">
        <link href="plugins/selectPicker/bootstrap-select.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="plugins/summernote/summernote-bs4.min.css">
        <link href="plugins/lib/themes/default.css" rel="stylesheet" id="theme_base" />
        <link href="plugins/lib/themes/default.date.css" rel="stylesheet" id="theme_date" />

        <link href="css/hover_datatable.css" rel="stylesheet" type="text/css"/>

        <link rel="stylesheet" type="text/css" href="plugins/autoFill.bootstrap4.min.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/buttons.bootstrap4.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/colReorder.bootstrap4.css"/>
        <link href="plugins/dataTables.dateTime.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/fixedColumns.bootstrap4.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/fixedHeader.bootstrap4.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/keyTable.bootstrap4.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/responsive.bootstrap4.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/rowGroup.bootstrap4.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/rowReorder.bootstrap4.css" rel="stylesheet" type="text/css"/>


        <link rel="stylesheet" type="text/css" href="plugins/scroller.bootstrap4.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/searchBuilder.bootstrap4.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/searchPanes.bootstrap4.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/select.bootstrap4.css"/>
        <link rel="stylesheet" type="text/css" href="plugins/stateRestore.bootstrap4.css"/>
        <link href="css/estilos_pedidos.css" rel="stylesheet" type="text/css"/>
        <link href="css/colores.css" rel="stylesheet" type="text/css"/><!-- css para colocar el color azul a la celda editable al momento de ingresar en el -->
        <link href="plugins/jquery.loadingModal.css" rel="stylesheet" type="text/css"/>
        <link href="css/ppr/aldo.css" rel="stylesheet" type="text/css"/>
        <link href="css/ppr/claudio.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/toastr/toastr.min.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/bootstrap4-toggle.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/DateTimePicker.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/jquery.loadingModal.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/jquery-ui.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/jquery-ui.multidatespicker.css" rel="stylesheet" type="text/css"/>
        <link href="css/parpadeo.css" rel="stylesheet" type="text/css"/>
        <link href="plugins/chart.js/Chart.css" rel="stylesheet" type="text/css"/>

        <link rel="stylesheet" href="plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css">
        <link href="plugins/font-awesome.min.css" rel="stylesheet" type="text/css"/>
        <!--<link href="css/CSSdataTableV2_1_5.css" rel="stylesheet" type="text/css"/>-->
        <!--para notificaciones toastr-->
        <link href="css/toastr.min.css" rel="stylesheet" type="text/css"/>
        <link href="css/toastr.css" rel="stylesheet" type="text/css"/>
        <link href="css/app.css" rel="stylesheet" type="text/css"/>
        <link href="css/bidones.css" rel="stylesheet" type="text/css"/>


    </head>
    <input type="hidden" id="clasificadora_menu" value="<%=area%>">

    <body class="text-sm layout-footer-fixed layout-navbar-fixed sidebar-mini layout-fixed" id="body"   >


        <div class="wrapper">

            <!-- Preloader 
            <div class="preloader flex-column justify-content-center align-items-center">
                <img class="animation__shake" src="img/yemita7.png" alt="AdminLTELogo" height="60" width="60">
            </div>-->

            <!-- Navbar -->
            <nav class="main-header navbar navbar-expand navbar-white navbar-light ">
                <!-- Left navbar links -->
                <ul class="navbar-nav">


                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>

                    <li class="nav-item d-none d-sm-inline-block">
                        <div class="pull-left main-header-temp-info" id="div_temp">

                        </div>
                    </li>


                </ul>
                <ul class="navbar-nav ml-auto">





                    <li class="nav-item">
                        <a class="nav-link"  >
                            <%=nav_area%>
                        </a>
                    </li>
                    <li class="nav-item dropdown ">
                        <!-- ESTO VA EN LA TABLA PADRE MODULO -->

                        <!--------------------------------------------------->   
                        <%=notificacion%>

                    </li>

                    <li class="nav-item dropdown show">
                        <a class="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">
                            <i class="far fa-comments"></i>
                            <span class="badge badge-danger navbar-badge" id="cantidad_mensaje">0</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" style="left: inherit; right: 0px;">
                            <a href="#" class="dropdown-item " id="mensaje_div">


                            </a>
                            <div class="dropdown-divider"></div>



                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#" role="button">
                            <i class="fas fa-th-large"></i>
                        </a>
                    </li> 

                </ul>
            </nav>
            <!-- /.navbar -->

            <!-- Main Sidebar Container -->
            <aside class="main-sidebar elevation-4 sidebar-light-navy ">
                <!-- Brand Logo -->

                <a href="javascript:home();" class="brand-link">
                    <img src="img/cow.png" alt="SGP" class="brand-image img-circle elevation-2">
                    <span class="brand-text">Ita Ka avo</span>
                </a>
                <!-- Sidebar -->
                <div class="sidebar">
                    <!-- Sidebar user panel (optional) -->
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">


                        </div>

                        <div class="info">
                            <a href="#" class="d-block"><%=usuario%></a>
                        </div>
                    </div>

                    <div class="form-inline " id="div_buscador">



                    </div>



                    <nav class="mt-2">
                        <ul id="ul_menu" class="nav nav-pills nav-sidebar flex-column nav-compact nav-child-indent" data-widget="treeview" role="menu" data-accordion="false">
                            <!-- AQUI VA EL MENU GENERADO -->

                        </ul>
                    </nav>
                    <!-- /.sidebar-menu -->
                </div>
            </aside> 

            <div class="content-wrapper" style="min-height: 845px;">
                <section class="content">
                    <div class="container-fluid">

                        <div    id="contenido_row" class="row">

                        </div>
                        <div id="contenedor_principal" class="global">

                        </div>






                        <div class="modal fade bd-example-modal-xl" id="modal_reporte_varios" tabindex="-1" role="dialog"   aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">

                            <iframe width="700" height="900" frameborder="0" scrolling="no"
                                    src="https://grupomaehara-my.sharepoint.com/personal/hvelazquez_yemita_com_py/_layouts/15/Doc.aspx?sourcedoc
                                    ={4ea7d63d-aa51-430a-ae79-139c8406e042}&action=embedview&wdAllowInteractivity=False&Item=Tabla2&wdHideGridlines=True&wdDownloadButton
                                    =True&wdInConfigurator=True"></iframe>

                        </div>


                        <div class="modal fade bd-example-modal-xx" id="modal_version" tabindex="-1" role="dialog"   aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                            <button class="close" type="button"  class="position-relative p-3 bg-navy"  data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                            <div class="modal-dialog modal-xl" role="document">
                                <div class="col-lg-20 ">
                                    <div class="position-relative p-3 bg-navy"  >
                                        <div class="ribbon-wrapper ribbon-xl">
                                            <div class="ribbon bg-warning"  id="ribbon_version">

                                            </div>
                                        </div>
                                        <center><h1>DESCRIPCI&Oacute;N DEL SISTEMA ACTUALIZADO</h1></center>
                                    </div>
                                </div>
                                <div class="modal-content">



                                    <h5><div class="modal-body bg-navy" id="ribbon_titulo"></h5> 

                                    <div class="modal-body" id="ribbon_descripcion"></div> 





                                    <div class="modal-footer">



                                        <a  id="form_pdf_manual" style='color: black' target="_blank"><i class='fa fa-file-pdf-o' style='color: red'></i>  Manual de usuario  </a> 



                                    </div>
                                </div>
                            </div>
                        </div>       






                    </div>

                </section>



                <!-- Control Sidebar -->
                <aside class="control-sidebar control-sidebar-light" style="top: 46.5938px;">
                    <!-- Control sidebar content goes here -->
                    <div class="row">
                        <div class="pt-5 pl-2 pr-2 col-12">

                        </div>
                        <div class="pt-5 pl-2 pr-2 col-12">
                            <div class="form-group">
                                <button class="mx-auto btn bg-navy" style="width:100%;" onclick="modalnuevocambiopassword_ppr()"><i class="fa fa-fw fa-key"></i> Cambio de Contraseña</button>
                            </div>
                        </div>
                        <div class="pl-2 pr-2 col-12">
                            <div class="form-group">
                                <button class="mx-auto btn bg-dark" style="width:100%;" onclick="document.location = 'cruds/control_cerrar_sesion.jsp';"><i class="fa fa-fw fa-power-off"></i> Salir</button>
                            </div>
                        </div>

                        <div class="pl-2 pr-2 col-12">
                            <div class="form-group">

                                <a href="apk/itkv.apk" class="mx-auto btn btn-warning form-control "><i class="fa fa-fw fa-download"></i> Descargar APP</a>

                            </div>
                        </div>
                    </div>
                </aside>
                <div class="modal fade " id="modal_nuevocambio_pass2" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="form-control bg-black" >
                                <h5 class="modal-title" id="exampleModalLabel">CAMBIO USUARIO</h5>
                                <button class="close" type="button"  class="position-relative p-3 bg-navy"  data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <form  id="form_nuevo_password" action="POST"  class="form-control bg-navy" style=" height: 350px"
                                   oninput='passnueva2.setCustomValidity(passnueva2.value != passnueva.value ? "CONTRASEÑAS NO COINCIDEN" : "")'>
                                <div class="modal-body">  

                                    <input  hidden="true" style="width: 100%"  value="<%=id_usuario%>" disabled="true"  id="txt_id_cambiopas" name="txt_id_cambiopas" required class="form-control text-left">
                                    <br>
                                    <input style="width: 100%" type="hidden" disabled="true" value="<%=usuario%>" id="txt_usuario_p" name="txt_usuario_p" class="form-control text-left"> 
                                    <br>
                                    <a>INGRESE CONTRASEÑA ACTUAL</a>
                                    <br>

                                    <input  style="width: 100%" type="password" class="form-control text-left" required  id="passactual" name="passactual"  >
                                    <br>
                                    <a>INGRESE NUEVA CONTRASEÑA</a>
                                    <br>
                                    <input minlength="4" style="width: 100%" type="password" class="form-control text-left" required  id="passnueva" name="passnueva"  >
                                    <a>INGRESAR NUEVA CONTRASEÑA</a>
                                    <br>
                                    <input minlength="4" style="width: 100%" type="password" class="form-control text-left"  required id="passnueva2" name="passnueva2"  >
                                </div>


                                <div class="modal-footer align-right"  >
                                    <input class="btn bg-white" type="button" onclick="nuevocambio_pass_usuario_ppr()"    value="REGISTRAR" >
                                    <input class="btn bg-white" type="button" data-dismiss="modal"    value="CANCELAR" >
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <!-- /.control-sidebar -->
            </div>
            <!-- ./wrapper -->

            <!-- jQuery -->
            <script src="plugins/jquery/jquery.min.js"></script>
            <!-- jQuery UI 1.11.4 -->
            <script src="plugins/jquery-ui/jquery-ui.min.js"></script>
            <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
            <!-- Bootstrap 4 -->
            <script src="plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="plugins/sparklines/sparkline.js"></script>
            <script src="plugins/jqvmap/jquery.vmap.min.js"></script>
            <script src="plugins/jqvmap/maps/jquery.vmap.usa.js"></script>
            <!-- Tempusdominus Bootstrap 4 -->
            <script src="plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js"></script>
            <!-- Summernote -->
            <script src="plugins/summernote/summernote-bs4.min.js"></script>
            <!-- overlayScrollbars -->
            <script src="plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
            <!-- AdminLTE App -->
            <script src="dist/js/adminlte.js"></script>
            <script src="plugins/numeral.min.js" type="text/javascript"></script>

            <script src="plugins/chart_1.js" type="text/javascript"></script>

            <script src="plugins/chartjs-plugin-datalabels.js" type="text/javascript"></script>

            <script src="plugins/selectPicker/bootstrap-select.min.js" type="text/javascript"></script>
            <script src="plugins/jquery.loadingModal.js" type="text/javascript"></script>
            <script src="plugins/sweetalert2/sweetalert2.all.min.js" type="text/javascript"></script>
            <script src="plugins/lib/picker.js"></script>
            <script src="plugins/lib/picker.date.js"></script>
            <script src="plugins/lib/picker.time.js"></script>
            <script src="plugins/lib/legacy.js"></script>
            <script src="plugins/lib/main.js"></script>
            <script src="plugins/lib/rainbow.js"></script>
            <script src="plugins/toastr/toastr.min.js" type="text/javascript"></script>
            <script src="plugins/bootstrap4-toggle.js" type="text/javascript"></script>
            <script src="plugins/DateTimePicker.js" type="text/javascript"></script>
            <script src="plugins/jquery-ui.multidatespicker.js" type="text/javascript"></script>
            <script src="plugins/canvasjs.min.js" type="text/javascript"></script>
            <!-- LIBRERIA DATATABLE CSS--> 
            <script src="plugins/jszip.min.js" type="text/javascript"></script>
            <script type="text/javascript" src="plugins/pdfmake.min.js"></script>
            <script type="text/javascript" src="plugins/vfs_fonts.js"></script>

            <script src="plugins/jquery.dataTables.min.js" type="text/javascript"></script> 
            <script src="plugins/dataTables.bootstrap4.min.js" type="text/javascript"></script>

            <script type="text/javascript" src="plugins/dataTables.autoFill.min.js"></script>
            <script type="text/javascript" src="plugins/autoFill.bootstrap4.min.js"></script>
            <script type="text/javascript" src="plugins/dataTables.buttons.min.js"></script>
            <script type="text/javascript" src="plugins/buttons.bootstrap4.min.js"></script>
            <script type="text/javascript" src="plugins/buttons.colVis.min.js"></script>
            <script type="text/javascript" src="plugins/buttons.html5.min.js"></script>
            <script type="text/javascript" src="plugins/buttons.print.min.js"></script>
            <script src="plugins/dataTables.checkboxes.min.js" type="text/javascript"></script>
            <script src="plugins/dropzone/min/dropzone.min.js"></script>

            <!---------------------------------------------------------------------------------> 
            <script src="plugins/sum().js" type="text/javascript"></script>
            <script src="plugins/jquery.inputmask.bundle.js" type="text/javascript"></script>
            <script src="js/ppr/ppr_funciones.js" type="text/javascript"></script>
            <script src="js/principal.js?v=3.5" type="text/javascript"></script>
            <script src="js/itkv/itkv_funciones.js?v=3.5" type="text/javascript"></script>
            <script src="plugins/autoNumeric.js" type="text/javascript"></script>
            <script src="plugins/compressor.min.js" type="text/javascript"></script>
            <script src="js/control_bidones_itkv/control_bidones_itkv.js?v=3.5" type="text/javascript"></script>
            <script src="js/registro_lluvia/registro_lluvia.js?v=3.5" type="text/javascript"></script>
            <!--para notificaciones toastr-->
            <script src="js/toastr.min.js" type="text/javascript"></script>
            <!--<script src="js/JSdataTablesV2_1_5.js" type="text/javascript"></script>-->
            <!--impresiones en pdf transferencia bidones-->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qz-tray/2.2.1/qz-tray.js"></script>







    </body>
</html> 


