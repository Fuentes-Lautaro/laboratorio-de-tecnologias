import React, { useState, useEffect } from 'react';
import { getPersonaPorId, actualizarDatosPersonales } from '../services/personasServices'; 

export function PerfilPage() {
    const [cargando, setCargando] = useState(true);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    // Estado del formulario con los campos pedidos
    const [formData, setFormData] = useState({
        nombre: '',
        mail: '',
        telefono: '',
        direccion: '',
        fechaNac: '',
        dni: ''
    });

    // Estados para controlar qué campos se pueden editar individualmente con el botoncito ✏️ / ✔️
    const [editando, setEditando] = useState({
        nombre: false,
        mail: false,
        telefono: false,
        direccion: false,
        fechaNac: false
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Llamamos a tu servicio pasando el ID de la persona logueada
                const data = await getPersonaPorId();
             
                setFormData({
                    nombre: data.pe_nombre || data.nombre || '',
                    mail: data.pe_mail || data.mail || '',
                    telefono: data.pe_telefono || data.telefono || '',
                    direccion: data.pe_direccion || data.direccion || '',
                    fechaNac: data.pe_fechaNac ? data.pe_fechaNac.split('T')[0] : (data.fechaNac || ''),
                    dni: data.pe_dni || data.dni || ''                  
                });
               
            } catch (err) {
                setError('No se pudo cargar la información del perfil.');
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Función para alternar la edición individual de un campo al hacer clic en el botoncito
    const toggleEdicion = (campo) => {
        setEditando(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        try {
            await actualizarDatosPersonales(formData);
            setMensajeExito('¡Datos personales actualizados correctamente!');
            
            // Volvemos a bloquear todos los campos tras guardar con éxito
            setEditando({
                nombre: false,
                mail: false,
                telefono: false,
                direccion: false,
                fechaNac: false
            });
        } catch (err) {
            setError(err.message || 'Error al actualizar los datos. Intentá nuevamente.');
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

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold fs-1 mb-2" style={{ color: 'var(--titulos, #581845)' }}>
                    📋 Mi Perfil
                </h2>
                <p className="text-muted fs-5">Modificá tus datos personales.</p>
            </div>

            {mensajeExito && <div className="alert alert-success text-center rounded-4 mb-4">{mensajeExito}</div>}
            {error && <div className="alert alert-danger text-center rounded-4 mb-4">{error}</div>}

            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                
                                {/* Campo: Nombre */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Nombre y Apellido</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control rounded-start-pill px-3"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            disabled={!editando.nombre}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={`btn ${editando.nombre ? 'btn-success' : 'btn-outline-secondary'} rounded-end-pill px-3`}
                                            onClick={() => toggleEdicion('nombre')}
                                            title={editando.nombre ? 'Bloquear campo' : 'Modificar campo'}
                                        >
                                            {editando.nombre ? '✔' : '✏️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Campo: Correo Electrónico */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Correo Electrónico</label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control rounded-start-pill px-3"
                                            name="mail"
                                            value={formData.mail}
                                            onChange={handleInputChange}
                                            disabled={!editando.mail}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={`btn ${editando.mail ? 'btn-success' : 'btn-outline-secondary'} rounded-end-pill px-3`}
                                            onClick={() => toggleEdicion('mail')}
                                            title={editando.mail ? 'Bloquear campo' : 'Modificar campo'}
                                        >
                                            {editando.mail ? '✔' : '✏️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Campo: Teléfono */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Teléfono</label>
                                    <div className="input-group">
                                        <input
                                            type="tel"
                                            className="form-control rounded-start-pill px-3"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleInputChange}
                                            disabled={!editando.telefono}
                                            placeholder="Ej: 2664123456"
                                        />
                                        <button
                                            type="button"
                                            className={`btn ${editando.telefono ? 'btn-success' : 'btn-outline-secondary'} rounded-end-pill px-3`}
                                            onClick={() => toggleEdicion('telefono')}
                                            title={editando.telefono ? 'Bloquear campo' : 'Modificar campo'}
                                        >
                                            {editando.telefono ? '✔' : '✏️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Campo: Dirección */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Dirección</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control rounded-start-pill px-3"
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleInputChange}
                                            disabled={!editando.direccion}
                                            placeholder="Calle, Número, Ciudad"
                                        />
                                        <button
                                            type="button"
                                            className={`btn ${editando.direccion ? 'btn-success' : 'btn-outline-secondary'} rounded-end-pill px-3`}
                                            onClick={() => toggleEdicion('direccion')}
                                            title={editando.direccion ? 'Bloquear campo' : 'Modificar campo'}
                                        >
                                            {editando.direccion ? '✔' : '✏️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Campo: Fecha de Nacimiento */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">Fecha de Nacimiento</label>
                                    <div className="input-group">
                                        <input
                                            type="date"
                                            className="form-control rounded-start-pill px-3"
                                            name="fechaNac"
                                            value={formData.fechaNac}
                                            onChange={handleInputChange}
                                            disabled={!editando.fechaNac}
                                        />
                                        <button
                                            type="button"
                                            className={`btn ${editando.fechaNac ? 'btn-success' : 'btn-outline-secondary'} rounded-end-pill px-3`}
                                            onClick={() => toggleEdicion('fechaNac')}
                                            title={editando.fechaNac ? 'Bloquear campo' : 'Modificar campo'}
                                        >
                                            {editando.fechaNac ? '✔' : '✏️'}
                                        </button>
                                    </div>
                                </div>

                                {/* Campo: DNI (No modificable) */}
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-muted small">DNI (No modificable)</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill px-3 bg-light"
                                        value={formData.dni}
                                        disabled
                                    />
                                </div>

                                <div className="col-12 text-end mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn text-white rounded-pill px-4 py-2 fw-semibold" 
                                        style={{ backgroundColor: 'var(--titulos, #581845)' }}
                                    >
                                        Guardar Cambios
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