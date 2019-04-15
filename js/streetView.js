streetViewModulo = (function () {
  let paronama // 'Visor' de StreetView

  function inicializar () {
    // Crea un panorama en una posición y lo muestra en la página
    panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
      position: mapa.getCenter(),
    });
  }

  // Actualiza la ubicación del Panorama
  function fijarStreetView (ubicacion) {
    panorama.setPosition(ubicacion);
  }

  return {
    inicializar,
    fijarStreetView
  }
})()
