class HttpError extends Error {

    constructor(message?: string) {

        super(message);

        this.name = this.constructor.name;

    }

}




// should be 401

export class UnautorizedHttpError extends HttpError {};




// should be 404

export class NotFoundHttpError extends HttpError {};




// should be 409 Conflict eg emali already taken

export class ConflicHttptError extends HttpError {};




//should be 400

export class BadRequestHttpError extends HttpError {};