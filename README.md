# laboratorio-de-tecnologias
Proyecto integrador laboratorios de tecnologias 2026

El acceso al sistema de gestion es a travez de la ruta /login-gestior, desde el cual con los usuarios otorgados como ejemplo se puede acceder a las 3 disposiciones (cm - gerente - vendedor)

El flujo suscripciones esta simulado para el caso de que el usuario este registrado o no, en el caso de estar registrado lleva a la simulacion de pago donde se implementara el uso de la API de suscripciones de mercado pago. En caso de que el usuario no este registrado primero se piden todos los datos para luego simular el pago a implementar de la misma forma. (es la unica forma de registrarse ya que no se puede realizar otra accion en la pagina publica que no sean las sucripciones)

Para el proyecto se utilizo Gemini pro, intentamos utilizar un modelo de ia local usando bionic (LMStudio) con un modelo llamado Qwen 2.5 VL 7B, pero no logramos configurarlo para que tenga contexto de toda la carpeta raiz del proyecto.