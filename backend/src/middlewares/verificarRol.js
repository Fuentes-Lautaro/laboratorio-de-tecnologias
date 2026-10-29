

export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // req.usuario viene del middleware anterior que decodificó el token JWT
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autorizado. Token faltante o inválido.' });
    }

    const rolUsuario = req.usuario.rol?.toLowerCase() || '';
  
    // Pasamos los roles permitidos a minúsculas para comparar bien
    const rolesEnMinuscula = rolesPermitidos.map(r => r.toLowerCase());

    // Si el rol del usuario NO está en la lista permitida, se bloquea
    if (!rolesEnMinuscula.includes(rolUsuario)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Tu rol (${rolUsuario}) no tiene permisos para esta acción.` 
      });
    }

    next(); // Si coincide, lo dejamos avanzar al controlador
  };
};