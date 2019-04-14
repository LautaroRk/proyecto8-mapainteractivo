lugaresModulo = (function () {
  let servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites con un círculo
  function autocompletar () {
    //circulo de referencia
    let circulo = new google.maps.Circle({
      map: mapa,
      center: mapa.getCenter(),
      radius: 20000,
      strokeOpacity: 0,
      fillOpacity: 0
    });
    
    //se inicializa el autocompletado en cada uno de los inputs
    new google.maps.places.Autocomplete(document.getElementById('direccion'), {bounds: circulo.getBounds()});
    new google.maps.places.Autocomplete(document.getElementById('desde'), {bounds: circulo.getBounds()});
    new google.maps.places.Autocomplete(document.getElementById('hasta'), {bounds: circulo.getBounds()});
    new google.maps.places.Autocomplete(document.getElementById('agregar'), {bounds: circulo.getBounds()});
  }

    // Inicializo la variable servicioLugares y llamo a la función autocompletar
  function inicializar () {
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

    // Busca lugares con el tipo especificado en el campo de TipoDeLugar dentro del radio indicado
  function buscarCerca (posicion) {
    servicioLugares.nearbySearch({
      location: posicion,
      radius: document.getElementById('radio').value,
      type: document.getElementById('tipoDeLugar').value
    }, function (results, status){
      if(status == 'OK') {
        marcadorModulo.marcarLugares(results, status);
      } else if(status == 'ZERO_RESULTS') {
        swal("Error", "No se encontraron resultados para esta búsqueda", "error")
      } else {
        swal("Error", status, "error")
      }
    })
  }
  return {
    inicializar,
    buscarCerca
  }
})()
