lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

    // Completa las direcciones ingresadas por el usuario a y establece los límites
    // con un círculo cuyo radio es de 20000 metros.
  function autocompletar () {
    /* Completar la función autocompletar(): autocompleta los 4 campos de texto de la
    página (las direcciones ingresables por el usuario).
    Para esto creá un círculo con radio de 20000 metros y usalo para fijar
    los límites de la búsqueda de dirección. El círculo no se debe ver en el mapa. */
    let circulo = new google.maps.Circle({
      map: mapa,
      center: mapa.getCenter(),
      radius: 20000,
      strokeOpacity: 0,
      fillOpacity: 0
    });
    
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

    // Busca lugares con el tipo especificado en el campo de TipoDeLugar

  function buscarCerca (posicion) {
        /* Completar la función buscarCerca  que realice la búsqueda de los lugares
    del tipo (tipodeLugar) y con el radio indicados en el HTML cerca del lugar
    pasado como parámetro y llame a la función marcarLugares. */
    servicioLugares.nearbySearch({
      location: posicion,
      radius: document.getElementById('radio').value,
      type: document.getElementById('tipoDeLugar').value
    }, function (results, status){
      if(status == 'OK') {
        marcadorModulo.marcarLugares(results, status);
      } else if(status == 'ZERO_RESULTS') {
        alert('No se encontraron resultados para esta búsqueda.');
      }
    })
  }
  return {
    inicializar,
    buscarCerca
  }
})()
