# Beat Saber Argentina Mapping Collabs

## Descripción
Este proyecto tiene como objetivo facilitar la colaboración en la creación de mapas para Beat Saber entre miembros de la comunidad argentina. Permite combinar las contribuciones de varios usuarios en un único mapa de Beat Saber. Los colaboradores deben incluir sus partes en la subcarpeta correspondiente dentro de `/Parts` y luego ejecutar `merge.js` para combinarlas, generando los archivos `.dat` en la carpeta `/Output`.

## Requisitos Previos

Para ejecutar este proyecto, necesitas tener Node.js instalado en tu sistema. Si no lo tienes, sigue las instrucciones a continuación para instalarlo.

### Instalación de Node.js

1. Visita [la página oficial de Node.js](https://nodejs.org/) y descarga el instalador para tu sistema operativo.
2. Ejecuta el instalador y sigue las instrucciones para completar la instalación.
3. Para verificar que Node.js y npm (su gestor de paquetes) se han instalado correctamente, abre una terminal o línea de comandos y ejecuta:

```bash
node -v
npm -v
```
Esto debería mostrarte las versiones de Node.js y npm, respectivamente.

## Preparación

### Clonar el Proyecto

Para colaborar en el proyecto o ejecutarlo localmente, primero necesitas clonar el repositorio a tu máquina local:

Para ejecutar los comandos necesitas tener `git` instalado, puedes descargarlo de [git-scm.com](https://git-scm.com/).

1. Abre una terminal o CMD y navega a la carpeta donde deseas almacenar el proyecto o haz click derecho dentro de la carpeta y en `Abrir en Terminal`.
2. Ejecuta el siguiente comando:
```bash
git clone https://github.com/Elecast2/BSArgMappingCollabs.git
```
3. Cambia al directorio del proyecto:
```bash
cd BSArgMappingCollabs
```

### Actualizar el Proyecto Local

Para asegurarte de que tienes la versión más reciente del proyecto, realiza los siguientes pasos:

1. Abre una terminal o CMD.
2. Navega al directorio del proyecto o haz click derecho dentro de la carpeta y en `Abrir en Terminal`.
3. Ejecuta el siguiente comando para actualizar tu proyecto:
```bash
git pull origin main
```

### Actualizar el Proyecto Remoto

Si ya hiciste cambios a tu parte, sigue los siguientes pasos para actualizar el proyecto remoto:
1. Coloca los archivos .dat dentro de `Nombre del Mapa/Parts/TuNombre`
2. Abre una terminal o CMD en la dirección principal del proyecto y ejecuta los siguientes comandos para actualualizar el proyecto remoto:
```bash
git add "./Nombre del Mapa/Parts/TuNombre/."
git commit -m "Mensaje corto explicando muy brevemente los cambios, Ejemplo: Añadí mas paredes porque Derek me miro feo"
git push origin main
```

## Ejecución del Script

Antes de ejecutar el script, asegúrate de colocar tus partes correspondientes (.dat) dentro de `Nombre del Mapa/Parts/TuNombre`.

Para combinar las partes en un solo mapa, sigue estos pasos:

1. Asegúrate de que estás en el directorio del proyecto `BSArgMappingCollabs`.
2. Abre una terminal o CMD en este directorio.
3. Ejecuta el script con Node.js:
```bash
node merge.js
```
El proceso leerá las partes de los mapas en la carpeta /Parts, las combinará y generará el archivo resultante en la carpeta /Output.

## Contribuir
Para contribuir a este proyecto si ya eres un Mapper de Argentina, pregunta en nuestro [Discord](https://discord.gg/vrargentina)

## Soporte
Si encuentras algún problema o tienes alguna sugerencia, por favor, abre un issue en este repositorio de GitHub.

¡Gracias por colaborar en el proyecto Beat Saber Argentina Mapping Collaborations!
