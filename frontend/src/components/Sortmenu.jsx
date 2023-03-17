import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Sortmenu = () => {

    const [,,filtArgs,setFiltArgs,sortArgs,setSortArgs,tableArgs,setTableArgs] = useContext(UserContext)


    return(
        <>
          <div className="container-fluid">

            <DropdownButton
                as={ButtonGroup}
                key="colSelect"
                id="colSelect"
                variant="primary"
                title="Select columns to show" 
            >


                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>

            </DropdownButton>
            
            {' '}

            <DropdownButton
                as={ButtonGroup}
                key="filterSelect"
                id="filterSelect"
                variant="info"
                title="Adjust filters" 
            >
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>

            </DropdownButton>

          </div>

        </>
    )
        

};

export default Sortmenu;