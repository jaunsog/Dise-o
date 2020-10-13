
function comparar(){
	
	var fecha_inicio = document.getElementById("date01").value;
    var fecha_final = document.getElementById("date02").value;
    const parrafo=document.getElementById("alerta")
    parrafo.innerHTML=""
    
	if (fecha_inicio > fecha_final){
        alert("ingresa una fecha valida")
        let alerta=""
        alerta += `Ingrese una fecha Valida <br>`
        return false
	} else if (fecha_final==fecha_inicio){
		alert("las fechas son igulaes, ingrese una fecha valida")
	} 
	

}




