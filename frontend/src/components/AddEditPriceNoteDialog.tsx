import { Button, Form, Modal, Row } from 'react-bootstrap';
import React from "react";
import {FieldErrors, useForm}  from "react-hook-form";
import { PriceNoteInput } from '../network/priceNote_api';
import * as PriceNoteApi from "../network/priceNote_api";
import { Price } from '../models/price';
interface AddPriceNoteDialogProp {
    show: boolean;
    onHide: () => void;
    onSaved: (price : Price) => void;
    priceToEdit?: Price;
}
const AddEditPriceNoteDialog = (prop : AddPriceNoteDialogProp) => {

    const { register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<PriceNoteInput>( {
        defaultValues: prop.priceToEdit || {}
    });

    async function onSubmit(input : PriceNoteInput) {
        console.log("prop.priceToEdit");
        console.log(prop.priceToEdit);
        try {
            let noteResponse : Price;
            console.log("prop.priceToEdit");
            console.log(prop.priceToEdit);
            if (prop.priceToEdit) {
                console.log("reday to update price")
                noteResponse = await PriceNoteApi.updatePriceNote(prop.priceToEdit._id, input);
            } else {
                console.log("reday to create price")
                noteResponse =await PriceNoteApi.createNewPriceNote(input);
            }
            
            prop.onSaved(noteResponse);
            reset();
        } catch (error) {
            console.error('Error adding and edit price note:', error);
            alert(error);
        }
    }
    const onError = (error: FieldErrors<PriceNoteInput>) => {
        console.log("prop.priceToEdit");
        console.log(prop.priceToEdit?._id);
        
        console.log("Form errors: " + error);
        // TODO: handle specific error messages for each field
    } ;
    return (
        <Modal show = {prop.show} onHide={prop.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {prop.priceToEdit ? "Edit Price Note" : "Add Price Note"}
                </Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <Form id = "addEditPriceNoteForm" onSubmit={handleSubmit(onSubmit, onError)}>
                        <Form.Group className = "mb-3">
                            <Form.Label>title</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter title" 
                                isInvalid={!!errors.title}
                                {...register("title", {required : true})}
                            />
                            <Form.Control.Feedback type = "invalid">
                                {errors.title?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className = "mb-3">
                            <Form.Label>location</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={5} 
                                placeholder="Enter location" 
                                {...register("location", {required : true})} 
                            />
                        </Form.Group>
                        <Form.Group className = "mb-3">
                            <Form.Label>price</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter price" 
                                {...register("price", {required : true})} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={prop.onHide}>Close</Button>
                    <Button onClick={() => reset()}>Reset</Button>
                    <Button disabled={true}>Save</Button>
                    <Button 
                        type = "submit" 
                        form = "addEditPriceNoteForm"
                        disabled = {isSubmitting}
                    >
                        Submit
                    </Button>
                    <Form.Control.Feedback type = "invalid">
                                {errors.title?.message}
                            </Form.Control.Feedback>
                </Modal.Footer>
            
        </Modal>
    );
}

export default AddEditPriceNoteDialog;