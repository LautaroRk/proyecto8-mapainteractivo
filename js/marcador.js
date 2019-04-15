marcadorModulo = (function () {
  let miMarcador // El marcador de la direccion buscada
  let limites // Límites del mapa
  let infoVentana // La ventana con información
  let marcadoresRuta = [] // Los marcadores de la ruta
  let marcadoresLugaresCercanos = [] // Todos los marcadores de la búsqueda lugares cercanos

  let marcadoresLugaresBuscados = []
  let marcadoresPuntosIntermedios = []

  // Crea un marcador y lo muestra en el mapa
  function mostrarMiMarcador (ubicacion) {
    miMarcador = new google.maps.Marker({
      map: mapa,
      position: ubicacion,
      animation: google.maps.Animation.DROP,
      title: $('#direccion').val()
    });
    clickDerechoMarcador(miMarcador);
    clickMarcadorStreetView(miMarcador);

    let esPrimerMarcador = !marcadoresLugaresBuscados.length;
    let noEstaRepetido = esPrimerMarcador ? true : marcadoresLugaresBuscados.every(marcador => !marcadorModulo.sonIguales(marcador, miMarcador));
    if(noEstaRepetido) marcadoresLugaresBuscados.push(miMarcador);
    
    console.log(marcadoresLugaresBuscados)
  }

  //Props: .titulo .ubicacion 
  function mostrarMarcadorEstandar(props) {
    let marcador = new google.maps.Marker({
      map: direccionesModulo.rutaActiva() ? null : mapa,
      position: props.ubicacion,
      animation: google.maps.Animation.DROP,
      title: props.titulo
    });
    clickDerechoMarcador(marcador);
    clickMarcadorStreetView(marcador);

    streetViewModulo.fijarStreetView(props.ubicacion);
    mapa.panTo(props.ubicacion);

    let esPrimerMarcador = !marcadoresLugaresBuscados.length;
    let noEstaRepetido = esPrimerMarcador ? true : marcadoresLugaresBuscados.every(unMarcador => !marcadorModulo.sonIguales(unMarcador, marcador));
    if(noEstaRepetido) marcadoresLugaresBuscados.push(marcador);
  }

  // Crea el marcador de ubicacion
  function mostrarMiUbicacion(ubicacion) {
    miMarcador = new google.maps.Marker({
      map: mapa,
      position: ubicacion,
      icon: './imagenes/here.png',
      title: 'Mi ubicación',
      animation: google.maps.Animation.BOUNCE
    })
    marcadoresLugaresBuscados.push(miMarcador);
    clickMarcadorStreetView(miMarcador);
    streetViewModulo.fijarStreetView(ubicacion);
  }
  
  function crearMarcadorLugarIntermedio(ubicacion) {
    let marcador = new google.maps.Marker({
      map: mapa,
      icon: './imagenes/map-pin.png',
      position: ubicacion,
      animation: google.maps.Animation.DROP,
      title: $('#agregar').val(),
      visible: true
    })
    clickDerechoMarcador(marcador);
    clickMarcadorStreetView(marcador);
    streetViewModulo.fijarStreetView(ubicacion);

    marcadoresPuntosIntermedios.push(marcador);

    $('#agregar').val('')
  }

  // Crea event listener para click derecho sobre el marcador
  function clickDerechoMarcador(marcador) {
    google.maps.event.addListener(marcador, 'rightclick', function () {
      //Se elimina el marcador del mapa
      this.setMap(null);

      //Se elimina el lugar de la lista de puntos intermedios
      let lugaresIntermedios = document.getElementById('puntosIntermedios')
      for (i = 0; i < lugaresIntermedios.length; ++i) {
        if (lugaresIntermedios.options[i].value == this.getPosition().toString().replace(/[( )]/g, '')) {
          lugaresIntermedios.options[i] = null;
        }
      }

      //Se elimina el marcador del array correspondiente
      let index = marcadoresPuntosIntermedios.indexOf(marcador);
      if (index > -1) marcadoresPuntosIntermedios.splice(index, 1);
      let index2 = marcadoresLugaresBuscados.indexOf(marcador);
      if (index2 > -1) marcadoresLugaresBuscados.splice(index2, 1);
    });
  }

  // Agrega event listener para mostrar el lugar en el street view al clickear un marcador
  function clickMarcadorStreetView(marcador) {
    google.maps.event.addListener(marcador, 'click', function () {
      streetViewModulo.fijarStreetView(marcador.getPosition());
    });
  }

  // Devuelve true si ambos marcadores tienen la misma posicion
  function sonIguales(marcadorA, marcadorB) {
    let posicionA = marcadorA.getPosition();
    let posicionB = marcadorB.getPosition();

    return posicionA.equals(posicionB);
  }

  // Agrega la dirección del marcador en la lista de Lugares Intermedios
  function agregarDireccionMarcador (marcador) {
    // console.log(marcador.getPosition().lat() + ',' + marcador.getPosition().lng());
    let marcadorLatLng = new google.maps.LatLng({ lat: marcador.getPosition().lat(), lng: marcador.getPosition().lng() })
    let props = {
      direccion: marcador.getTitle(),
      ubicacion: marcadorLatLng
    }
    direccionesModulo.agregarDireccion(props);
  }

  // Agrega al mapa todos los marcadores.
  function marcadoresEnMapa (marcadores, mapa) {
    for (let i = 0; i < marcadores.length; i++) {
      marcadores[i].setMap(mapa)
    }
  }

  // Muestra todos los marcadores. Por ahora no la uso
  function mostrarMarcadores (marcadores) {
    if (marcadores === 'ruta') {
      marcadoresEnMapa(marcadoresLugaresBuscados, mapa);
      marcadoresLugaresBuscados[0].setAnimation(google.maps.Animation.BOUNCE);
      marcadoresEnMapa(marcadoresPuntosIntermedios, mapa);
    } else {
      marcadoresEnMapa(marcadores, mapa)
    }
  }

  // Saca los marcadores del mapa, pero siguen en el Array marcadores.
  function noMostrarMarcadores (marcadores) {
    if (marcadores === 'todos') {
      marcadoresEnMapa(marcadoresLugaresBuscados, null);
      marcadoresEnMapa(marcadoresPuntosIntermedios, null);
      marcadoresEnMapa(marcadoresLugaresCercanos, null);
      marcadoresLugaresCercanos = []
    } else {
      marcadoresEnMapa(marcadores, null);
    }
  }

  // Borra todos los marcadores del mapa y del array.
  function borrarMarcadores (marcadores) {
    noMostrarMarcadores(marcadores)
    marcadores = []
  }

  // Cuando cambia el elemento "tipoDeLugar" marco todos lugares cerca
  // del lugar indicado por MiMarcador
  let tipoDeLugar = document.getElementById('tipoDeLugar')
  tipoDeLugar.addEventListener('change', function () {
    if (tipoDeLugar.value != '') {
      marcadorModulo.marcar()
    }
  })

  // Cuando cambia el elemento "radio" marco todos lugares cerca
  // del lugar indicado por MiMarcador con el nuevo radio

  let rango = document.getElementById('radio')
  rango.addEventListener('change', function () {
    marcadorModulo.marcar()
  })

  rango.addEventListener('input', function () {
    mostrarValor(rango.value)
  })

  // Crea marcador que al hacer click muestra la información del lugar.
  crearMarcador = function (lugar) {
    let icono = {
      url: lugar.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    }

    let marcador = new google.maps.Marker({
      map: mapa,
      position: lugar.geometry.location,
      title: lugar.name + '\n' + lugar.vicinity,
      icon: icono
    })
    marcadoresLugaresCercanos.push(marcador);

    google.maps.event.addListener(marcador, 'dblclick', function () {
      if($('#hasta').val() == '') {
        $('#hasta').val(marcador.title);
        marcadoresLugaresBuscados.push(marcador);
        direccionesModulo.calcularYMostrarRutas();
      } else {
        marcadoresPuntosIntermedios.push(marcador);
        agregarDireccionMarcador(marcador);
        direccionesModulo.calcularYMostrarRutas();
      }
    })

    google.maps.event.addListener(marcador, 'rightclick', function () {
      let indice
      for (let i = 0; i < marcadoresLugaresCercanos.length; i++) {
        if (marcadoresLugaresCercanos[i] == marcador) {
          marcadoresLugaresCercanos[i].setMap(null)
          indice = i
          marcadoresLugaresCercanos.splice(indice, 1)
        }
      }
    })

    // Cuando haces clic sobre el marcador, muestra la foto,
    // el nombre y la valuación del lugar si es que lo tienen.
    let lugarLoc = lugar.geometry.location
    google.maps.event.addListener(marcador, 'click', function () {
      streetViewModulo.fijarStreetView(lugarLoc)
      let valuacion = 'No tiene'
      if (lugar.rating) {
        valuacion = lugar.rating.toString()
      }

      let url;
      // agrega información del lugar en la ventana del marcador
      if (lugar.photos) {
        url = lugar.photos[0].getUrl({
          'maxWidth': 80,
          'maxHeight': 80
        })
      }
      let nombre = lugar.name
      let nombreLugar = lugar.vecinity
      if (url) {
        if (nombreLugar) {
          infoVentana.setContent('<h3>' + nombre + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + valuacion + '</p>' + '<p> Direccion: ' + nombreLugar + '</p>')
        } else {
          infoVentana.setContent('<h3>' + nombre + '</h3>' + '<img src=' + url + '>' + '<p> Rating: ' + valuacion + '</p>')
        }
      } else {
        infoVentana.setContent('<h3>' + nombre + '</h3>')
      }

      infoVentana.open(mapa, this)
    })
  }

  // Extiende los limites a partir del lugar que se agrega
  function extenderLimites (lugar) {
    if (lugar.geometry.viewport) {
      limites.union(lugar.geometry.viewport)
    } else {
      limites.extend(lugar.geometry.location)
    }
    mapa.fitBounds(limites)
  }

  // Crea un objeto InfoWindow que será la ventana donde se mostrará la información
  // Crea la variable limites que contiene los límites del mapa
  // Llama a la funcion agregarMarcadoresClicCargarDirecciones() para que marque a los lugares
  // cuando se hace clic en AgregarDirecciones
  function inicializar () {
    infoVentana = new google.maps.InfoWindow()
    limites = new google.maps.LatLngBounds()
  }

  // Función que devuelve true si ya se declaro la variable miMarcador
  function existeMiMarcador () {
    return miMarcador != undefined
  }

  // Devuelve la posicion de la variable miMarcador
  function damePosicion () {
    return miMarcador.getPosition()
  }

  // Agrego el marcador con la ruta. Le asigna las letras correspondientes al marcador.
  // Al hacer click en el marcador se fija el StreetView en la posición de este.
  function agregarMarcadorRuta (direccion, letra, esInicial) {
    borrarMarcadores(marcadoresRuta)

    let zIndice = 1
    if (esInicial) {
      zIndice = 2
    }

    function agregarMarcadorConStreetView (props) {
      let marcador = new google.maps.Marker({
        map: mapa,
        position: props.ubicacion,
        label: letra,
        animation: google.maps.Animation.DROP,
        draggable: false,
        zIndex: zIndice

      })
      limites.extend(ubicacion)
      google.maps.event.addListener(marcador, 'click', function () {
        streetViewModulo.fijarStreetView(marcador.position)
      })

      marcadoresRuta.push(marcador)
    }
    geocodificadorModulo.usaDireccionProps({direccion: direccion}, agregarMarcadorConStreetView)
    mapa.fitBounds(limites)
  }

  // Marca los lugares que están en el arreglo resultados y
  // extiende los límites del mapa teniendo en cuenta los nuevos lugares
  function marcarLugares (resultados, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < resultados.length; i++) {
        crearMarcador(resultados[i])
        extenderLimites(resultados[i])
      }
    }
    mapa.setCenter(miPosicion)
    mapa.setZoom(16)
  }

  // Marco los lugares cerca de mi posición
  function marcar () {
    borrarMarcadores(marcadoresLugaresCercanos)
    if (marcadorModulo.existeMiMarcador()) {
      miPosicion = damePosicion()
    } else {
      miPosicion = posicionCentral;
    }
    lugaresModulo.buscarCerca(miPosicion)
    // cambio el centro del mapa a miPosicion
    mapa.panTo(miPosicion)
  }

  return {
    inicializar,
    existeMiMarcador,
    damePosicion,
    mostrarMiMarcador,
    mostrarMarcadorEstandar,
    agregarMarcadorRuta,
    borrarMarcadores,
    marcarLugares,
    marcar,
    mostrarMiUbicacion,
    sonIguales,
    crearMarcadorLugarIntermedio,
    clickDerechoMarcador,
    noMostrarMarcadores,
    mostrarMarcadores
  }
})()
