
/* ---------- */
/* JAVASCRIPT */
/* ---------- */


// DECLARACIÓN DE VARIABLES
// ------------------------
	var xmlDoc; // con funciones fuera, debemos declarar la variable no en local sino en global

	var formElement=null;

	// Variables del temporizador
	var aux; // variable de control
	var interval;
	var dias=0;
	var horas=0;
	var minutos=5;
	var segundos=0;

	var titulos=[];
	var ntitulos;
	var tipos=[];

	var pregunta;
	var identificador;

	var opciones=[];
	var opciones_01=[], opciones_02=[], opciones_03=[], opciones_04=[], opciones_05=[];
	var opciones_06=[], opciones_07=[], opciones_08=[], opciones_09=[], opciones_10=[];
	var opciones_11=[], opciones_12=[], opciones_13=[];

	var respuestas=[];
	var respuestas_01=[], respuestas_02=[], respuestas_03=[], respuestas_04=[], respuestas_05=[];
	var respuestas_06=[], respuestas_07=[], respuestas_08=[], respuestas_09=[], respuestas_10=[];
	var respuestas_11=[], respuestas_12=[], respuestas_13=[];

	// Variables contadores
	var nvacias;
	var nseleccionadas;
	var nrespuestas_correctas;
	var nrespuestas_incorrectas;
	var npreguntas_acertadas;

	// Variables para resolución
	var vacio = "</br><span>No has introducido o seleccionado ninguna respuesta.</span>";
	var visto_verde = " <img src='img/visto_verde_20px.png'/>";
    var aspa_roja = " <img src='img/aspa_roja_20px.png'/>";
    var nota;


// MÉTODO MAIN. Se ejecuta al cargar la página.
// --------------------------------------------
window.onload = function(){ 
   
    // Lee el fichero *.xml del servidor (por http) y escribe el contenido en el fichero *.html.
    // -----------------------------------------------------------------------------------------
     var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
               gestionarXml(this);
          }
     }
     //xhttp.open("GET", "https://rawgit.com/mnibir/HistoryQuestions/master/xml/preguntas.xml", true);   
     xhttp.open("GET", "xml/preguntas.xml",true);
     
     xhttp.send();


    // Temporizador
    // ------------
    temporizador(dias, horas, minutos, segundos);
 

    // Corrige el contenido del formulario. Se ejecuta al pulsar el botón "submit".
    // ----------------------------------------------------------------------------
    formElement=document.getElementById('myform');    
     
    formElement.onsubmit=function(){
    	if(aux){
			reponerTitulos();
			reponerNota();
			// Corregir sin mostrar si una respuesta es o no correcta.
			corregirPrevio();
			if(nvacias == 0){
				// Corregir mostrando si una respuesta es o no correcta.
				corregir();
				notaFinal();
		  	}
		  	else{
		  		window.alert("Tienes preguntas sin responder todavía.");
		  	}			
        }
		else{
			window.alert("¡COMIENZA DE NUEVO!");
		}
		return false; // para que no recargue la página de forma automática
    }
	
    formElement.onreset=function(){
          location.reload(); 
    }
}


// Método para que no haya que pulsar la tecla de control en la selección múltiple.
// --------------------------------------------------------------------------------
window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
    	e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}


// Método que lee los datos del fichero *.xml y los escribe en el fichero *.html.
// ------------------------------------------------------------------------------
function gestionarXml(dadesXml){
    xmlDoc = dadesXml.responseXML;     
    mostrarTitulos();
    mostrarPreguntas();   
}


// Método que lee los títulos del fichero *.xml y escribe los títulos en las etiquetas h3 del fichero *.html.
// También lee qué tipo de pregunta es cada una.
// ----------------------------------------------------------------------------------------------------------
function mostrarTitulos(){
	ntitulos = xmlDoc.getElementsByTagName('title').length;
	for (var i=0; i<ntitulos; i++){
	  titulos[i]=xmlDoc.getElementsByTagName('title')[i].innerHTML;
	  tipos[i]=xmlDoc.getElementsByTagName('type')[i].innerHTML;
	  document.getElementsByTagName('form')[0].innerHTML += "<h3>" + titulos[i] + "</h3><div></div>";
	}
}


// Método que inicializa las matrices de información de una pregunta.
//-------------------------------------------------------------------
function inicializarPregunta(){
    opciones = [];
    respuestas = [];
}


// Método que inicializa el número de opciones seleccionadas.
// ----------------------------------------------------------
function inicializarNSeleccionadas(){
    nseleccionadas = 0;
}


// Método que inicializa el número de respuestas correctas e incorrectas a 0, respectivamente.
// ------------------------------------------------------------------------------------------
function inicializarNRespuestas(){
    nrespuestas_correctas = 0;
    nrespuestas_incorrectas = 0;
}


// Método que inicializa el número de preguntas acertadas.
// -------------------------------------------------------
function inicializarNAcertadas(){
    npreguntas_acertadas = 0;
}


// Método que inicializa el número de preguntas sin responder.
// -----------------------------------------------------------
function inicializarNVacias(){
	nvacias = 0;
}


// Método que genera el identificador asociado a cada pregunta.
// ------------------------------------------------------------
function identificadorPregunta(){
	if(pregunta<10){
	  identificador = 'jklm_00' + pregunta;
	}
	else{
	  identificador = 'jklm_0' + pregunta;
	}
}


// Método que lee la información del fichero *.xml, guarda dicha información y la muestra en el fichero *.html.
// ------------------------------------------------------------------------------------------------------------
function mostrarPreguntas(){
	for(var i=0; i<ntitulos; i++){
	  pregunta = i+1;

	  identificadorPregunta();

	  switch(tipos[i]){
	       case "radio": preguntaRadio(); break;
	       case "text": preguntaTexto(); break;
	       case "checkbox": preguntaCheckbox(); break;
	       case "select": preguntaSelect(); break;
	       case "multiple": preguntaSelectMultiple(); break;
	       default: window.alert("Tipo de pregunta no clasificada.");  break;            
	  }

	  switch(pregunta){
	       case 1:  opciones_01 = opciones;  respuestas_01 = respuestas; break;
	       case 2:  opciones_02 = opciones;  respuestas_02 = respuestas; break;
	       case 3:  opciones_03 = opciones;  respuestas_03 = respuestas; break;
	       case 4:  opciones_04 = opciones;  respuestas_04 = respuestas; break;
	       case 5:  opciones_05 = opciones;  respuestas_05 = respuestas; break;
	       case 6:  opciones_06 = opciones;  respuestas_06 = respuestas; break;
	       case 7:  opciones_07 = opciones;  respuestas_07 = respuestas; break;
	       case 8:  opciones_08 = opciones;  respuestas_08 = respuestas; break;
	       case 9:  opciones_09 = opciones;  respuestas_09 = respuestas; break;
	       case 10: opciones_10 = opciones;  respuestas_10 = respuestas; break;
	       case 11: opciones_11 = opciones;  respuestas_11 = respuestas; break;
	       case 12: opciones_12 = opciones;  respuestas_12 = respuestas; break;
	       case 13: opciones_13 = opciones;  respuestas_13 = respuestas; break;
	       default: window.alert("Número de pregunta incorrecto.");  break;
	  }
	}
}


// Método que lee una pregunta de tipo radio.
// ------------------------------------------
function preguntaRadio(){
	inicializarPregunta();

	var nopciones = xmlDoc.getElementById(identificador).getElementsByTagName('option').length;
	for (var i=0; i<nopciones; i++){
	  opciones[i]=xmlDoc.getElementById(identificador).getElementsByTagName('option')[i].innerHTML;
	  document.getElementsByTagName('div')[pregunta-1].innerHTML += "<input type='radio' id = '" + identificador + "_" +  i + "' name=" + identificador + " value='" + i + "'><label for = '" + identificador + "_" + i + "'>" + opciones[i] + "</label><br>";
	}

	var nrespuestas = xmlDoc.getElementById(identificador).getElementsByTagName('answer').length;
	for (var i=0; i<nrespuestas; i++){
	  respuestas[i]=xmlDoc.getElementById(identificador).getElementsByTagName('answer')[i].innerHTML;
	}
}


// Método que lee una pregunta de tipo texto.
// ------------------------------------------
function preguntaTexto(){
	inicializarPregunta();

	opciones = [];
	document.getElementsByTagName('div')[pregunta-1].innerHTML += "Respuesta: <input type='text' name=" + identificador + "><br>";

	var nrespuestas = xmlDoc.getElementById(identificador).getElementsByTagName('answer').length;
	for (var i=0; i<nrespuestas; i++){
	  respuestas[i]=xmlDoc.getElementById(identificador).getElementsByTagName('answer')[i].innerHTML;
	}
}


// Método que lee una pregunta de tipo checkbox.
// ---------------------------------------------
function preguntaCheckbox(){
	inicializarPregunta();

	var nopciones = xmlDoc.getElementById(identificador).getElementsByTagName('option').length;
	for (var i=0; i<nopciones; i++){
	  opciones[i]=xmlDoc.getElementById(identificador).getElementsByTagName('option')[i].innerHTML;
	  document.getElementsByTagName('div')[pregunta-1].innerHTML += "<input type='checkbox' id = '" + identificador + "_" + i + "' name=" + identificador + " value='" + i + "'><label for = '" + identificador + "_" + i + "'>" + opciones[i] + "</label><br>";          
	}

	var nrespuestas = xmlDoc.getElementById(identificador).getElementsByTagName('answer').length;
	for (var i=0; i<nrespuestas; i++){
	  respuestas[i]=xmlDoc.getElementById(identificador).getElementsByTagName('answer')[i].innerHTML;
	}   
}


// Método que lee una pregunta de tipo select.
// -------------------------------------------
function preguntaSelect(){
	inicializarPregunta();

	var nopciones = xmlDoc.getElementById(identificador).getElementsByTagName('option').length;
	var select =  document.createElement('select');
	select.name = identificador;

	for (var i = 0; i < nopciones; i++) {
	  opciones[i]=xmlDoc.getElementById(identificador).getElementsByTagName('option')[i].innerHTML;
	  var option = document.createElement('option');
	  option.text = opciones[i];
	  option.value = i;
	  select.options.add(option);
	}
	  i = nopciones;
	  opciones[i]="";
	  var option = document.createElement('option');
	  option.text = opciones[i];
	  option.value = opciones[i];
	  /*option.selected = 'selected';*/
	  option.setAttribute("selected","selected");
	  select.options.add(option);

	document.getElementsByTagName('div')[pregunta-1].appendChild(select);

	var nrespuestas = xmlDoc.getElementById(identificador).getElementsByTagName('answer').length;
	for (var i=0; i<nrespuestas; i++){
	  respuestas[i]=xmlDoc.getElementById(identificador).getElementsByTagName('answer')[i].innerHTML;
	}
}


// Método que lee una pregunta de tipo select múltiple.
// ----------------------------------------------------
function preguntaSelectMultiple(){
	inicializarPregunta();

	var nopciones = xmlDoc.getElementById(identificador).getElementsByTagName('option').length;
	var select =  document.createElement('select');
	/*select.multiple = 'multiple';*/
	select.setAttribute("multiple","multiple");
	select.name = identificador;

	for (var i = 0; i < nopciones; i++) {
	  opciones[i]=xmlDoc.getElementById(identificador).getElementsByTagName('option')[i].innerHTML;
	  var option = document.createElement('option');
	  option.text = opciones[i];
	  option.value = i;
	  select.options.add(option);
	}
	document.getElementsByTagName('div')[pregunta-1].appendChild(select);

	var nrespuestas = xmlDoc.getElementById(identificador).getElementsByTagName('answer').length;
	for (var i=0; i<nrespuestas; i++){
	  respuestas[i]=xmlDoc.getElementById(identificador).getElementsByTagName('answer')[i].innerHTML;
	}
}


// Método que determina si las respuestas son o no correctas.
// ----------------------------------------------------------
function corregirPrevio(){
	inicializarNAcertadas();
	inicializarNVacias();

	for (var i = 0; i<ntitulos; i++) {
	  pregunta = i+1;        

	  identificadorPregunta();

	  switch(pregunta){
	       case 1:  opciones = opciones_01;  respuestas = respuestas_01; break;
	       case 2:  opciones = opciones_02;  respuestas = respuestas_02; break;
	       case 3:  opciones = opciones_03;  respuestas = respuestas_03; break;
	       case 4:  opciones = opciones_04;  respuestas = respuestas_04; break;
	       case 5:  opciones = opciones_05;  respuestas = respuestas_05; break;
	       case 6:  opciones = opciones_06;  respuestas = respuestas_06; break;
	       case 7:  opciones = opciones_07;  respuestas = respuestas_07; break;
	       case 8:  opciones = opciones_08;  respuestas = respuestas_08; break;
	       case 9:  opciones = opciones_09;  respuestas = respuestas_09; break;
	       case 10: opciones = opciones_10;  respuestas = respuestas_10; break;
	       case 11: opciones = opciones_11;  respuestas = respuestas_11; break;
	       case 12: opciones = opciones_12;  respuestas = respuestas_12; break;
	       case 13: opciones = opciones_13;  respuestas = respuestas_13; break;
	       default: window.alert("Número de pregunta incorrecto.");  break;
	  }        

	  switch(tipos[i]){
	       case "radio": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionChequeo();
	            break;
	       case "checkbox": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionChequeo();
	            break;     
	       case "text": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionTexto();
	            break;
	       case "select": 
	            opciones = document.getElementsByName(identificador)[0].options; 
	            comprobacionSeleccion(); 
	            break;    
	       case "multiple": 
	            opciones = document.getElementsByName(identificador)[0].options; 
	            comprobacionSeleccion(); 
	            break;              
	       default: 
	            window.alert("Tipo de pregunta desconocido.");  
	            break;            
	  }

	  resolucionPrevia();     
	}  
}


// Método que determina si las respuestas son o no correctas.
// ----------------------------------------------------------
function corregir(){
	inicializarNAcertadas();
	inicializarNVacias();

	for (var i = 0; i<ntitulos; i++) {
	  pregunta = i+1;        

	  identificadorPregunta();

	  switch(pregunta){
	       case 1:  opciones = opciones_01;  respuestas = respuestas_01; break;
	       case 2:  opciones = opciones_02;  respuestas = respuestas_02; break;
	       case 3:  opciones = opciones_03;  respuestas = respuestas_03; break;
	       case 4:  opciones = opciones_04;  respuestas = respuestas_04; break;
	       case 5:  opciones = opciones_05;  respuestas = respuestas_05; break;
	       case 6:  opciones = opciones_06;  respuestas = respuestas_06; break;
	       case 7:  opciones = opciones_07;  respuestas = respuestas_07; break;
	       case 8:  opciones = opciones_08;  respuestas = respuestas_08; break;
	       case 9:  opciones = opciones_09;  respuestas = respuestas_09; break;
	       case 10: opciones = opciones_10;  respuestas = respuestas_10; break;
	       case 11: opciones = opciones_11;  respuestas = respuestas_11; break;
	       case 12: opciones = opciones_12;  respuestas = respuestas_12; break;
	       case 13: opciones = opciones_13;  respuestas = respuestas_13; break;
	       default: window.alert("Número de pregunta incorrecto.");  break;
	  }        

	  switch(tipos[i]){
	       case "radio": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionChequeo();
	            break;
	       case "checkbox": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionChequeo();
	            break;     
	       case "text": 
	            opciones = document.getElementsByName(identificador);
	            comprobacionTexto();
	            break;
	       case "select": 
	            opciones = document.getElementsByName(identificador)[0].options; 
	            comprobacionSeleccion(); 
	            break;    
	       case "multiple": 
	            opciones = document.getElementsByName(identificador)[0].options; 
	            comprobacionSeleccion(); 
	            break;              
	       default: 
	            window.alert("Tipo de pregunta desconocido.");  
	            break;            
	  }

	  resolucion();     
	}  
}


// Método que comprueba que las opciones seleccionadas (i.e. select, select multiple) sean o no correctas.
// -------------------------------------------------------------------------------------------------------
function comprobacionSeleccion(){
	inicializarNSeleccionadas();
	inicializarNRespuestas();
	for (var i=0; i<opciones.length; i++) {
	  if(opciones[i].selected && opciones[i].value != ""){
	       nseleccionadas++;
	  }
	  for (var j=0; j<respuestas.length; j++) {
	       if(opciones[i].selected && opciones[i].value == respuestas[j]){ 
	            nrespuestas_correctas++; 
	       }
	  }             
	}     
	nrespuestas_incorrectas = nseleccionadas - nrespuestas_correctas;
}


// Método que comprueba que las opciones chequeadas (i.e. radio, checkbox) sean o no correctas.
// --------------------------------------------------------------------------------------------
function comprobacionChequeo(){
	inicializarNSeleccionadas();
	inicializarNRespuestas();
	for (var i=0; i<opciones.length; i++) {           
	  if(opciones[i].checked && opciones[i].value != ""){
	       nseleccionadas++;
	  }
	  for (var j=0; j<respuestas.length; j++) {  
	       if(opciones[i].checked && opciones[i].value == respuestas[j]){    
	           nrespuestas_correctas++; 
	       }
	  }
	}
	nrespuestas_incorrectas = nseleccionadas - nrespuestas_correctas;
}


// Método que comprueba que el texto (i.e. text) introducido sea o no correcto.
// ----------------------------------------------------------------------------
function comprobacionTexto(){
	inicializarNSeleccionadas();
	inicializarNRespuestas();
	for (var i=0; i<opciones.length; i++) {
	  if(opciones[i].value != ""){
	       nseleccionadas++;
	  }
	  for (var j=0; j<respuestas.length; j++) {        
	       if(opciones[i].value == respuestas[j]){ 
	           nrespuestas_correctas++; 
	       }
	  }
	}
	nrespuestas_incorrectas = nseleccionadas - nrespuestas_correctas;     
}


// Método que muestra sólo si no se ha respondido.
// -----------------------------------------------
function resolucionPrevia(){
	if(nrespuestas_correctas == 0 && nrespuestas_incorrectas == 0){
	  document.getElementsByTagName('h3')[pregunta-1].innerHTML += vacio; // No hay respuesta.
	  nvacias++;
	} 
}


// Método que muestra si no se ha respondido, si la respuesta completa es correcta o si la respuesta es incorrecta.
// ----------------------------------------------------------------------------------------------------------------
function resolucion(){
	if(nrespuestas_correctas == 0 && nrespuestas_incorrectas == 0){
	  document.getElementsByTagName('h3')[pregunta-1].innerHTML += vacio; // No hay respuesta.
	  nvacias++;
	}
	else{
	  if(nrespuestas_correctas == respuestas.length && nrespuestas_incorrectas == 0){
	      document.getElementsByTagName('h3')[pregunta-1].innerHTML += visto_verde; // Respuesta correcta
	      npreguntas_acertadas++; // Contador del número de preguntas acertadas
	  }
	  else{ 
	      document.getElementsByTagName('h3')[pregunta-1].innerHTML += aspa_roja + "</br><span>Aciertos " + nrespuestas_correctas + "/" + respuestas.length + ". Fallos " + nrespuestas_incorrectas + ".</span>"; // REspuesta incorrecta
	  } 
	}   
}


// Método que muestra la nota final.
// ---------------------------------
function notaFinal(){
	nota = npreguntas_acertadas/ntitulos*10;
	document.getElementById('nota').innerHTML = nota.toFixed(1);
	if(npreguntas_acertadas == ntitulos){
		aux=false;
		clearInterval(interval); // parar temporizador
	  	window.alert("Enhorabuena, ¡has acertado todas las preguntas del test de historia!");
	}
}


// Método que re-escribe los títulos, eliminando así indicadores de resultado anteriores.
// --------------------------------------------------------------------------------------
function reponerTitulos(){
    for (var i=0; i<ntitulos; i++){
        document.getElementsByTagName('h3')[i].innerHTML = titulos[i];
    }
}


// Método que re-escribe los títulos, eliminando así indicadores de resultado anteriores.
// --------------------------------------------------------------------------------------
function reponerNota(){
    document.getElementById('nota').innerHTML = "nota";
}


// Cuenta atrás
// ------------
function temporizador(d, h, m, s){
	aux=true;
    interval = setInterval(function(){
	    if(s > 0) { s--; }
	    else
	    {
	        if (m > 0)
	        {
	            m--;
	            s = 59;
	        }
	        else
	        {
	            if (h > 0)
	            {
	                h--;
	                m = 59;
	                s = 59;
	            }
	            else
	            {
	                if (d > 0)
	                {
	                    d--;
	                    h = 24;
	                    m = 59;
	                    s = 59;
	                }
	                else
	                {
	                    clearInterval(interval); // parar temporizador cuando llegamos al tiempo 0
	                }
	            }
	        }
		}
		document.getElementById('tiempo').innerHTML = m + "m " + s +" s";
		if(d==0 && h==0 && m==0 && s==0 && aux){
			aux=false; // para evitar que la alerta se repita
			window.alert("Oh, ¡se te acabó el tiempo sin haber podido acertar todas las preguntas!"); 
			window.alert("Si quieres volver a intentarlo, ¡COMIENZA DE NUEVO!"); 				
		}
	},1000);
}

