# Invitación Briana y Emmanuel

Sube todos los archivos de esta carpeta a la raíz del repositorio existente. No se necesita carpeta assets ni comando de compilación.

El álbum usa https://album-briana-emmanuel.losestudioscuevas.workers.dev y el binding ALBUM al bucket recuerdos-briana-emmanuel. El Worker se administra por separado en Cloudflare; este paquete contiene la invitación.

Prueba después del despliegue: abrir invitación, subir una foto pequeña, comprobar mensaje de éxito, abrir Ver álbum, ampliar foto y probar video MP4. Las cargas admiten 50 MB por archivo. HEIC y algunos MOV pueden guardarse aunque el navegador no permita previsualizarlos; se ofrece abrir el original.

El álbum no requiere cuenta y los archivos son accesibles mediante su enlace. El Worker actual valida origen y formato declarado, pero no autentica invitados ni limita el total de almacenamiento. La comprobación inicial de conexión no sustituye una prueba real de carga y lectura.
