

import React, { useState, useEffect, useRef} from 'react';
//import  Map  from './pages/map.tsx'; 
//import LocationFilter from './components/locationFilter.tsx';
import {Button, Container, Row, Col, Spinner} from 'react-bootstrap'
import { Price } from './models/price';
import PriceNote from './components/PriceNote';
import styles from "./styles/PriceNotes.module.css";
import utilsStlyes from "./styles/utils.module.css";
import * as PriceNoteApi from "./network/priceNote_api";
import AddEditPriceNoteDialog from './components/AddEditPriceNoteDialog';
import { CgAdd } from "react-icons/cg";

const App: React.FC = () => {

  const [prices, setPrices] = useState<Price>([]);
  const [showAddPriceNoteDialog, setShowAddPriceNoteDialog] = useState<boolean>(false);
  const [showEditPriceNoteDialog, setShowEditPriceNoteDialog] = useState<boolean>(false);
  const [priceNoteToEdit, setPriceNoteToEdit] = useState<Price|null>(null);
  const [isPricesloading, setIsPricesloading] = useState<boolean>(true);
  const [showPricesLoadingError, setShowPricesLoadingError] = useState<boolean>(false);

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

  useEffect(() => {
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
  
  return (
    //responsive row, xs for displaying on mobile devices
    // md for tablet, lg for desktop devices.
    <Container className={styles.priceNotesPage}>
      {isPricesloading && 
        <Spinner 
          animation="border" 
          variant='primary'
          role="status"
          aria-hidden="true"/>
      }

      {showPricesLoadingError && 
      <div>
        Error fetching prices. Please try again later.
      </div> 
      }

      {prices.length === 0 &&!isPricesloading &&!showPricesLoadingError &&
       <div>You dont't have any price note yet! Add Some</div>
      }
      { prices.length > 0 &&!isPricesloading &&!showPricesLoadingError &&
        <Row xs={1} md={2} lg={3} className={`g-4${styles.priceNotesGrid}`}>
          {prices.map((note: Price) => (
            <Col key={note._id}>
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
  );
}

export default App;
