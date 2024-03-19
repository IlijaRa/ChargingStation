import { Dictionary } from "../common";

export class FormElementError {
    required: boolean = false;
    invalid: boolean = false;
    message?: string;
}

export class FormElement {
    value: any;
    error: FormElementError = new FormElementError();
    mandatory: boolean = false;
}

export class Form {
    elements: Dictionary = [];

    isValid(): boolean {

        let isValid = true;

        for (const elementName in this.elements)
        {
            if (this.elements[elementName] instanceof FormElement) {

                let element: FormElement = this.elements[elementName] as FormElement;

                if (element) {
                    element.error.required = false;
                    if (element.mandatory) {
                        if (!element.value || element.value.toString().trim() == '') {
                            element.error.required = true;
                            isValid = false;
                        }
                    }
                }
            }
            else if (Array.isArray(this.elements[elementName])) {
                for (const element of this.elements[elementName]) {
                    if (element instanceof Form) {
                        isValid = element.isValid() && isValid;
                    }
                }
            }
        }

        return isValid;
    }
}