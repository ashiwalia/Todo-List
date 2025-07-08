// Imports
import styled from "styled-components";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";

// styles of offcanvas container
export const OffcanvasContainer = styled(Offcanvas)`
  z-index: 100;
  position: fixed;
  width: 280px !important;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.primary} !important;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  // styles of offcanvas body
  .offcanvas-body {
    padding: 1rem;
    
    //  styles of items inside offcanvas body
    .dropdown-item {
      color: ${({ theme }) => theme.color.primary} !important;
      margin: 10px 0;
      :hover {
        color: ${({ theme }) => theme.color.hover} !important;
      }
    }
  }
  
  // media query for smaller screens
  @media only screen and (max-width: 768px) {
    width: 100% !important;
    max-width: 320px !important;
    display: none;
  }
`;

// styles of header
export const Header = styled(Offcanvas.Header)`
  flex-direction: column;
  padding: 1.5rem 1rem 1rem;

  // styles of titles
  .offcanvas-title {
    margin-top: 20px;
    align-self: center;
    text-transform: uppercase;
    font-family: cursive;
    color: ${({ theme }) => theme.color.primary};
    font-size: 1.5rem;
    font-weight: 600;
    
    @media only screen and (max-width: 768px) {
      font-size: 1.3rem;
    }
  }
`;

// styles of add new tasks button
export const TaskBtn = styled(Button)`
  margin: 20px;
  background-color: ${({ theme }) => theme.canvas} !important;
  width: 100%;
  border: none;
  min-height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

  :hover {
    background-color: ${({ theme }) => theme.background.hover} !important;
    transform: translateY(-1px);
  }
  
  // media query for smaller screens
  @media only screen and (max-width: 768px) {
    margin: 15px 0;
    min-height: 48px;
    font-size: 16px;
  }
`;

export const NavBtn = styled(NavLink)`
  display: flex;
  height: 48px;
  font-size: 15px;
  line-height: 17px;
  padding: 12px 15px;
  font-weight: 400;
  text-decoration: none;
  text-align: center;
  align-items: center;
  position: relative;
  color: ${({ theme }) => theme.color.primary} !important;
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
  
  :hover {
    color: ${({ theme }) => theme.color.hover} !important;
    background-color: ${({ theme }) =>
      theme.background.viewBtnColor} !important;
    transform: translateX(4px);
  }
  
  &.active {
    color: ${({ theme }) => theme.color.hover} !important;
    background-color: ${({ theme }) =>
      theme.background.viewBtnColor} !important;
    
    ::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 4px;
      background-color: ${({ theme }) => theme.canvas} !important;
      border-radius: 2px;
    }
  }
  
  @media only screen and (max-width: 768px) {
    height: 52px;
    font-size: 16px;
    padding: 14px 18px;
  }
`;
