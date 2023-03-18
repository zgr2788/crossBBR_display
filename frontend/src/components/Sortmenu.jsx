import { useContext } from 'react'
import { TableContext } from '../context/TableContext';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';

const Sortmenu = () => {

    const [filtArgs,setFiltArgs,sortArgs,setSortArgs,tableArgs,,,,nextPrio] = useContext(TableContext)

   
    const parsedFilt = JSON.parse(filtArgs)
    const parsedSort = JSON.parse(sortArgs)

    const FiltSwitch = ({text, id}) => {

        const handleCheck = () => {
            var args = JSON.parse(filtArgs)
            args[id] = !args[id]
            setFiltArgs(JSON.stringify(args))
        }

        return(
            <div className='container-fluid'>
                <Dropdown.Item disabled>
                </Dropdown.Item>
                <Form>
                    <Form.Check 
                      type="switch"
                      id={id}
                      label={text}
                      checked={parsedFilt[id]}
                      onChange={handleCheck}
                    />
                </Form>
            </div>
        )

    }


    const SortSwitch = ({text, id}) => {



        const handleCheckSort = () => {
            var args = JSON.parse(sortArgs)
            
            if (args[id] === -1){
                args[id] = nextPrio.pop()
            } else {
                nextPrio.push(args[id])
                nextPrio.sort((a, b) => a < b ? 1 : -1)
                args[id] = -1
            }  
            
            setSortArgs(JSON.stringify(args))
        }
        

        return(
            <div className='container-fluid'>
                <Dropdown.Item disabled>
                </Dropdown.Item>
                <Form>
                    <Form.Check 
                      type="switch"
                      id={id}
                      label={parsedSort[id] === -1 ? text : <span>{text} - <span className='text-info'><strong>{parsedSort[id]}</strong></span></span>}
                      checked={parsedSort[id] === -1 ? false : true}
                      onChange={handleCheckSort}
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
                variant="secondary"
                menuVariant="dark"
                drop="down"
                title={<strong>Select which columns to show</strong>} 
            >
                
                {{
                    true:
                    <>
                        <FiltSwitch text={"Rank p-val"} id={"Rank_p__val_f"}/> 
                        <FiltSwitch text={"Mean Perfusion Score"} id={"Mean_Perfusion_Score_f"} />
                        <FiltSwitch text={"Top in DESeq2 Aggregate?"} id={"DESeq2_Appeared_f"} />
                        <FiltSwitch text={"Top in DESeq2 Bootstrap?"} id={"DESeq2_Validated_f"} />
                        <FiltSwitch text={"Top in WRST Aggregate?"} id={"Wilcox_Appeared_f"} />
                        <FiltSwitch text={"Top in WRST Bootstrap?"} id={"Wilcox_Validated_f"} />
                        <FiltSwitch text={"Protein Evidence from PXD01862?"} id={"Prot_Evidence_f"} />
                        <FiltSwitch text={"Actions"} id={"Actions_f"} />
                    </>
                    ,

                    false:
                    <>
                        <FiltSwitch text={"Rank p-val"} id={"Rank_p__val_f"}/> 
                        <FiltSwitch text={"Mean Perfusion Score"} id={"Mean_Perfusion_Score_f"} />
                        <FiltSwitch text={"Top in Bootstrap?"} id={"Validated_f"} />
                        <FiltSwitch text={"Actions"} id={"Actions_f"} />
                    </>



                }[tableArgs === "all"]}

            </DropdownButton>
            
            {' '}

            <DropdownButton
                as={ButtonGroup}
                key="sortSelect"
                id="sortSelect"
                variant="secondary"
                menuVariant="dark"
                drop="down"
                title={<strong>Adjust sorting priority for selected columns</strong>} 
            >
                
                {{
                    true:
                    <>
                        <SortSwitch text={"Rank p-val"} id={"Score"}/> 
                        <SortSwitch text={"Mean Perfusion Score"} id={"Mean Perfusion Score"} />
                        <SortSwitch text={"Top in DESeq2 Aggregate?"} id={"DESeq2_Appeared"} />
                        <SortSwitch text={"Top in DESeq2 Bootstrap?"} id={"DESeq2_Validated"} />
                        <SortSwitch text={"Top in WRST Aggregate?"} id={"Wilcox_Appeared"} />
                        <SortSwitch text={"Top in WRST Bootstrap?"} id={"Wilcox_Validated"} />
                        <SortSwitch text={"Protein Evidence from PXD01862?"} id={"Prot_Evidence"} />
                    </>
                    ,

                    false:
                    <>
                        <SortSwitch text={"Rank p-val"} id={"Score"}/> 
                        <SortSwitch text={"Mean Perfusion Score"} id={"Mean Perfusion Score"} />
                        <SortSwitch text={"Top in Bootstrap?"} id={"Validated"} />
                    </>



                }[tableArgs === "all"]}

            </DropdownButton>

          </div>

        </>
    )
        

};

export default Sortmenu;