# Guía para probar InmoLedger

Esta guía es para quien va a usar el prototipo. Sigue los pasos en orden. Cada acción importante abre **MetaMask**: ahí escribes la contraseña o confirmas. No uses dinero real. La red es de pruebas (Sepolia).

Necesitas:

- El navegador **Chrome** (o Edge).
- La extensión **MetaMask** instalada, con una cuenta ya creada.
- Un poco de ETH de prueba en esa cuenta. Si MetaMask dice que no hay fondos, avisa a quien organiza la prueba antes de seguir.
- El enlace de InmoLedger que te entregaron.

La contraseña de MetaMask no se escribe dentro de InmoLedger. Se escribe en la ventana de MetaMask.

---

## 1. Abrir la cuenta en MetaMask

1. Abre Chrome.
2. Arriba a la derecha, toca el icono del zorro de **MetaMask**.
3. Si pide la contraseña, escríbela y toca **Desbloquear**.
4. Arriba, mira el nombre de la red. Tiene que decir **Sepolia**. Si dice otra red, tócala y elige **Sepolia**.
5. Deja MetaMask desbloqueado. Puedes cerrar la ventanita del zorro.

---

## 2. Entrar a InmoLedger

1. Abre el enlace de la aplicación.
2. En la primera pantalla verás el nombre **InmoLedger** y tres roles: Propietario, Validador y Administrador.
3. Toca el botón **Conectar cuenta**.
4. Se abre MetaMask.
5. Si vuelve a pedir la contraseña, escríbela y desbloquea.
6. MetaMask pregunta si quieres conectar esta cuenta. Toca **Conectar** (o **Siguiente** y luego **Conectar**).
7. Si MetaMask pide cambiar a la red **Sepolia**, toca **Cambiar red** o **Aprobar**.
8. Vuelves a InmoLedger. Arriba debe aparecer un número corto de tu cuenta (empieza por `0x`) y tu rol.

Si no aparece el botón o MetaMask no se abre, revisa que la extensión esté instalada y desbloqueada. Luego recarga la página y toca **Conectar cuenta** otra vez.

Para salir, toca **Cerrar** arriba a la derecha. Eso no borra tus inmuebles: solo desconecta la cuenta de esta página.

---

## 3. Qué puedes hacer según tu rol

Arriba verás una o varias pestañas: **Propietario**, **Validador**, **Administrador**.

- Toda cuenta conectada puede usar **Propietario**.
- **Validador** solo aparece si el administrador ya te dio ese permiso.
- **Administrador** solo aparece en la cuenta de quien administra el prototipo.

Toca la pestaña del rol que te toca probar. El texto debajo de las pestañas explica qué hace ese rol.

---

## 4. Propietario: registrar un inmueble

Quédate en la pestaña **Propietario**.

1. En la tarjeta **Registrar inmueble**, escribe la **Dirección predial**. Ejemplo: `Calle 5 # 8-21, Popayán`.
2. En **Tipo de inmueble**, abre la lista y elige uno (Casa, Apartamento u otro). No lo dejes en “Selecciona un tipo”.
3. En **Área**, escribe los metros cuadrados. Ejemplo: `52`.
4. En **Escritura**, toca el recuadro y elige un archivo PDF, JPG, PNG o WebP. El nombre del archivo debe quedar escrito dentro del recuadro.
5. El botón **Registrar y confirmar** se enciende solo cuando el archivo está adjunto. Tócalo.
6. Espera. La página dice que está guardando la escritura.
7. MetaMask se abre para confirmar. Revisa que sea Sepolia y toca **Confirmar**.
8. Espera a que desaparezca “Procesando…”. Debe salir un mensaje como **Quedó registrada como #1** (el número puede ser otro).

El inmueble aparece abajo, en **Mis inmuebles**, con estado **Registrado**.

Si el botón sigue apagado, falta el archivo o la página no tiene la configuración para guardar documentos. Avisa a quien organiza la prueba. No inventes otro archivo con un formato distinto: solo PDF, JPG, PNG o WebP.

---

## 5. Propietario: ver la ficha

1. En **Mis inmuebles**, busca el que acabas de crear.
2. Toca **Ver ficha**.
3. Revisa la dirección, el tipo, el área y el dueño.
4. Baja y abre la escritura. Debe verse el mismo archivo que adjuntaste.
5. Más abajo está el historial de ese inmueble: quién lo registró.
6. Toca **Cerrar** para volver a la lista.

---

## 6. Propietario: transferir el inmueble

Solo puedes pasar un inmueble que sea tuyo. Necesitas la cuenta de la otra persona: un texto largo que empieza por `0x`. Pídeselo antes de empezar. En MetaMask esa persona lo copia tocando el nombre de su cuenta.

1. En **Mis inmuebles**, toca la fila del inmueble (no solo “Ver ficha”). El número se carga solo en la tarjeta **Transferir**.
2. Si el número no se llenó, escríbelo tú en **Número del inmueble**.
3. En **Cuenta que recibe el inmueble**, pega la cuenta que empieza por `0x`.
4. Toca **Transferir título**.
5. En MetaMask, toca **Confirmar**.
6. Espera el mensaje **El inmueble cambió de dueño**.

Ese inmueble deja de salir en tus “Mis inmuebles”. La otra persona, al conectar su cuenta y abrir **Propietario**, lo ve en su lista.

---

## 7. Validador: revisar y marcar como validado

Entra con la cuenta que tenga permiso de validador. Toca la pestaña **Validador**.

1. Abajo, en **Pendientes de validar**, solo salen inmuebles en estado **Registrado**.
2. Toca **Ver ficha** del que vas a revisar.
3. Compara la dirección, el tipo y el área con la escritura.
4. Si el documento no coincide, no lo valides. Ciérralo y anótalo en tus comentarios.
5. Si sí coincide, toca **Cerrar**.
6. Toca la fila de ese inmueble para que el número quede en **Número de la ficha**.
7. Toca **Marcar como validado**.
8. En MetaMask, toca **Confirmar**.
9. Espera el mensaje **Pasó a estado Validado**.

Ese inmueble desaparece de la lista de pendientes. Si vuelves a abrir la ficha desde el registro completo, el estado dice **Validado**.

Si no ves la pestaña **Validador**, esta cuenta no tiene permiso. El administrador tiene que dártelo (paso 8) y tú debes recargar la página.

---

## 8. Administrador: dar permiso para validar

Esto solo lo hace la cuenta administradora. Toca la pestaña **Administrador**.

1. Pide a la otra persona su cuenta (empieza por `0x`).
2. En **Quién puede validar**, pégala en el campo **Cuenta**.
3. En **Acción**, deja **Dar permiso de validador**.
4. Toca el botón de confirmar de esa tarjeta.
5. En MetaMask, toca **Confirmar**.
6. Espera el mensaje **Validador habilitado**.

La otra persona recarga InmoLedger, conecta su cuenta y ya debe ver la pestaña **Validador**.

Para quitar el permiso, es el mismo formulario con la acción **Quitar permiso**.

No uses **Vaciar registro** durante la prueba, salvo que quien organiza te lo pida. Ese botón retira los inmuebles de la aplicación.

---

## 9. Orden sugerido de una prueba completa

Hazlo con dos cuentas de MetaMask (dos personas, o una persona que cambie de cuenta).

1. Cuenta A entra como propietario y registra un inmueble con escritura.
2. Cuenta A abre **Ver ficha** y comprueba que el documento se ve.
3. El administrador da permiso de validador a la cuenta B.
4. La cuenta B entra, abre **Validador**, revisa la ficha y la marca como validada.
5. La cuenta A transfiere ese inmueble a la cuenta B.
6. La cuenta B entra como propietario y comprueba que ahora el inmueble es suyo.

Cada confirmación de MetaMask cuenta como un paso terminado solo cuando la página muestra el mensaje de éxito, no cuando apenas se abre la ventanita.

---

## 10. Si algo se traba

- MetaMask no se abre: toca el icono del zorro, desbloquea con la contraseña y repite el botón en InmoLedger.
- Dice que la red no es la correcta: en MetaMask cambia a **Sepolia** y confirma el cambio.
- El botón **Registrar y confirmar** no se enciende: adjunta de nuevo la escritura. Si igual sigue apagado y sale un aviso rojo de configuración, avisa a quien organiza la prueba.
- MetaMask dice que rechazaste la operación: vuelve a tocar el botón en InmoLedger y esta vez toca **Confirmar**.
- Tarda: es normal. No des el botón varias veces. Espera el mensaje en la página.
- No anotes tu contraseña de MetaMask en el formulario de la prueba ni se la pases a nadie.
