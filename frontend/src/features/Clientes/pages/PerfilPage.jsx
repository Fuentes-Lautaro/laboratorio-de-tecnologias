import React, { useState, useEffect } from 'react';
import { obtenerSesion } from '../../auth'; 

export function PerfilPage() {
    const [sesion, setSesion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    // Estados para los datos editables del formulario de perfil
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '',
    });

    // Estados para el cambio de contraseña separado por seguridad
    const [passData, setPassData] = useState({
        passwordActual: '',
        passwordNueva: '',
        confirmarPassword: '',
    });

    useEffect(() => {
        const usuarioSesion = obtenerSesion();
        if (usuarioSesion) {
            setSesion(usuarioSesion);
            setFormData({
                nombre: usuarioSesion.nombre || '',
                email: usuarioSesion.email || '',
                telefono: usuarioSesion.telefono || '',
                direccion: usuarioSesion.direccion || '',
                fechaNacimiento: usuarioSesion.fechaNac || '',
            });
        }
        setCargando(false);
    }, []);

    //Se activa cuando hay un cambio
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPassData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitPerfil = (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        try {
            setMensajeExito('¡Tus datos personales se han actualizado correctamente!');
        } catch (err) {
            setError('No se pudieron guardar los cambios. Intentá nuevamente.');
        }
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (passData.passwordNueva !== passData.confirmarPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        if (passData.passwordNueva.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            setMensajeExito('¡Tu contraseña se ha modificado con éxito!');
            setPassData({ passwordActual: '', passwordNueva: '', confirmarPassword: '' });
        } catch (err) {
            setError('La contraseña actual es incorrecta o hubo un error.');
        }
    };

    if (cargando) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!sesion) {
        return (
            <div className="container py-5 text-center">
                <div className="card shadow-sm border-0 rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: '600px' }}>
                    <h3 className="fw-bold mb-3" style={{ color: 'var(--titulos, #581845)' }}>
                        Iniciá sesión para ver tu perfil
                    </h3>
                    <p className="text-muted mb-4">Necesitamos verificar tu identidad para mostrarte tu información personal.</p>
                    <a href="/login" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                        Iniciar sesión
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                    Mi Información Personal
                </h2>
                <p className="text-muted fs-5">Actualizá tus datos de contacto y la seguridad de tu cuenta.</p>
            </div>

            {mensajeExito && <div className="alert alert-success text-center rounded-4 mb-4">{mensajeExito}</div>}
            {error && <div className="alert alert-danger text-center rounded-4 mb-4">{error}</div>}

            <div className="row justify-content-center g-4">
                {/* Formulario de Datos Personales */}
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white mb-4">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--titulos, #581845)' }}>
                            📋 Datos de la Cuenta
                        </h4>
                        <form onSubmit={handleSubmitPerfil}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Nombre y Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-pill px-3"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control rounded-pill px-3"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleInputChange}
                                        placeholder="Ej: 2664123456"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-muted small">Dirección de Entrega</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        placeholder="Calle, Número, Piso, Ciudad"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control rounded-pill px-3"
                                        name="fechaNacimiento"
                                        value={formData.fechaNacimiento}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">DNI (No modificable)</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3 bg-light"
                                        value={sesion.dni}
                                        disabled
                                    />
                                </div>
                                <div className="col-12 text-end mt-4">
                                    <button type="submit" className="btn text-white rounded-pill px-4 py-2 fw-semibold" style={{ backgroundColor: 'var(--titulos, #581845)' }}>
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Formulario de Cambio de Contrasenia */}
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--titulos, #581845)' }}>
                            🔒 Cambiar Contraseña
                        </h4>
                        <form onSubmit={handleSubmitPassword}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-muted small">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="passwordActual"
                                        value={passData.passwordActual}
                                        onChange={handlePassChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="passwordNueva"
                                        value={passData.passwordNueva}
                                        onChange={handlePassChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Confirmar Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="confirmarPassword"
                                        value={passData.confirmarPassword}
                                        onChange={handlePassChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 text-end mt-4">
                                    <button type="submit" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold">
                                        Actualizar Contraseña
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilPage;