import styled from "styled-components";
import Form from "react-bootstrap/Form";
import { CiSearch } from "react-icons/ci";

export const InputSearchContainer = styled(Form)`
  margin: 20px;
  position: relative;
  display: inline-block;
  width: 40%;
  flex-grow: 1;
  max-width: 400px;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
  }
  
  @media screen and (max-width: 480px) {
    margin: 8px 0;
  }

  .form-control {
    height: 44px;
    font-size: 16px;
    padding: 12px 45px 12px 12px;
    border-radius: 8px;
    
    :focus {
      box-shadow: none !important;
      border-color: ${({ theme }) => theme.canvas};
    }
    :hover {
      border-color: #c0c0fa;
    }
    
    @media screen and (max-width: 768px) {
      height: 48px;
      font-size: 16px;
      padding: 14px 50px 14px 14px;
    }
  }
`;

export const StyledSearchIcon = styled(CiSearch)`
  color: ${({ theme }) => theme.color.muted};
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  pointer-events: none;
  
  @media screen and (max-width: 768px) {
    right: 14px;
    width: 20px;
    height: 20px;
  }
`;
