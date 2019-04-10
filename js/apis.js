//pedir ayuda con la promise miUbicacion. 
//Esta bien declarada? Donde deberia ir? Tengo que hacer algo con el reject?  Una mejor forma de setear el default?
//Que onda con el multiple checkbox que se puede iterar como array?
//Falta evitar que se creen dos marcadores en el mismo lugar
//Falta chequear cuando borrar marcadores del mapa. Ver marcador.js


var mapa; // Mapa que vamos a modificar

/* Crear la variable posicionCentral con las coordenadas donde se va a centrar el mapa */
//default
let posicionCentral = {
  "lat" : -34.616653,
  "lng" : -58.441640
};

//Si es posible obtener la ubicacion del usuario, se centra el mapa sobre ella
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
      });
    }
  })
})

miUbicacion.then((miFuncion) => miFuncion());

// Inicializa el mapa con un valor de zoom y una locación en el medio
function inicializarMapa () {
    /* Modificá la variable mapa con el constructor Map().
    Tendrás que asignarle un valor de zoom y
    un centro igual a la variable posicionCentral. */

  if(navigator.platform == 'MacIntel') $('#labelIntermedios i').text('(Hacé Cmd⌘ - Click para seleccionar varios)') 

  mapa = new google.maps.Map(document.getElementById('map'),{
    center: posicionCentral,
    zoom: 12
  })

  geocodificadorModulo.inicializar()
  marcadorModulo.inicializar()
  direccionesModulo.inicializar()
  lugaresModulo.inicializar()
  streetViewModulo.inicializar()
}
