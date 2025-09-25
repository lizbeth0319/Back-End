Practica documentacion del proyecto 


descargas:
-npm i mongoose
-npm i dotenv
-npm i express
-npm i jsonwebtoken
-npm i bcryptjs
-npm i express-validator
-npm i cors


explicacion de algunass funciones

/controllers/aprendiz.js /funcion/ obtenerAprendicesSearch:=
Explicación de los componentes:
$or: Este es un operador lógico que permite combinar múltiples condiciones. La consulta devolverá los documentos que cumplan cualquiera de las condiciones dentro de los corchetes. 
{ campo: regex }: Esta es la estructura para una condición específica dentro de la consulta $or.
campo: Se refiere al nombre de un campo en la base de datos, como nombre, ficha o programa. 
regex: Representa una expresión regular, que es un patrón de caracteres utilizado para encontrar coincidencias dentro de cadenas de texto. 
[ ... ]: Los corchetes indican que se trata de un array (una lista) de condiciones que se evaluarán utilizando el operador $or.