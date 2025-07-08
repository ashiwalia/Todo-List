import styled from "styled-components";
import { NavLink } from "react-router-dom";
export const HomeContainer = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-height: 100vh;
`;
export const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  overflow: auto;
  min-height: 100vh;
  
  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
  
  @media screen and (max-width: 768px) {
    padding: 60px 10px 10px;
  }
`;

export const AppHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

export const CenterContainer = styled.div`
  position: relative;
  display: inline;
  flex-direction: row;
  width: 60%;
  overflow: auto;
  
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
  
  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 0 10px;
  }
`;
export const ContainerTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  overflow: auto;
  margin: 10px 0;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 15px 0;
  }
  
  @media screen and (max-width: 480px) {
    gap: 8px;
    margin: 10px 0;
  }
`;
export const Section = styled.div`
  width: 20%;
  
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const CurrentItem = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  text-transform: uppercase;
  margin: 20px 0;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.primary};
  
  @media screen and (max-width: 768px) {
    justify-content: center;
    font-size: 18px;
    margin: 15px 0;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 16px;
    margin: 10px 0;
  }
`;

export const ShapeView = styled.div`
  display: flex;
  left: 0;
  margin: 20px 0 40px 0;
  overflow: auto;
  
  @media screen and (max-width: 768px) {
    justify-content: center;
    margin: 15px 0 20px 0;
  }
  
  @media screen and (max-width: 480px) {
    margin: 10px 0 15px 0;
  }
`;
export const ChildView = styled.span`
  padding: 8px;
  color: ${({ theme }) => theme.canvas};
  cursor: pointer;
  border-radius: 4px;
  margin: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  
  :hover {
    background-color: ${({ theme }) => theme.background.viewBtnColor};
  }
  
  @media screen and (max-width: 768px) {
    padding: 12px;
    margin: 0 6px;
    min-width: 48px;
    min-height: 48px;
  }
`;

/* Mobile Navigation Styles */
export const MobileNavToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.canvas};
  cursor: pointer;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.background.viewBtnColor};
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const MobileNavOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const MobileNavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background-color: ${({ theme }) => theme.background.primary};
  padding: 20px;
  z-index: 1001;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

export const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.background.viewBtnColor};

  h2 {
    color: ${({ theme }) => theme.color.primary};
    margin: 0;
    font-size: 1.5rem;
    text-transform: uppercase;
  }

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.canvas};
    cursor: pointer;
    padding: 5px;

    &:hover {
      background-color: ${({ theme }) => theme.background.viewBtnColor};
    }
  }
`;

export const MobileNavItem = styled(NavLink)`
  display: block;
  padding: 15px 10px;
  color: ${({ theme }) => theme.color.primary};
  text-decoration: none;
  font-size: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.background.viewBtnColor};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.color.hover};
    background-color: ${({ theme }) => theme.background.viewBtnColor};
    padding-left: 20px;
  }
  
  &.active {
    color: ${({ theme }) => theme.color.hover};
    background-color: ${({ theme }) => theme.background.viewBtnColor};
    border-left: 4px solid ${({ theme }) => theme.canvas};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;
export const SortContainer = styled.div`
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  
  label {
    color: ${({ theme }) => theme.color.primary};
    font-weight: 500;
    min-width: 70px;
  }
  
  select {
    border-radius: 6px;
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.background.viewBtnColor};
    background-color: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.color.primary};
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.canvas};
    }
  }
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin: 10px 0;
    
    label {
      min-width: auto;
    }
    
    select {
      width: 100%;
      max-width: 200px;
      padding: 12px;
      font-size: 16px;
    }
  }
`;
