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

## Ejecución del Script merge.js
Para combinar las partes de los mapas en un único archivo .dat, sigue estos pasos:

Coloca las partes de cada colaborador en la subcarpeta adecuada dentro de /Parts.
Abre una terminal o línea de comandos y navega al directorio del proyecto.
Ejecuta el script con el siguiente comando:
```bash
node merge.js
```
El proceso leerá las partes de los mapas en la carpeta /Parts, las combinará y generará el archivo resultante en la carpeta /Output.

## Contribuir
Para contribuir a este proyecto si ya eres un Mapper de Argentina, pregunta en nuestro [Discord](https://discord.gg/vrargentina)

## Soporte
Si encuentras algún problema o tienes alguna sugerencia, por favor, abre un issue en este repositorio de GitHub.

¡Gracias por colaborar en el proyecto Beat Saber Argentina Mapping Collaborations!
