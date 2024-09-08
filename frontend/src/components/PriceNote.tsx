import {Price} from "../models/price";
import {Card} from "react-bootstrap"
import React from "react";
import styles from "../styles/PriceNote.module.css";
import utilsStyles from "../styles/utils.module.css";
import {formatDate} from "../utils/formatDate";
import {MdDelete} from "react-icons/md";
import { CiEdit } from "react-icons/ci";

interface PriceNoteProps {
    priceNote: Price,
    className?: string,
    onDeleteNoteClicked: (priceNote : Price) => void,
    onEditNoteClicked: (priceNote : Price) => void
    onNoteClicked: (priceNote : Price) => void
}

const PriceNote = (prop : PriceNoteProps) => {
    const {location, price, title , createdAt, updatedAt} = prop.priceNote;
    let dateString: string;
    if(updatedAt > createdAt) {
        dateString = "Updated " + formatDate(updatedAt);
    }
    else {
        dateString = "Created at " + formatDate(createdAt);
    }
    return (
        // adding two possible class names.
        <Card className={`${styles.noteCard} ${prop.className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title className={`${styles.cardText} ${utilsStyles.titleContainer}`}> 
                    <div className={utilsStyles.firstTitle}>{title}</div>
                    <CiEdit 
                        className= "text-muted ms-auto " 
                        title="edit this note"
                        onClick={ () => {
                            prop.onEditNoteClicked(prop.priceNote)
                        }}
                    />
                    <MdDelete 
                        className="text-muted ms-auto"
                        onClick={ (e)=> {
                            prop.onDeleteNoteClicked(prop.priceNote)
                            e.stopPropagation();// preventing parent click event from firing
                        }}
                        title="delete this note"
                    />
                </Card.Title>
                
                <Card.Text>
                    Location: {location}
                    <br/>
                    Price: {price}
                    <br/>
                    Created At: {createdAt}
                    <br/>
                    Updated At: {updatedAt}
                </Card.Text>

            </Card.Body>
            <Card.Footer className="text-muted">
                {dateString}
            </Card.Footer>
        </Card>
    )
}
export default PriceNote;