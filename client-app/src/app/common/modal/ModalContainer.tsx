import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { Modal } from "semantic-ui-react";

export default observer(function ModalContainer() {
    const { modalStore } = useStore();
    return (
        <Modal closeIcon={true} open={modalStore.modal.open}
            onClose={modalStore.closeModal} size="large">
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    )
})