import { Price } from '../models/price';
import {BadRequestHttpError, ConflicHttptError, NotFoundHttpError, UnautorizedHttpError} from '../errors/http-errors';
// using fetch data to get the response first and return either the response or the error message.
export async function fetchData(input: RequestInfo, init?: RequestInit){
 
    const response = await fetch(input,init);
    if(response.ok) {
        return response;
    }
    else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        switch(response.status) {
            case 401:
                throw new UnautorizedHttpError(errorMessage);
            case 404:
                throw new NotFoundHttpError(errorMessage);
            case 409:
                throw new ConflicHttptError(errorMessage);
            case 400:
                throw new BadRequestHttpError(errorMessage);
            default:
                throw new Error('Request failed with status ' + response.status + ': ' + errorMessage);
        }


        
    }

}
// then using the fetchpricesnote to get error or array of prices
export async function fetchPriceNotes(): Promise<Price> {
    const response = await fetchData('api/prices/getprices', {method: 'GET'});
    return response.json();
}
export interface PriceNoteInput {
    location: string;
    price: string;
    title: string;
}
export async function createNewPriceNote(priceNoteInput: PriceNoteInput): Promise<Price> {
    const response = await fetchData('api/prices/post', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(priceNoteInput),
    });
    return response.json();
}
export async function deletePriceNote(priceId: string) {
    await fetchData(`api/prices/deleteprice/${priceId}`, {method: 'DELETE'});
}
export async function updatePriceNote(priceId: string, priceNoteInput: PriceNoteInput): Promise<Price> {
    const response = await fetchData(`api/prices/updateprice/${priceId}`,{
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(priceNoteInput)
    } );
    return response.json();
}