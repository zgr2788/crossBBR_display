import Loader from './Loader'
import Plotmodal from './Plotmodal'
import {useContext, useEffect, useMemo, useState} from 'react'
import { TableContext } from '../context/TableContext'
import MaterialReactTable from 'material-react-table';
import { Button, Box } from '@mui/material';
import { ExportToCsv } from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';



const Aggtable = () => {

    const [loading, setLoading, tableArgs,] = useContext(TableContext)

    const [genes, setGenes] = useState(null)
    const [active, setActive] = useState(false)
    const [curID, setCurID] = useState(null)
    const [curName, setCurName] = useState(null)

    const longcolsize = 150

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
            enableSorting: false,

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
            enableClickToCopy: true,
            Cell: ({ cell }) => <a href={`https://www.proteinatlas.org/search/${cell.row.original.gene_names}`} target="_blank" rel="noreferrer">{cell.row.original.gene_names}</a> ,

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'uniprot',
            header: "Uniprot ID", 
            Header: <strong className="text-secondary">Uniprot ID</strong>,
            Cell: ({ cell }) => (<>{cell.row.original.uniprot ?  <a href={`https://www.ebi.ac.uk/interpro/search/text/${cell.row.original.uniprot}`} target="_blank" rel="noreferrer">{cell.row.original.uniprot}</a> : <span>Not matched</span>}</>) ,
            enableSorting: false,
            enableClickToCopy: true,

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
            Cell: ({ cell }) => (<strong onClick={ () => {handlePlot(cell.row.original.Name, cell.row.original.gene_names)} }>{cell.row.original.Score}</strong>),

            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
          },
          {
            accessorKey: 'DESeq2_Appeared',
            header: "DESeq2", 
            Header: <strong className="text-secondary">Top in DESeq2 aggregate?</strong>,
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Appeared ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',            
            enableSorting: false,

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
            Header: <strong className="text-secondary">Top in DESeq2 bootstrap?</strong>,
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.DESeq2_Validated ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',        
            enableSorting: false,

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
            Header: <strong className="text-secondary">Top in WRST aggregate?</strong>,
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Appeared ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',
            enableSorting: false,

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
            Header: <strong className="text-secondary">Top in WRST bootstrap?</strong>,
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Wilcox_Validated ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>) ,
            filterVariant: 'checkbox',
            enableSorting: false,

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
            Header: <strong className="text-secondary">Protein Evidence?</strong>,
            size: longcolsize,
            Cell: ({ cell }) => (<>{cell.row.original.Prot_Evidence ?  <span>&#x2714;</span> : <span>&#x2718;</span>}</>),
            filterVariant: 'checkbox',
            enableSorting: false,

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
            Header: <strong className="text-secondary">Perfusion Score</strong>,
            enableColumnFilter : false,
            Cell: ({ cell }) => <strong>{cell.row.original.mean_perf_score}</strong>, 


            muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
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
            enableRowSelection

            muiTableBodyRowProps={({ row }) => ({
                onClick: row.getToggleSelectedHandler(),
                sx: { cursor: 'pointer' },
            })}

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