import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actualizarPassword } from '../services/personasServices'; // Ajustá la ruta a tu archivo de servicios

export function PerfilPasswordPage() {
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    // Estado del formulario de contraseñas
    const [formData, setFormData] = useState({
        passwordActual: '',
        nuevaPassword: '',
        repetirPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        // 1. Validar desde el frontend que las dos contraseñas nuevas coincidan
        if (formData.nuevaPassword !== formData.repetirPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        // Opcional: Validar longitud mínima
        if (formData.nuevaPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setCargando(true);

        try {
            await actualizarPassword({
                passwordActual: formData.passwordActual,
                nuevaPassword: formData.nuevaPassword
            });

            setMensajeExito('¡Contraseña actualizada correctamente!');
            setFormData({
                passwordActual: '',
                nuevaPassword: '',
                repetirPassword: ''
            });

            // Opcional: Redirigir al perfil o inicio después de unos segundos
            setTimeout(() => {
                navigate('/perfil');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña. Intentá nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                    🔒 Cambiar Contraseña
                </h2>
                <p className="text-muted fs-5">Actualizá tu clave de acceso de forma segura.</p>
            </div>

            {mensajeExito && <div className="alert alert-success text-center rounded-4 mb-4">{mensajeExito}</div>}
            {error && <div className="alert alert-danger text-center rounded-4 mb-4">{error}</div>}

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                
                                {/* Contraseña Actual */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-muted small">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="passwordActual"
                                        value={formData.passwordActual}
                                        onChange={handleInputChange}
                                        placeholder="Ingresá tu contraseña actual"
                                        required
                                    />
                                </div>

                                {/* Nueva Contraseña */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-muted small">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="nuevaPassword"
                                        value={formData.nuevaPassword}
                                        onChange={handleInputChange}
                                        placeholder="Ingresá tu nueva contraseña"
                                        required
                                    />
                                </div>

                                {/* Repetir Nueva Contraseña */}
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-muted small">Repetir Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-pill px-3"
                                        name="repetirPassword"
                                        value={formData.repetirPassword}
                                        onChange={handleInputChange}
                                        placeholder="Repetité la nueva contraseña"
                                        required
                                    />
                                </div>

                                <div className="col-12 text-center mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn text-white rounded-pill px-5 py-2 fw-semibold w-100" 
                                        style={{ backgroundColor: 'var(--titulos, #581845)' }}
                                        disabled={cargando}
                                    >
                                        {cargando ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
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

export default PerfilPasswordPage;