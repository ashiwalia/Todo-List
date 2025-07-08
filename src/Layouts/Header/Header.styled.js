import styled from "styled-components";
import Button from "react-bootstrap/Button";

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 15px 0;
  }
  
  @media (min-width: 769px) {
    flex-direction: row;
    flex-wrap: nowrap;
  }
`;

// styles of add new tasks button
export const TaskBtn = styled(Button)`
  margin: 20px;
  background-color: ${({ theme }) => theme.canvas} !important;
  width: 80%;
  right: 0;
  justify-content: flex-end;
  border: none;
  min-height: 44px;
  font-size: 16px;
  
  :hover {
    background-color: ${({ theme }) => theme.background.hover} !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
    order: 3;
    min-height: 48px;
    font-size: 16px;
  }
  
  @media (min-width: 769px) {
    width: auto;
    margin-right: 20px;
  }
`;
export const DateContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.primary};
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    order: 1;
    font-size: 14px;
  }
  
  @media (min-width: 769px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
export const NotificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  
  svg {
    color: ${({ theme }) => theme.canvas} !important;
    cursor: pointer;
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 768px) {
    order: 2;
    justify-content: center;
    width: 100%;
    gap: 12px;
    
    svg {
      min-width: 28px;
      min-height: 28px;
    }
  }
  
  @media (min-width: 769px) {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
`;
export const NotificationIcon = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
  
  &:hover {
    background-color: ${({ theme }) => theme.background.viewBtnColor};
  }
  
  @media (max-width: 768px) {
    min-width: 48px;
    min-height: 48px;
  }
`;

export const NotificationBadge = styled.div`
  background-color: red;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  right: 2px;
`;

export const SyncStatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    margin-right: 5px;

    .badge {
      font-size: 0.7rem;
      padding: 0.3rem 0.5rem;
    }
  }
`;

export const SyncIcon = styled.span`
  display: inline-flex;
  align-items: center;

  .spinner-border {
    width: 0.8rem;
    height: 0.8rem;
  }

  svg {
    width: 0.8rem;
    height: 0.8rem;
  }
`;
