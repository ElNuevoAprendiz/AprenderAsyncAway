me puedes explicar esta linea de codigo que hace parte por parte en react native: if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      
¡Claro! Vamos parte por parte, sin misterio 😄
Esta línea es súper común cuando haces peticiones a una API en React Native (normalmente con fetch).

if (!response.ok) {
  throw new Error('Usuario no encontrado');
}

1️⃣ response

Es el resultado que te devuelve fetch.
Contiene info como:

el código HTTP (200, 404, 500, etc.)

headers

si la petición fue exitosa o no

Ejemplo:

const response = await fetch(url);

2️⃣ response.ok

Es una propiedad booleana (true o false).

true → la respuesta fue exitosa (status entre 200 y 299)

false → hubo un error (404, 401, 500, etc.)

Ejemplos:

200 ✅ → response.ok === true

404 ❌ → response.ok === false

3️⃣ !response.ok

El ! significa negación.

Si response.ok es false

!response.ok se vuelve true

O sea:

“Si la respuesta NO fue exitosa…”

4️⃣ if (...)

El if dice:

“Si la respuesta no fue correcta, ejecuta lo que está dentro”.

5️⃣ throw new Error('Usuario no encontrado');

Aquí pasan dos cosas:

new Error(...) crea un error personalizado

throw lanza ese error y detiene la ejecución del código

Esto hace que:

El flujo se vaya al catch

Puedas mostrar el mensaje de error en la UI

Ejemplo completo:

try {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Usuario no encontrado');
  }

  const data = await response.json();
  console.log(data);

} catch (error) {
  console.log(error.message); // "Usuario no encontrado"
}

🧠 En resumen

Esa línea significa:

“Si la API no respondió correctamente, detén todo y lanza un error diciendo que el usuario no fue encontrado”.