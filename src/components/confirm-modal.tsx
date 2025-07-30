import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #222;
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #fff;
  margin: 0 0 16px 0;
  font-size: 20px;
`;

const ModalText = styled.p`
  color: #ccc;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled.button<{ isDanger?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.isDanger ? '#e0245e' : '#555'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isDanger ? '#c01e4e' : '#666'};
  }
`;

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  isDanger = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalText>{message}</ModalText>
        <ModalButtons>
          <ModalButton onClick={onCancel}>
            {cancelText}
          </ModalButton>
          <ModalButton isDanger={isDanger} onClick={onConfirm}>
            {confirmText}
          </ModalButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
} 