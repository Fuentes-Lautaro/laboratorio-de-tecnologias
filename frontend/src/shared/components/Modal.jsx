export function Modal({ titulo, children, onClose }) {
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="card border-0">
            <div className="card-header text-white d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--titulos, #3E100F)' }}>
              <h5 className="mb-0 fw-bold">{titulo}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="card-body p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;