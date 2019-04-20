let mapa; 
  
// Inicializa el mapa con un valor de zoom y una locación en el medio
function inicializarMapa () {
  if(navigator.platform == 'MacIntel') $('#intermedios-container .aclaracion span').text('Cmd⌘ + Click') 

  // Ubicacion default (Caballito, centro geografico de Buenos Aires)
  let posicionCentral = {
    "lat" : -34.616653,
    "lng" : -58.441640
  };

  mapa = new google.maps.Map(document.getElementById('map'),{
    center: posicionCentral,
    zoom: 12,
    minZoom: 3
  });

  // Se obtiene la ubicacion del usuario y se coloca la formatted_address em el campo #desde
  geocodificadorModulo.obtenerUbicacion().then(coordenadas => {
    mapa.panTo(coordenadas);
    mapa.setZoom(15);
    streetViewModulo.fijarStreetView(coordenadas);
    marcadorModulo.mostrarMiUbicacion(coordenadas);
    geocodificadorModulo.obtenerDireccionString(coordenadas, function(direccion) {
      $('#desde').val(direccion);
    });
  }).catch(/* error handler */)

  geocodificadorModulo.inicializar()
  marcadorModulo.inicializar()
  direccionesModulo.inicializar()
  lugaresModulo.inicializar()
  streetViewModulo.inicializar()
}
