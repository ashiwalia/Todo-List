import styled from "styled-components";
import Card from "react-bootstrap/Card";

export const CardContainer = styled(Card)`
  background-color: ${({ theme }) => theme.canvas};
  width: ${({ viewTask }) => (viewTask === true ? "18rem" : "100%")};
  position: relative;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-title {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 8px;
  }
  
  .card-subtitle {
    color: rgb(196, 181, 253) !important;
    margin-bottom: 15px !important;
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .card-body {
    height: 100%;
    position: relative;
    padding: 1.25rem;
  }
  
  hr {
    opacity: 0.2;
    margin: 8px 0;
  }
  
  @media screen and (max-width: 768px) {
    width: 100%;
    margin-bottom: 12px;
    
    .card-title {
      font-size: 1.05rem;
    }
    
    .card-subtitle {
      font-size: 0.85rem;
    }
    
    .card-body {
      padding: 1rem;
    }
  }
  
  @media screen and (max-width: 480px) {
    margin-bottom: 10px;
    
    .card-title {
      font-size: 1rem;
    }
    
    .card-subtitle {
      font-size: 0.8rem;
    }
    
    .card-body {
      padding: 0.875rem;
    }
  }
`;

export const Line = styled.div`
  margin: 5px 0;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    transparent,
    transparent 10px,
    #f0fff0 10px,
    #f0fff0 20px
  );
`;

export const StatusBtn = styled.button`
  font-family: Noto Sans, Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
  border: none;
  background-color: ${({ colorState }) => {
    if (colorState === "uncompleted") return "#fde68a";
    if (colorState === "working") return "#93c5fd"; 
    return "#a7f3d0";
  }};
  letter-spacing: unset;
  line-height: 15px;
  min-height: 36px;
  min-width: 36px;
  padding: 8px 12px;
  position: relative;
  border-radius: 999px;
  box-sizing: border-box;
  display: flex;
  margin: 10px;
  justify-content: center;
  align-items: center;
  width: 40%;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  @media screen and (max-width: 768px) {
    min-height: 40px;
    min-width: 40px;
    font-size: 13px;
    padding: 10px 14px;
    width: 45%;
  }
  
  @media screen and (max-width: 480px) {
    min-height: 44px;
    min-width: 44px;
    font-size: 12px;
    padding: 12px 16px;
    width: 50%;
  }
`;
export const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: ${({ viewTask }) =>
    viewTask === true ? "space-around" : "space-between"};
  align-items: center;
  padding: 8px 0;
  
  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 0;
  }
`;
export const Settings = styled.div`
  display: flex;
  justify-content: space-around;
  margin-right: ${({ viewTask }) => (viewTask === true ? "none" : "20px")};
  gap: 8px;
  
  svg {
    color: white;
    cursor: pointer;
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }
  
  svg:hover {
    transform: scale(1.1);
  }
  
  @media screen and (max-width: 768px) {
    gap: 12px;
    margin-right: ${({ viewTask }) => (viewTask === true ? "none" : "10px")};
    
    svg {
      width: 22px;
      height: 22px;
    }
  }
  
  @media screen and (max-width: 480px) {
    gap: 10px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;
export const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  min-width: 36px;
  min-height: 36px;
  transition: background-color 0.2s ease;
  
  :hover {
    background-color: ${({ theme }) => theme.background.iconHoverColor};
  }
  
  @media screen and (max-width: 768px) {
    min-width: 44px;
    min-height: 44px;
    padding: 10px;
  }
  
  @media screen and (max-width: 480px) {
    min-width: 48px;
    min-height: 48px;
    padding: 12px;
  }
`;

export const DateContainer = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  bottom: 8px;
  position: absolute;
  left: 0;
  right: 0;
  color: white;
  font-size: 0.85rem;
  align-items: center;
  
  @media screen and (max-width: 768px) {
    margin-left: 10px;
    gap: 12px;
    bottom: 12px;
    font-size: 0.8rem;
  }
  
  @media screen and (max-width: 480px) {
    margin-left: 8px;
    gap: 10px;
    bottom: 10px;
    font-size: 0.75rem;
    flex-wrap: wrap;
  }
`;
