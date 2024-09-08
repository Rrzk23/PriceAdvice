import { Alert } from "@mui/material";
import React from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { CgAdd } from "react-icons/cg";
import AddEditPriceNoteDialog from '../components/AddEditPriceNoteDialog';
import PriceNote from '../components/PriceNote';
import { Price } from '../models/price';
import * as PriceNoteApi from "../network/priceNote_api";
import styles from "../styles/PriceNotes.module.css";
import utilsStlyes from "../styles/utils.module.css";





const LoggedInUserPage = () => {

    const [prices, setPrices] = React.useState<Price[]>([]);
    const [showAddPriceNoteDialog, setShowAddPriceNoteDialog] = React.useState<boolean>(false);
    const [showEditPriceNoteDialog, setShowEditPriceNoteDialog] = React.useState<boolean>(false);
    const [priceNoteToEdit, setPriceNoteToEdit] = React.useState<Price|null>(null);
    const [isPricesloading, setIsPricesloading] = React.useState<boolean>(true);
    const [showPricesLoadingError, setShowPricesLoadingError] = React.useState<boolean>(false);



    React.useEffect(() => {
        async function fetchPrices() {
          try{
            //在package.json 加了proxy就不需要前缀同时避开了cros error
            //如果想要后台api可以被任何访问需要用corspackage
            setShowPricesLoadingError(false);
            setIsPricesloading(true);
            
            const prices = await PriceNoteApi.fetchPriceNotes();
            setPrices(prices);
            
          }
          catch(error){
            console.error("Error fetching prices: ", error);
            setShowPricesLoadingError(true);
          }
          finally{
            setIsPricesloading(false);
          }
        }
        fetchPrices();
      }, []);

    const handleAddPriceNoteDialogShow = () => {
        setShowAddPriceNoteDialog(true);
      }
      const handleAddPriceNoteDialogHide = () => {
        setShowAddPriceNoteDialog(false);
      }
      async function onDeleteHandler(price: Price){
        try {
          await PriceNoteApi.deletePriceNote(price._id);
          setPrices(prices.filter((note: Price) => note._id!== price._id));
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
      async function onEditNoteClicked(price: Price){
        try {
          setPriceNoteToEdit(price);
          setShowEditPriceNoteDialog(true);
          
        } catch (error) {
          console.error(error);
          alert(error);
        }
    
      }
      const handleEditPriceNoteDialogHide = () => {
        setShowEditPriceNoteDialog(false);
        setPriceNoteToEdit(null);
      };
      async function onNoteClicked(price: Price){
        //fetch price and show dialog
        //...
      }

    return (
        <Container className={styles.priceNotesPage}>
      
      {isPricesloading && 
        <Spinner 
          animation="border" 
          variant='primary'
          role="status"
          aria-hidden="true"/>
      }

      {showPricesLoadingError && 
        <Alert variant="outlined" severity="error" >
          Error fetching prices, please try again later!
        </Alert>
      }

      {prices.length === 0 &&!isPricesloading &&!showPricesLoadingError &&
        <Alert variant="outlined" severity="info" onClose={() => {}}>
          You dont't have any price note yet! Add Some
        </Alert>
      }
      { prices.length > 0 &&!isPricesloading &&!showPricesLoadingError &&
        <Row xs={1} md={2} lg={3} className={`g-4${styles.priceNotesGrid}`}>
          {prices.map((note: Price) => (
            <Col key={note._id} className={styles.priceNotesCol}>
              <PriceNote
                priceNote={note} 
                key ={note._id} 
                className={styles.priceNote}
                onEditNoteClicked={onEditNoteClicked}
                onNoteClicked={onNoteClicked}
                onDeleteNoteClicked={onDeleteHandler}/>
            </Col>
          
        ))}
        </Row>
      }
      <Button
        className={`'mb-4' ${utilsStlyes.blockCenter} ${utilsStlyes.flexCenter}`}
        onClick = {handleAddPriceNoteDialogShow}
        disabled = {isPricesloading || showPricesLoadingError}>
        
          <CgAdd />
          Add new note
      </Button>
      {/* When only open the addEditDialog to add new post */}
      <AddEditPriceNoteDialog
            show={showAddPriceNoteDialog}
            onHide={handleAddPriceNoteDialogHide}
            onSaved={(newPriceNote) => {
              setPrices([...prices, newPriceNote]);
              setShowAddPriceNoteDialog(false);
            }}
          />
        {/*When only edit an existing node It must seperate the show attribute to two different state
        otherwise will cause the add mode open to and somehow turn its submit button to even the edit mode is on */}
      {priceNoteToEdit && showEditPriceNoteDialog
        && <AddEditPriceNoteDialog
        show={showEditPriceNoteDialog}
        onHide={handleEditPriceNoteDialogHide}
        onSaved={(updatedNote) => {
          //for priceNote in prices. if id is matching
          const updatePrices = prices.map(
            (existingPriceNote: Price) => 
              existingPriceNote._id === updatedNote._id ? updatedNote : existingPriceNote
          )
          setPrices(updatePrices);
          handleEditPriceNoteDialogHide();
        }
        }
        priceToEdit={priceNoteToEdit}

        />
        
      }
    </Container>
    )
}

export default LoggedInUserPage;