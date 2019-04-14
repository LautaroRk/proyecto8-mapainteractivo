geocodificadorModulo = (function () {
  let geocodificador // Geocodificador que dada una dirección devuelve una coordenada

  // Obtiene un objeto props, le agrega la ubicacion (LatLng) y llama al callback con las props completas
  // El objeto props debe incluir una direccion
  function usaDireccionProps (props, callback) {
    geocodificador.geocode( {'address': props.direccion}, function(results, status) {
      if (status == 'OK') {
        props.ubicacion = results[0].geometry.location;
        callback(props);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Recibe una coordenada y devuelve la direccion en string
  function obtenerDireccionString(LatLng, callback) {
    geocodificador.geocode({'location': LatLng}, function(results, status){
      if(status == 'OK' && results[0]) {
        callback(results[0].formatted_address);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })

    // INTENTO FALLIDO DE CREAR LA PROMESA DENTRO DE LA FUNCION

    // new Promise((resolve) => {
    //   resolve(function() {
    //     geocodificador.geocode({'location': LatLng}, function(results, status){
    //       if(status == 'OK' && results[0]) {
    //         callback(results[0].formatted_address);
    //       } else {
    //         alert('Geocode was not successful for the following reason: ' + status);
    //       }
    //     });
    //   });
    // }).then(actualizarStringDireccion => actualizarStringDireccion());
  };

    // Inicializo el geocoder que obtiene las corrdenadas a partir de una dirección
    // La variable dirección es igual al texto ingresado por el usuario
    // Llama a la función usaDirecciin para agregarla a los listados y mostrarlo en el mapa
  function inicializar () {
    let that = this
    geocodificador = new google.maps.Geocoder()

        // cuando se presiona la tecla enter en el campo direccion, se agrega la dirección y se muestra en el mapa
    document.querySelector('#direccion').addEventListener('keypress', function (e) {
      let key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        let props = {
          direccion: document.getElementById('direccion').value,
          titulo: document.getElementById('direccion').value
        }
        that.usaDireccionProps(props, direccionesModulo.agregarDireccionYMostrarEnMapa)
        direccionesModulo.ocultarRutas()
      }
    })
  }

  return {
    usaDireccion,
    usaDireccionProps,
    inicializar,
    obtenerDireccionString
  }
})()
