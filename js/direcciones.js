direccionesModulo = (function () {
  let servicioDirecciones // Servicio que calcula las direcciones
  let mostradorDirecciones // Servicio muestra las direcciones
  let mostrandoRuta = false // Indica si hay rutas dibujadas en el mapa

    // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
  function calcularRutasConClic () {
    $('#comoIr').change(function () {
      if($('#desde').val() != '' && $('#hasta').val() != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })

    $('#calcularMuchos').click(function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    let listasLugares = $('.lugares')
    for (let j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener('change', function () {
        if(direccionesModulo.rutaActiva() && $('#desde').val() != '' && $('#hasta').val() != '') {
          direccionesModulo.calcularYMostrarRutas()
        }
      })
    }

    $('#optimizarRuta').change(function() {
      if($('#desde').val() != '' && $('#hasta').val() != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })
  }

  // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  // el parametro esPuntoIntermedio indica si se llamo la funcion desde el input#agregar
  function agregarDireccionEnLista (direccion, coord, esPuntoIntermedio = false) {
    let lugaresIntermedios = document.getElementById('puntosIntermedios')
    let ubicacionTexto = coord.lat() + ',' + coord.lng()

    let haceFaltaAgregar = true
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, ' ') === direccion.replace(/\r?\n|\r/g, ' ')) {
        haceFaltaAgregar = false
      }
    }
    if (haceFaltaAgregar) {
      let opt = document.createElement('option')
      opt.value = ubicacionTexto
      opt.innerHTML = direccion
      lugaresIntermedios.appendChild(opt)
      if (esPuntoIntermedio) {
        opt.selected = true;
        marcadorModulo.crearMarcadorLugarIntermedio(coord);
      }
    } else {
      alert("El punto indicado ya fue marcado.")
    }
  }

  // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  // Props: .direccion .ubicacion
  function agregarDireccionYMostrarEnMapa (props) {
    that = this
    agregarDireccionEnLista(props.direccion, props.ubicacion)
    mapa.setCenter(props.ubicacion)
    streetViewModulo.fijarStreetView(props.ubicacion)
    marcadorModulo.mostrarMiMarcador(props.ubicacion)
  }

  // Props: .direccion .ubicacion
  function agregarDireccion (props) {
    that = this
    agregarDireccionEnLista(props.direccion, props.ubicacion, true)
    mapa.panTo(props.ubicacion)
    if(direccionesModulo.rutaActiva()) {
      direccionesModulo.calcularYMostrarRutas()
    }  
  }

    // Inicializo las variables que muestra el panel y el que calcula las rutas//
  function inicializar () {
    calcularRutasConClic()

    $('#expand-panel').click(expandirPanelDirecciones);

        // Agrega la direccion cuando se presioná enter en el campo agregar
    $('#agregar').keypress(function (e) {
      if (e.keyCode == 13) {
        let props = {
          direccion: document.getElementById('agregar').value
        }
        geocodificadorModulo.usaDireccionProps(props, direccionesModulo.agregarDireccion)
      }
    })
        // Calcula las rutas cuando se presioná enter en el campo desde y hay un valor disitnto a vacío en 'hasta'
    $('#desde').keypress(function (e) {
      if (e.keyCode == 13) {
        geocodificadorModulo.usaDireccionProps({titulo: $('#desde').val(), direccion: $('#desde').val()}, marcadorModulo.mostrarMarcadorEstandar);
        // if (document.getElementById('hasta').value != '') direccionesModulo.calcularYMostrarRutas();
      }
    })

        // Calcula las rutas cuando se presioná enter en el campo hasta y hay un valor disitnto a vacío en 'desde'
    $('#hasta').keypress(function (e) {
      if (e.keyCode == 13) {
        geocodificadorModulo.usaDireccionProps({titulo: $('#hasta').val(), direccion: $('#hasta').val()}, marcadorModulo.mostrarMarcadorEstandar);
        // if (document.getElementById('desde').value != '') direccionesModulo.calcularYMostrarRutas();
      }
    })
    servicioDirecciones = new google.maps.DirectionsService()
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById('directions-panel-summary'),
      // suppressMarkers: true,
    })
  }

    // Calcula la ruta entre los puntos Desde y Hasta con los puntosIntermedios
    // dependiendo de la formaDeIr que puede ser Caminando, Auto o Bus/Subterraneo/Tren
  function calcularYMostrarRutas () {
    if($('#desde').val() != '' && $('#hasta').val() != '') {
      let puntosIntermedios = [];
      let intermediosCheckbox = document.getElementById('puntosIntermedios');
      let optimizarRuta = $('#optimizarRuta').prop('checked');
  
      for(let i = 0; i < intermediosCheckbox.length; i++) {
        if(intermediosCheckbox[i].selected){
          puntosIntermedios.push({
            location: intermediosCheckbox[i].value,
            stopover: true
          })
        }
      }
  
      servicioDirecciones.route({
        origin: $('#desde').val(),
        destination: $('#hasta').val(),
        travelMode: getTravelMode(),
        waypoints: puntosIntermedios,
        optimizeWaypoints: optimizarRuta,
      }, function(results, status){
        if(status == 'OK') {
          mostradorDirecciones.setDirections(results);
          mostradorDirecciones.setMap(mapa);
          mostradorDirecciones.setPanel(document.getElementById('directions-panel-summary'));
          marcadorModulo.noMostrarMarcadores('todos');
          mostrandoRuta = true;
          $('#expand-panel').removeClass('hidden');
        } else if (getTravelMode() == 'TRANSIT' && puntosIntermedios.length) {
          alert('No es posible calcular paradas intermedias en transporte público.');
        } else {
          alert('Error: ' + status);
        }
      })
    } else {
      alert('Debes indicar un origen y un destino.')
    }
  }

  // Oculta las rutas y vuelve a mostrar los marcadores
  function ocultarRutas() {
    mostradorDirecciones.setMap(null);
    mostradorDirecciones.setPanel(null);
    marcadorModulo.mostrarMarcadores('ruta');
    mostrandoRuta = false;
    contraerPanelDirecciones();
    $('#expand-panel').addClass('hidden');
  }

  function expandirPanelDirecciones() {
    $('.input-choose').css('display', 'none');
    $('.directions').css('height', 'calc(100% - 171px)');
    $('#expand-panel').click(contraerPanelDirecciones);
  }

  function contraerPanelDirecciones() {
    $('.input-choose').css('display', 'block');
    $('.directions').css('height', 'calc(100% - 559px)');
    $('#expand-panel').click(expandirPanelDirecciones);
  }

  // Devuelve true si hay rutas dibujadas en el mapa
  function rutaActiva() {
    return mostrandoRuta;
  }

  function getTravelMode() {
    switch ($('#comoIr').val()) {
      case 'Auto': return 'DRIVING';
      case 'Caminando': return 'WALKING';
      case 'Bus/Subterraneo/Tren': return 'TRANSIT';
      default: break;
    }
  }

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas,
    ocultarRutas,
    rutaActiva
  }
}())
