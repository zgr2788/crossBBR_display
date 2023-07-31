import Loader from './Loader'
import Plotmodal from './Plotmodal'
import {useContext, useEffect, useMemo, useState} from 'react'
import { TableContext } from '../context/TableContext'
import MaterialReactTable from 'material-react-table';
import { Button, Box } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';



const Aggtable = () => {

    const [loading, setLoading] = useContext(TableContext)

    const [genes, setGenes] = useState(null)
    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)
    const [curName, setCurName] = useState(null)

    const longcolsize = 50

    const fetchGenes = async () => {

        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        const response = await fetch("/api/omics/data/all", requestOptions);
        

        if (!response.ok) {
            console.log("Bad Request")
        }
        else {
            const data = await response.json()
            setGenes(Object.values(JSON.parse(data)))
            setLoading(true)
        }
    }


    // Column operations here for table
    const cols = useMemo(
        () => [
          {
            accessorKey: 'Name',
            header: "Gene ID", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "110px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene ID</strong>
              </div>
            ),
            enableClickToCopy: true,
            enableSorting: false,
            enableColumnActions: false,


          },
          {
            accessorKey: 'gene_names',
            header: "Gene Name", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "110px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Gene Name</strong>
              </div>
            ),
            enableSorting: false,
            enableClickToCopy: true,
            enableColumnActions: false,
            Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.gene_names}`} target="_blank" rel="noreferrer">{cell.row.original.gene_names}</a> ,

          },
          {
            accessorKey: 'uniprot',
            header: "Uniprot ID", 
            Header:() => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "110px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Uniprot ID</strong>
              </div>
            ),
            Cell: ({ cell }) => (<>{cell.row.original.uniprot ?  <a href={`https://www.ebi.ac.uk/interpro/search/text/${cell.row.original.uniprot}`} target="_blank" rel="noreferrer">{cell.row.original.uniprot}</a> : <span>Not matched</span>}</>) ,
            enableSorting: false,
            enableClickToCopy: true,
            enableColumnActions: false,

          },
          {
            accessorKey: 'Score',
            header: "Significance", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "110px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Significance</strong>
              </div>
            ),
            enableColumnFilter : false,
            enableColumnActions: false,
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Name, cell.row.original.gene_names)} } style={{cursor:'pointer'}}>{cell.row.original.Score}</strong>),

          },
          {
            accessorKey: 'DESeq2_Appeared',
            header: "DESeq2", 
            Header:() => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "140px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                DESeq2 Aggregate
              </div>
            ),
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Appeared ?  <span style={{ marginRight: "17px" }}>&#x2714;</span> : <span style={{ marginRight: "17px" }}>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',            
            enableSorting: false,
            enableColumnActions: false,

            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'DESeq2_Validated',
            header: "DESeq2 Bootstrap", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "140px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                DESeq2 Bootstrap
              </div>
            ),
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Validated ?  <span style={{ marginRight: "17px" }}>&#x2714;</span> : <span style={{ marginRight: "17px" }}>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',        
            enableSorting: false,
            enableColumnActions: false,

            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },

          },
          {
            accessorKey: 'Wilcox_Appeared',
            header: "WRST", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "140px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                WRST Aggregate
              </div>
            ),
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Appeared ?  <span style={{ marginRight: "17px" }}>&#x2714;</span> : <span style={{ marginRight: "17px" }}>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,

            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },

          },
          {
            accessorKey: 'Wilcox_Validated',
            header: "WRST Bootstrap", 
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "140px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                WRST Bootstrap
              </div>
            ),
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Validated ?  <span style={{ marginRight: "17px" }}>&#x2714;</span> : <span style={{ marginRight: "17px" }}>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,

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
            Header: () => (
              <div
                style={{
                  transform: "rotate(270deg)",
                  whiteSpace: "nowrap",
                  height: "140px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Protein Evidence
              </div>
            ),
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Prot_Evidence ?  <span style={{ marginRight: "17px" }}>&#x2714;</span> : <span style={{ marginRight: "17px" }}>&#x2718;</span>}</>),
            filterVariant: 'checkbox',
            enableSorting: false,
            enableColumnActions: false,

            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
          },
          {
            accessorKey: 'mean_perf_score',
            header: "Mean Perfusion Score", 
            Header: () => (
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "110px", // Set the desired height for the header container
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <strong style = {{ display: "inline-block", alignSelf: "flex-end" }}>Perfusion Score</strong>
              </div>
            ),
            enableColumnFilter : false,
            enableColumnActions: false,
            Cell: ({ cell }) => <strong>{cell.row.original.mean_perf_score}</strong>, 
          },
        ],[],);
    
    //CSV export
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: cols.map((c) => c.header),
        filename: "export_list"
    };
    
    const csvExporter = new ExportToCsv(csvOptions);

    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };
    
    const handleExportData = () => {
      csvExporter.generateCsv(genes);
    };

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
    }, [])

    return(
        
        <>
        

        {loading ? (
            <>
            <Plotmodal active={active} geneID={curID} geneName={curName} handleModal={handleModal}/>

            <div>
            <MaterialReactTable 
            columns={cols} 
            data={genes}
            enableRowSelection

            muiTableHeadCellProps={{

                sx: {
                  '& .Mui-TableHeadCell-Content': {
        
                    justifyContent: 'space-between',
                  },
                },
            }}

            renderTopToolbarCustomActions={({ table }) => (
                <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    color="primary"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    Export All genes
                  </Button>
        
                  <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                    variant="contained"
                  >
                    Export Selection
                  </Button>
                </Box>
              )}
            />
            </div>
            </>

        ) : (<><br/><div className="container-fluid d-flex justify-content-center"><Loader /></div></>)}
      </>

    )
}

export default Aggtable;