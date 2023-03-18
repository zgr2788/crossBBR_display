import { useState, useEffect, useContext } from 'react'
import { TableContext } from '../context/TableContext';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';

const Sortmenu = () => {

    const [filtArgs,setFiltArgs,sortArgs,setSortArgs,tableArgs,setTableArgs] = useContext(TableContext)

    

    const DropSwitch = ({text, id}) => {

        const [checked, setChecked] = useState(true)
        

        const handleCheck = () => {
            if (checked) {
                setChecked(false)
                var args = JSON.parse(filtArgs)
                args[id] = false
                setFiltArgs(JSON.stringify(args))
            } else {
                setChecked(true)
                var args = JSON.parse(filtArgs)
                args[id] = true
                setFiltArgs(JSON.stringify(args))
            }
        }

        return(
            <div className='container-fluid'>
                <Form>
                    <Form.Check 
                      type="switch"
                      id={id}
                      label={text}
                      defaultChecked
                      onChange={handleCheck}
                    />
                </Form>
            </div>
        )

    }


    return(
        <>
          <div className="container-fluid">

            <DropdownButton
                as={ButtonGroup}
                key="colSelect"
                id="colSelect"
                variant="primary"
                title="Select which columns to show" 
            >
                
                {{
                    true:
                    <>
                        <DropSwitch text={"Rank p-val"} id={"Rank_p__val"}/> 
                        <DropSwitch text={"Mean Perfusion Score"} id={"Mean_Perfusion_Score"} />
                        <DropSwitch text={"Top in DESeq2 Aggregate?"} id={"DESeq2_Appeared"} />
                        <DropSwitch text={"Top in DESeq2 Bootstrap?"} id={"DESeq2_Validated"} />
                        <DropSwitch text={"Top in WRST Aggregate?"} id={"Wilcox_Appeared"} />
                        <DropSwitch text={"Top in WRST Bootstrap?"} id={"Wilcox_Validated"} />
                        <DropSwitch text={"Protein Evidence from PXD01862?"} id={"Prot_Evidence"} />
                        <DropSwitch text={"Actions"} id={"Actions"} />
                    </>
                    ,

                    false:
                    <>
                        <DropSwitch text={"Rank p-val"} id={"Rank_p__val"}/> 
                        <DropSwitch text={"Mean Perfusion Score"} id={"Mean_Perfusion_Score"} />
                        <DropSwitch text={"Top in Bootstrap?"} id={"Validated"} />
                        <DropSwitch text={"Actions"} id={"Actions"} />
                    </>



                }[tableArgs === "all"]}

            </DropdownButton>
            
            {' '}

            <DropdownButton
                as={ButtonGroup}
                key="filterSelect"
                id="filterSelect"
                variant="info"
                title="Adjust filters & sort" 
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