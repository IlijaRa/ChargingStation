import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Form, FormElement, UserGetByIdDto, UsersService, ViewState } from "src/app/core";

@Component({
    selector: 'user',
    templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit{
    form: Form = new Form();

    viewState = ViewState;

    errorMessages?: string[];

    user?: UserGetByIdDto;
    @Input() state: ViewState = ViewState.Create;
    @Input() id?: string;

    @Output() onEntityAction: EventEmitter<void> = new EventEmitter<void>();
    
    constructor(private usersService: UsersService) { }

    ngOnInit(): void {
        this.initForm();
        console.log("uso");
        if (this.state == ViewState.Edit || this.state == ViewState.Details) {
            // this.getById(this.id);
            console.log("this.id", this.id)
        }
    }

    getById(id?: string) {
        this.usersService.getById(id).then((response: UserGetByIdDto) => {
            this.user = response;
            console.log("this.user", this.user);
        })
    }

    // private async getById(id?: string): Promise<void> {
    //     return new Promise((resolve: any) => {
    //         this.usersService.getById(id).then((response: UserGetByIdDto) => {
    //             this.user = response;
    //             console.log("this.user", this.user);
    //             resolve();
    //           })
    //     })
    // }

    private initForm() {
        // this.form.elements['firstName'] = new FormElement();
        // this.form.elements['firstName'].mandatory = true;

        // this.form.elements['lastName'] = new FormElement();
        // this.form.elements['lastName'].mandatory = true;

        // this.form.elements['dateOfBirth'] = new FormElement();
        // this.form.elements['dateOfBirth'].mandatory = true;

        // this.form.elements['username'] = new FormElement();
        // this.form.elements['username'].mandatory = true;

        // this.form.elements['emailAddress'] = new FormElement();
        // this.form.elements['emailAddress'].mandatory = true;

        // this.form.elements['isBlocked'] = new FormElement();
        // this.form.elements['isBlocked'].mandatory = true;

        // this.form.elements['isConfirmed'] = new FormElement();
        // this.form.elements['isConfirmed'].mandatory = true;
    }

    private onAction() {
        this.onEntityAction.emit();
    }

    cancel() {
        this.onAction();
    }
}