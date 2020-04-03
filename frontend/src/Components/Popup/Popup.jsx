import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Popup.css';

export default class MyVerticallyCenteredModal extends Component {
    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="modal-header">
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={this.props.bodyClass}>
                    <h4>{this.props.bodyHeader}</h4>
                    <div>
                        {this.props.body}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

}