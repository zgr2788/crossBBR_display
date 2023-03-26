import Loader from './Loader'
import Plotmodal from './Plotmodal'
import {useContext, useEffect, useMemo, useState} from 'react'
import { TableContext } from '../context/TableContext'
import MaterialReactTable from 'material-react-table';
import { Button } from '@mui/material';



const Aggtable = () => {

    const [loading, setLoading, tableArgs,] = useContext(TableContext)


    const [genes, setGenes] = useState(null)
    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)
    const [curName, setCurName] = useState(null)


    const fetchGenes = async () => {

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch("/api/omics/data/" + tableArgs, requestOptions);
        

        if (!response.ok) {
            console.log("Bad Request")
        }
        else {
            const data = await response.json()
            setGenes(Object.values(JSON.parse(data)))
            console.log(Object.values(JSON.parse(data)))
            setLoading(true)
        }
    }


    // Column operations here for table
    const cols = useMemo(
        () => [
          {
            accessorKey: 'Name',
            header: "Gene ID", 
            Header: <strong className="text-secondary">Gene ID</strong>,
            enableClickToCopy: true,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'gene_names',
            header: "Gene Name", 
            Header: <strong className="text-secondary">Gene Name</strong>,
            enableSorting: false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'Score',
            header: "Significance", 
            Header: <strong className="text-secondary">Significance</strong>,
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'DESeq2_Appeared',
            header: "DESeq2 Aggregate Appearance", 
            Header: <strong className="text-secondary">Top in DESeq2 aggregate?</strong>,
            size: 200,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Appeared ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'DESeq2_Validated',
            header: "DESeq2 Bootstrap Appearance", 
            Header: <strong className="text-secondary">Top in DESeq2 bootstrap?</strong>,
            size: 200,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Validated ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'Wilcox_Appeared',
            header: "WRST Aggregate Appearance", 
            Header: <strong className="text-secondary">Top in WRST aggregate?</strong>,
            size: 200,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Appeared ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'Wilcox_Validated',
            header: "WRST Bootstrap Appearance", 
            Header: <strong className="text-secondary">Top in WRST bootstrap?</strong>,
            size: 200,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Validated ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'Prot_Evidence',
            header: "Protein Evidence", 
            Header: <strong className="text-secondary">Protein Evidence from PXD01862?</strong>,
            size: 200,
            Cell: ({ cell }) => (<>{cell.row.original.Prot_Evidence ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>),
            enableColumnFilter : false,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'actions',
            header: "Actions", 
            Header: <strong className="text-secondary">Actions</strong>,
            columnDefType: 'display',
            Cell: ({ row }) => (
                <Button onClick={ () => {handlePlot(row.original.Name, row.original.gene_names)} }>Get Counts</Button>
            ),
            
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
        ],[],);

    const handleModal = () => {
        setActive(!active);
        setTimeout(() => setCurID(null), 200);
    }

    const handlePlot = (geneID, geneName) => {
        setCurID(geneID)
        setCurName(geneName)
        setActive(true)
    }
    

    // For mount purposes
   
    useEffect(() => {
      fetchGenes()
    // eslint-disable-next-line
    }, [tableArgs])

    return(
        
        <>
        

        {loading ? (
            <>
            <Plotmodal active={active} geneID={curID} geneName={curName} handleModal={handleModal}/>

            <div>
            <MaterialReactTable 
            columns={cols} 
            data={genes}
            />
            </div>
            </>

        ) : (<><br/><div className="container-fluid d-flex justify-content-center"><Loader /></div></>)}
      </>

    )
}

export default Aggtable;