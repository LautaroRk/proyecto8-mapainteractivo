// Ver como mejorar las funciones callback y aplicar encadenamiento de promises en miUbicacion?
// Como se retorna una promise en una funcion? Ver intento fallido en geocodificador.obtenerDireccionString

let mapa; 

//ubicacion default
let posicionCentral = {
  "lat" : -34.616653,
  "lng" : -58.441640
};

// Si es posible obtener la ubicacion del usuario, se centra el mapa sobre ella, 
// se agrega un marcador especial y se acerca el zoom
let miUbicacion = new Promise((resolve, reject) => {
  resolve(function(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(ubicacion){

        posicionCentral = {
          "lat" : ubicacion.coords.latitude,
          "lng" : ubicacion.coords.longitude
        };
        
        mapa.panTo(posicionCentral);
        mapa.setZoom(15);
        streetViewModulo.fijarStreetView(posicionCentral);
        marcadorModulo.mostrarMiUbicacion(posicionCentral);
        $('#desde').val('' + posicionCentral.lat + ',' + posicionCentral.lng);

        // Se reemplaza la ubicacion en coordenadas por un string legible
        new Promise((resolve, reject) => {
          resolve(function() {
            geocodificadorModulo.obtenerDireccionString(posicionCentral, function(direccion) {
              $('#desde').val(direccion);
            });
          });
        }).then(actualizarStringDireccion => actualizarStringDireccion());
      });
    }
  })
}).then(actualizarUbicacion => actualizarUbicacion());

// Inicializa el mapa con un valor de zoom y una locación en el medio
function inicializarMapa () {
  if(navigator.platform == 'MacIntel') $('#intermedios-container .aclaracion span').text('Cmd⌘ + Click') 

  mapa = new google.maps.Map(document.getElementById('map'),{
    center: posicionCentral,
    zoom: 12,
    minZoom: 3
  })

  geocodificadorModulo.inicializar()
  marcadorModulo.inicializar()
  direccionesModulo.inicializar()
  lugaresModulo.inicializar()
  streetViewModulo.inicializar()
}
