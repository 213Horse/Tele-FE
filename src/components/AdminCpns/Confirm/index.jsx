import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { confirmable, createConfirmation } from 'react-confirm';

const Confirmation = ({
  title = 'Xác nhận',
  confirmation,
  show,
  proceed,
  enableEscape = true,
}) => {
  return (
    <div className='static-modal'>
      <Modal
        animation={false}
        show={show}
        onHide={() => proceed(false)}
        backdrop={enableEscape ? true : 'static'}
        keyboard={enableEscape}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa ?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => proceed(false)}>Hủy</Button>
          <Button
            className='button-l'
            bsStyle='primary'
            onClick={() => {
              confirmation();
              proceed(true);
            }}
          >
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Confirmation.propTypes = {
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  enableEscape: PropTypes.bool,
};

export function confirm(
  confirmation,
  proceedLabel = 'OK',
  cancelLabel = 'cancel',
  options = {},
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options,
  });
}
