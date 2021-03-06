var dht;
var relay;
var ip;
var urlWeb = "http://domo.ezequielest.com"
document.addEventListener('deviceready', () => {
  console.log("DEVICE IS READY!");    
}, false)

$("#enviarIp").on("click",function(){
    ip = $("#ip").val();
})

//CONTROLADORA DE LUZ
function Relay(){
    this.relay1 = false;
    this.relay2 = false;
    this.pinRelay1 = 4; //Led
    this.pinRelay2 = 5; //Luz

    this.controlador = function(num){

        if (num == 1){

            if (this.relay1  == true){
                this.apagarLuz(this.pinRelay1);
                this.relay1 = false;
            }else{
                this.encenderLuz(this.pinRelay1);
                this.relay1 = true;
            }

        }else{

            if (this.relay2  == true){
                this.apagarLuz(this.pinRelay2);
                this.relay2 = false;
            }else{
                this.encenderLuz(this.pinRelay2);
                this.relay2 = true;
            }

        }
        
    }

    this.apagarLuz = function(num){
        console.log("apagando relay" + num);
        $("#mensaje").html("Apagando relay" + num);

        var promise = new Promise(function(res,rej){
            res(cApagarRelay(num))
        }).then(function(respuesta){
            $("#mensaje").html("Relay" + num + "apagada");
        });
    }

    this.encenderLuz = function(num){
        console.log("encendiendo relay" + num);
        $("#mensaje").html("Encendiendo relay" + num);

        var promise = new Promise(function(res,rej){
            
            res(cEncenderRelay(num))
        }).then(function(respuesta){
            console.log('respuesta luz encendida '+ respuesta);
            $("#mensaje").html("Relay" + num + "encendido");
        });
    }
}

function cApagarRelay(num){
    return $.ajax({
        url: 'http://' + datosTemp[0].ip +'/apagarLuz?luz='+num,
        //url: 'http://192.168.1.'+ip+'/apagarLuz?luz='+num,
        method: "POST"
    }).done(function(respuesta){
        return respuesta
    });
}

function cEncenderRelay(num){
    return $.ajax({
        url: 'http://' + datosTemp[0].ip +'/encenderLuz?luz='+num,
        //url: 'http://192.168.1.'+ip+'/encenderLuz?luz='+num,
        method: "POST"
    }).done(function(respuesta){
        return respuesta
    });
}

/// FIN CONTROLADORA LUZ


//CONTROLADOR DE SENSOR DHT
var Dht = function(){
    this.datos = new Array();
    this.temperatura = 0;
    this.humedad= 0;
  
    this.obtenerDatos = function(){
      var promise = new Promise(function(res,rej){
        res(obtenerDhtAjax())
      }).then(function(respuesta){
          datosTemp = JSON.parse(respuesta)
          console.log(datosTemp);
            
            $("#estadoConexion").html("<span class='badge badge-positive'>Conectado</span>");
            
      }).catch(function(){
          $("#estadoConexion").html("<span class='badge badge-negative'>Desconectado</span>");
      })
    }
  };
  
  var datag;

var obtenerDhtAjax = function(){
  return $.ajax({
    url: urlWeb + "/obtenerInfo.php",
    method: "POST"
  }).done(function(data){
    return data
  });
}

function obtenerLed(){
  axios.get('http://' + global[0].ip +'/encenderLed?led=4')
  .then(response => {
      this.message = "Led encendido"
  })
  .catch(error =>{
      console.log(error);
  })
}
//// FIN DE CONTROLADOR DE SENSOR DHT


function obtenerInfoDHT(){
  /*obtenerInfoDHT: function(){
    axios.get('http://' + global[0].ip +'/obtenerTemHum')
    .then(response => {
        console.log('response = ');
        console.log(response);*/
        /*this.message = response
        this.temperatura=respuesta.temp;
        this.humedad=respuesta.hum;*/
    /*})
    .catch(error =>{
        console.log(error);
    })
}*/
}

/*var temperatura = echarts.init(document.getElementById('temp'));
var humedad = echarts.init(document.getElementById('hum'));

optionTemperatura = {
    tooltip : {
        formatter: "{a} <br/>{b} : {c}º"
    },
    toolbox: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: 'Te',
            type: 'gauge',
            detail: {formatter:'{value}º'},
            data: [{value: 50, name: 'Temperatura'}]
        }
    ]
};


optionHumedad = {
    tooltip : {
        formatter: "{a} <br/>{b} : {c}º"
    },
    toolbox: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: 'Hu',
            type: 'gauge',
            detail: {formatter:'{value}%'},
            data: [{value: 50, name: 'Humedad'}]
        }
    ]
};

optionTemperatura.series[0].data[0].value = 0;
optionHumedad.series[0].data[0].value = 0;*/

var actualizarDHT = function(){
    dht = new Dht();
    datos = dht.obtenerDatos();
    return datos;
}

var global;
var count = 0;

relay = new Relay();

setInterval(function () {
var promise = new Promise(function(res,rej){
    res(actualizarDHT());
}).then(function(data){
    console.log(data);
    global = data;
    count++;
    if (count > 1)
    {
        $(".tabla-general").css("display","block");
        $("#temperatura").html("<h4>" + datosTemp[0].temp + "&deg;</h4>");
        $("#humedad").html("<h4>" + datosTemp[0].hum + "%</h4>");

        /*optionTemperatura.series[0].data[0].value = datosTemp[0].temp;
        optionHumedad.series[0].data[0].value = datosTemp[0].hum;*/

        /*temperatura.setOption(optionTemperatura, true);
        humedad.setOption(optionHumedad, true);*/
    }
})
},5000);